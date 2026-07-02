import os
import uuid
from typing import List, Dict

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.config import settings
from app.models.file import File
from app.models.symbol import Symbol
from app.models.import_model import Import
from app.models.relationship import Relationship
from app.models.metric import Metric
from app.models.repository import Repository
from app.models.repository_statistics import RepositoryStatistics
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from app.models.graph_enums import GraphNodeType, GraphRelationshipType
from app.core.neo4j_client import neo4j_client

from app.services.scanner import RepositoryScanner
from app.services.language_detector import LanguageDetector, Language
from app.services.ast_service import TreeSitterAST, ASTResult
from app.services.symbol_extractor import SymbolExtractor, ExtractionResult
from app.services.parser import ParserFactory
from app.services.relationship_builder import RelationshipBuilder
from app.services.metadata_engine import MetadataEngine, FileMetadata


class ParseService:
    def __init__(self) -> None:
        self.scanner = RepositoryScanner()
        self.detector = LanguageDetector()
        self.ast_gen = TreeSitterAST()
        self.extractor = SymbolExtractor()
        self.parser_factory = ParserFactory()
        self.relationship_builder = RelationshipBuilder()
        self.metadata_engine = MetadataEngine()

    def parse_repository(self, db: Session, repo_id: str) -> RepositoryStatistics:
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if not repo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Repository not found",
            )

        if repo.status != "cloned":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Repository is not cloned. Current status: {repo.status}",
            )

        repo_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
        if not os.path.exists(repo_dir):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Cloned repository directory not found on disk",
            )

        # Clear existing parsed data to allow overwrite
        db.query(RepositoryStatistics).filter(RepositoryStatistics.repository_id == repo_id).delete()
        db.query(Relationship).filter(Relationship.repository_id == repo_id).delete()
        db.query(GraphRelationship).filter(GraphRelationship.repository_id == repo_id).delete()
        db.query(GraphNode).filter(GraphNode.repository_id == repo_id).delete()
        # Deleting files cascades to symbols, imports, and metrics
        db.query(File).filter(File.repository_id == repo_id).delete()
        db.commit()

        # Perform scan
        scan_result = self.scanner.scan(repo_dir)

        file_metas: List[FileMetadata] = []
        extractions: Dict[str, ExtractionResult] = {}
        asts: Dict[str, ASTResult] = {}

        for scanned_file in scan_result.files:
            # Detect language
            detection = self.detector.detect(scanned_file.absolute_path, extension=scanned_file.extension)
            lang = detection.language

            # Read source content
            try:
                with open(scanned_file.absolute_path, "r", encoding="utf-8", errors="ignore") as f:
                    source_content = f.read()
            except Exception:
                source_content = ""

            file_id = str(uuid.uuid4())
            db_file = File(
                id=file_id,
                repository_id=repo_id,
                file_path=scanned_file.relative_path,
                language=lang.value,
                size_bytes=scanned_file.size_bytes,
                code_lines=0,
                comment_lines=0,
                blank_lines=0,
                total_lines=0,
            )

            ast_result = None
            extraction_result = None

            # Process files with AST support
            if self.ast_gen.supports(lang):
                if scanned_file.extension == ".tsx":
                    ast_result = self.ast_gen.parse_tsx_file(scanned_file.absolute_path, source=source_content)
                else:
                    ast_result = self.ast_gen.parse_file(scanned_file.absolute_path, lang, source=source_content)

                if ast_result and not ast_result.error:
                    # Extract symbols
                    extraction_result = self.extractor.extract(ast_result)

                    # Store for relationship builder using relative path as key
                    asts[scanned_file.relative_path] = ASTResult(
                        file_path=scanned_file.relative_path,
                        language=ast_result.language,
                        root=ast_result.root,
                        total_nodes=ast_result.total_nodes,
                        error=ast_result.error
                    )
                    extractions[scanned_file.relative_path] = ExtractionResult(
                        file_path=scanned_file.relative_path,
                        language=extraction_result.language,
                        symbols=extraction_result.symbols,
                        errors=extraction_result.errors
                    )

            # Analyze file metrics
            file_meta = self.metadata_engine.analyse_file(
                file_path=scanned_file.relative_path,
                source=source_content,
                language=lang,
                file_size=scanned_file.size_bytes,
                ast_result=ast_result,
                extraction=extraction_result,
            )
            file_metas.append(file_meta)

            # Update file model fields with computed metrics
            db_file.code_lines = file_meta.lines.code
            db_file.comment_lines = file_meta.lines.comment
            db_file.blank_lines = file_meta.lines.blank
            db_file.total_lines = file_meta.lines.total

            db.add(db_file)

            # Create Metric record
            db_metric = Metric(
                id=str(uuid.uuid4()),
                file_id=file_id,
                complexity_total=file_meta.complexity.total,
                complexity_average=file_meta.complexity.average,
                complexity_max=file_meta.complexity.max,
                complexity_max_function=file_meta.complexity.max_function,
                complexity_per_function=file_meta.complexity.per_function,
                documentation_symbols=file_meta.documentation.documented_symbols,
                total_documentable=file_meta.documentation.total_documentable,
                coverage_percent=file_meta.documentation.coverage_percent,
            )
            db.add(db_metric)

            # Save Symbols
            if extraction_result:
                for sym in extraction_result.symbols:
                    db_symbol = Symbol(
                        id=str(uuid.uuid4()),
                        file_id=file_id,
                        name=sym.name,
                        kind=sym.kind.value,
                        start_line=sym.position.start_row,
                        start_column=sym.position.start_col,
                        end_line=sym.position.end_row,
                        end_column=sym.position.end_col,
                        parent_name=sym.parent_name,
                        docstring=sym.docstring,
                        parameters=sym.parameters,
                        return_type=sym.return_type,
                        decorators=sym.decorators,
                        bases=sym.bases,
                        is_async=sym.is_async,
                        is_exported=sym.is_exported,
                        text=sym.text,
                    )
                    db.add(db_symbol)

            # Save Imports
            parser = self.parser_factory.get_parser(lang)
            if parser:
                try:
                    parse_result = parser.parse(scanned_file.absolute_path, source=source_content)
                    for imp in parse_result.imports:
                        db_import = Import(
                            id=str(uuid.uuid4()),
                            file_id=file_id,
                            module=imp.module,
                            names=imp.names,
                            line=imp.line,
                        )
                        db.add(db_import)
                except Exception:
                    pass

        # Build Relationships and Universal Graph Model
        try:
            graph = self.relationship_builder.build(extractions, asts)

            # Pre-populate top-level architectural layer module nodes
            layers = ["API", "Service", "Repository", "Database"]
            for layer in layers:
                layer_id = f"layer::{layer}"
                db_graph_node = GraphNode(
                    id=layer_id,
                    repository_id=repo_id,
                    type=GraphNodeType.MODULE.value,
                    name=layer,
                    properties={"layer": layer}
                )
                db.add(db_graph_node)

            # Helper to classify folder/file path into architectural layer
            def get_architectural_layer(path: str) -> str:
                path_lower = path.lower()
                if "api" in path_lower:
                    return "API"
                if "service" in path_lower:
                    return "Service"
                if "repository" in path_lower or "repos" in path_lower:
                    return "Repository"
                if "db" in path_lower or "database" in path_lower or "models" in path_lower:
                    return "Database"
                return "Other"

            # Dynamically identify folders to register Folder nodes
            folder_paths = set()
            for filepath in extractions.keys():
                parts = filepath.split("/")[:-1]
                accum = []
                for p in parts:
                    accum.append(p)
                    folder_paths.add("/".join(accum))

            for folder in folder_paths:
                folder_id = f"folder::{folder}"
                folder_name = folder.split("/")[-1]
                db_graph_node = GraphNode(
                    id=folder_id,
                    repository_id=repo_id,
                    type=GraphNodeType.FOLDER.value,
                    name=folder_name,
                    properties={"path": folder}
                )
                db.add(db_graph_node)

            # 1. Save GraphNodes from the parsed codebase
            for node_id, node in graph.nodes.items():
                node_type = GraphNodeType.FILE
                kind_lower = node.kind.lower()
                if kind_lower == "file":
                    node_type = GraphNodeType.FILE
                elif kind_lower == "module":
                    node_type = GraphNodeType.MODULE
                elif kind_lower == "class":
                    node_type = GraphNodeType.CLASS
                elif kind_lower == "interface":
                    node_type = GraphNodeType.INTERFACE
                elif kind_lower == "function":
                    node_type = GraphNodeType.FUNCTION
                elif kind_lower == "method":
                    node_type = GraphNodeType.METHOD
                elif kind_lower == "variable":
                    node_type = GraphNodeType.VARIABLE
                elif kind_lower == "constant":
                    node_type = GraphNodeType.VARIABLE

                db_graph_node = GraphNode(
                    id=node.id,
                    repository_id=repo_id,
                    type=node_type.value,
                    name=node.name,
                    properties=node.metadata or {}
                )
                db.add(db_graph_node)

            # 2. Save GraphRelationships and map folder & layer dependencies
            written_layer_relations = set()
            for edge in graph.edges:
                rel_type = GraphRelationshipType.DEPENDS_ON
                kind = edge.kind.value
                if kind == "imports":
                    rel_type = GraphRelationshipType.IMPORTS
                elif kind == "module_usage":
                    rel_type = GraphRelationshipType.IMPORTS
                elif kind == "calls":
                    rel_type = GraphRelationshipType.CALLS
                elif kind == "inherits":
                    rel_type = GraphRelationshipType.INHERITS
                elif kind == "composition":
                    rel_type = GraphRelationshipType.USES
                elif kind == "class_usage":
                    rel_type = GraphRelationshipType.USES

                db_graph_rel = GraphRelationship(
                    id=str(uuid.uuid4()),
                    repository_id=repo_id,
                    source_id=edge.source_id,
                    target_id=edge.target_id,
                    type=rel_type.value,
                    properties={"label": edge.label, "line": edge.line, "file_path": edge.file_path}
                )
                db.add(db_graph_rel)

                # Determine module/layer dependencies based on this edge's files
                src_path = edge.file_path or ""
                target_path = ""
                if edge.target_id.startswith("symbol::") or edge.target_id.startswith("file::"):
                    parts = edge.target_id.split("::")
                    target_path = parts[1] if len(parts) > 1 else ""

                if src_path and target_path:
                    layer_A = get_architectural_layer(src_path)
                    layer_B = get_architectural_layer(target_path)
                    if layer_A != "Other" and layer_B != "Other" and layer_A != layer_B:
                        layer_rel_key = (layer_A, layer_B)
                        if layer_rel_key not in written_layer_relations:
                            written_layer_relations.add(layer_rel_key)
                            db_layer_rel = GraphRelationship(
                                id=str(uuid.uuid4()),
                                repository_id=repo_id,
                                source_id=f"layer::{layer_A}",
                                target_id=f"layer::{layer_B}",
                                type=GraphRelationshipType.DEPENDS_ON.value,
                                properties={"label": f"{layer_A} communication with {layer_B}"}
                            )
                            db.add(db_layer_rel)

                # Also save old relationship model for backward compatibility
                db_rel = Relationship(
                    id=str(uuid.uuid4()),
                    repository_id=repo_id,
                    source_id=edge.source_id,
                    target_id=edge.target_id,
                    kind=edge.kind.value,
                    label=edge.label,
                    file_path=edge.file_path,
                    line=edge.line,
                )
                db.add(db_rel)

            # === Neo4j Knowledge Graph Integration ===
            try:
                session = neo4j_client.get_session()
                if session:
                    # 1. Clear old data for repo
                    session.run("MATCH (n {repository_id: $repo_id}) DETACH DELETE n", repo_id=repo_id)
                    session.run("MATCH (n:Repository {id: $repo_id}) DETACH DELETE n", repo_id=repo_id)

                    # 2. Create Repository Node
                    session.run(
                        "MERGE (n:Repository {id: $id}) SET n.name = $name, n.type = 'Repository'",
                        id=repo_id, name=repo_id
                    )

                    # 3. Create Folder Nodes
                    for folder in folder_paths:
                        folder_id = f"folder::{folder}"
                        folder_name = folder.split("/")[-1]
                        session.run(
                            "MERGE (n:Folder {id: $id, repository_id: $repo_id}) "
                            "SET n.name = $name, n.type = 'Folder' "
                            "SET n += $props",
                            id=folder_id, repo_id=repo_id, name=folder_name, props={"path": folder}
                        )

                    # 4. Create GraphNodes from ast extraction
                    for node_id, node in graph.nodes.items():
                        # Map type to label
                        label = "File"
                        kind_lower = node.kind.lower()
                        if kind_lower == "file":
                            label = "File"
                        elif kind_lower == "module":
                            label = "Module"
                        elif kind_lower == "class":
                            label = "Class"
                        elif kind_lower == "interface":
                            label = "Interface"
                        elif kind_lower in ("function", "method"):
                            label = "Function" if kind_lower == "function" else "Method"
                        elif kind_lower == "variable":
                            label = "Variable"

                        # Additional check for Service layer naming pattern
                        is_service = "service" in node.name.lower() or "service" in node_id.lower()
                        labels = [label]
                        if is_service:
                            labels.append("Service")

                        # Database connection or table checks
                        is_db = "db" in node.name.lower() or "database" in node_id.lower() or "model" in node.name.lower()
                        if is_db and label == "Class":
                            labels.append("Database_Table")

                        # API check
                        is_api = "api" in node.name.lower() or "router" in node_id.lower() or "endpoint" in node.name.lower()
                        if is_api:
                            labels.append("API_Endpoint")

                        # Build Cypher labels string e.g. "File:Service"
                        labels_str = ":".join(labels)

                        # Flatten properties for Neo4j primitive support
                        raw_props = node.metadata or {}
                        flat_props = {}
                        for k, v in raw_props.items():
                            if isinstance(v, (dict, list)):
                                flat_props[k] = str(v)
                            else:
                                flat_props[k] = v
                        
                        session.run(
                            f"MERGE (n:{labels_str} {{id: $id, repository_id: $repo_id}}) "
                            "SET n.name = $name, n.type = $type "
                            "SET n += $props",
                            id=node.id, repo_id=repo_id, name=node.name, type=node.kind, props=flat_props
                        )

                    # 5. Create Relationships
                    for edge in graph.edges:
                        rel_type = "DEPENDS_ON"
                        kind = edge.kind.value
                        if kind == "imports":
                            rel_type = "IMPORTS"
                        elif kind == "calls":
                            rel_type = "CALLS"
                        elif kind == "inherits":
                            rel_type = "INHERITS"
                        elif kind == "composition":
                            rel_type = "USES"

                        session.run(
                            f"MATCH (a {{id: $src, repository_id: $repo_id}}), (b {{id: $tgt}}) "
                            f"MERGE (a)-[r:{rel_type}]->(b)",
                            src=edge.source_id, tgt=edge.target_id, repo_id=repo_id
                        )

                    # 6. Parse external dependencies/libs (requirements.txt or package.json)
                    cloned_dir = os.path.join(settings.CLONED_REPOS_DIR, repo_id)
                    req_path = os.path.join(cloned_dir, "requirements.txt")
                    if os.path.exists(req_path):
                        with open(req_path, "r") as f:
                            for line in f:
                                lib = line.strip().split(">=")[0].split("==")[0].strip()
                                if lib and not lib.startswith("#"):
                                    session.run(
                                        "MERGE (l:External_Library {id: $id}) "
                                        "SET l.name = $name, l.type = 'External Library'",
                                        id=f"lib::{lib}", name=lib
                                    )
                                    session.run(
                                        "MATCH (r:Repository {id: $repo_id}), (l:External_Library {id: $lib_id}) "
                                        "MERGE (r)-[:DEPENDS_ON_LIB]->(l)",
                                        repo_id=repo_id, lib_id=f"lib::{lib}"
                                    )

                    # 7. Parse env vars (.env)
                    env_path = os.path.join(cloned_dir, ".env")
                    if os.path.exists(env_path):
                        with open(env_path, "r") as f:
                            for line in f:
                                if "=" in line and not line.strip().startswith("#"):
                                    parts = line.split("=")
                                    var_name = parts[0].strip()
                                    var_val = parts[1].strip() if len(parts) > 1 else ""
                                    if var_name:
                                        session.run(
                                            "MERGE (e:Environment_Variable {id: $id, repository_id: $repo_id}) "
                                            "SET e.name = $name, e.type = 'Environment Variable', e.value = $val",
                                            id=f"env::{repo_id}::{var_name}", repo_id=repo_id, name=var_name, val=var_val
                                        )

                    # 8. Create Cache, Queue, Configuration placeholders if settings suggest them
                    has_redis = False
                    has_celery = False
                    for n in graph.nodes.values():
                        n_lower = n.name.lower()
                        if "redis" in n_lower or "cache" in n_lower:
                            has_redis = True
                        if "celery" in n_lower or "queue" in n_lower:
                            has_celery = True

                    if has_redis:
                        session.run(
                            "MERGE (c:Cache {id: $id, repository_id: $repo_id}) SET c.name = 'RedisCache', c.type = 'Cache'",
                            id=f"cache::{repo_id}::redis", repo_id=repo_id
                        )
                    if has_celery:
                        session.run(
                            "MERGE (q:Queue {id: $id, repository_id: $repo_id}) SET q.name = 'CeleryQueue', q.type = 'Queue'",
                            id=f"queue::{repo_id}::celery", repo_id=repo_id
                        )

                    # 9. Build semantic Knowledge Graph hierarchy connections (Feature 2)
                    # Repository -> Module -> Service -> API -> Database
                    
                    # Link Repository containing Modules/Folders
                    session.run(
                        "MATCH (r:Repository {id: $repo_id}), (m {repository_id: $repo_id}) "
                        "WHERE m:Folder OR m:Module OR m:File "
                        "MERGE (r)-[:HAS_MODULE]->(m)",
                        repo_id=repo_id
                    )

                    # Link Modules/Folders containing Services
                    session.run(
                        "MATCH (m {repository_id: $repo_id}), (s:Service {repository_id: $repo_id}) "
                        "WHERE (m:Folder OR m:Module) AND m.id <> s.id "
                        "MERGE (m)-[:HAS_SERVICE]->(s)",
                        repo_id=repo_id
                    )

                    # Link Services exposing API Endpoints
                    session.run(
                        "MATCH (s:Service {repository_id: $repo_id}), (a:API_Endpoint {repository_id: $repo_id}) "
                        "MERGE (s)-[:EXPOSES_API]->(a)",
                        repo_id=repo_id
                    )

                    # Link Services writing/reading Database Tables
                    session.run(
                        "MATCH (s {repository_id: $repo_id}), (d:Database_Table {repository_id: $repo_id}) "
                        "WHERE s:Service OR s.type = 'Repository' "
                        "MERGE (s)-[:WRITES_TO]->(d)",
                        repo_id=repo_id
                    )

            except Exception as neo_err:
                print(f"Error populating Neo4j knowledge graph: {neo_err}")
        except Exception as e:
            print(f"Error populating universal graph: {e}")
            pass

        # Aggregate repository statistics
        repo_meta = self.metadata_engine.analyse_repository(file_metas)
        db_stats = RepositoryStatistics(
            id=str(uuid.uuid4()),
            repository_id=repo_id,
            total_files=len(file_metas),
            total_lines=repo_meta.total_lines,
            total_code_lines=repo_meta.total_code_lines,
            total_comment_lines=repo_meta.total_comment_lines,
            total_blank_lines=repo_meta.total_blank_lines,
            total_size_bytes=repo_meta.total_size_bytes,
            total_complexity=repo_meta.total_complexity,
            average_complexity=repo_meta.average_complexity,
            documentation_coverage=repo_meta.documentation_coverage,
            languages=repo_meta.language_breakdown(),
        )
        db.add(db_stats)

        db.commit()
        db.refresh(db_stats)

        return db_stats
