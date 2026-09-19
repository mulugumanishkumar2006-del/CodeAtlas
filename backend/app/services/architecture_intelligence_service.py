import logging
import re
from pathlib import Path
from typing import Dict, Any, List, Set, Tuple, Optional
from collections import defaultdict, deque
from datetime import datetime, timezone

logger = logging.getLogger("codeatlas.architecture_intelligence")


class ArchitectureIntelligenceService:
    """
    Phase 18: Advanced Architecture Intelligence Engine for CodeAtlas.
    
    Transforms raw repository artifacts:
    Files + Symbols + Imports + Dependencies + APIs + Modules + Git
    into real, evidence-backed Architecture Intelligence.
    
    Answers:
    - What are the major components?
    - How are they connected?
    - Which components depend on which?
    - Where are the architectural boundaries?
    - What are the entry points?
    - What are the data flows?
    - Where are the strongest coupling points?
    - Where are circular dependencies?
    - Which modules are central vs isolated?
    - Where are potential architectural violations?
    - How does the architecture differ across repository snapshots?
    """

    SUPPORTED_NODE_TYPES = {
        "repository",
        "application",
        "service",
        "module",
        "package",
        "file",
        "symbol",
        "api",
        "database",
        "external_dependency",
        "test",
        "infrastructure",
    }

    SUPPORTED_EDGE_TYPES = {
        "CONTAINS",
        "IMPORTS",
        "CALLS",
        "DEPENDS_ON",
        "EXPOSES",
        "USES",
        "PERSISTS_TO",
        "TESTS",
        "CONFIGURES",
        "DEPLOYS",
        "IMPLEMENTS",
    }

    CANONICAL_LAYERS = [
        ("API Layer", "presentation_api", "Handles incoming HTTP requests, route definitions, parameter validation and response serialization"),
        ("Service Layer", "business_logic", "Encapsulates business workflows, rules, cross-cutting domain operations and transaction boundaries"),
        ("Domain Layer", "domain_models", "Defines core business domain entities, aggregates, domain events and invariants"),
        ("Data Access Layer", "data_access", "Encapsulates database access queries, ORM entity mappings, DAOs, and data persistence operations"),
        ("Infrastructure Layer", "infrastructure", "Manages cloud specifications, container definitions, CI/CD pipelines, and runtime orchestration"),
        ("Test Layer", "testing", "Contains automated unit tests, integration tests, end-to-end assertions, and test fixtures"),
        ("Configuration Layer", "configuration", "Stores environment settings, runtime options, secret configurations, and project manifests"),
        ("External Integration Layer", "external_integrations", "Connects to external third-party APIs, messaging brokers, cloud SDKs, and payment gateways"),
    ]

    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}

    def invalidate_cache(self, repository_id: Optional[str] = None):
        """Invalidates architecture intelligence cache for a specific repository or all repositories."""
        if repository_id:
            self._cache.pop(repository_id, None)
            logger.info(f"Invalidated architecture intelligence cache for repository '{repository_id}'")
        else:
            self._cache.clear()
            logger.info("Invalidated all architecture intelligence cache")

    # =========================================================================
    # 1. HETEROGENEOUS ARCHITECTURE GRAPH BUILDER
    # =========================================================================

    def build_architecture_graph(
        self,
        repository_id: str,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
        symbols: Optional[List[Dict[str, Any]]] = None,
        profile: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Builds a multi-entity architecture graph with 12 node types and 11 edge types.
        Only creates nodes and edges supported by repository evidence.
        """
        nodes: Dict[str, Dict[str, Any]] = {}
        edges: List[Dict[str, Any]] = []
        edge_keys: Set[Tuple[str, str, str]] = set()

        def add_node(node_id: str, node_type: str, name: str, label: str, source_ref: Optional[str] = None, props: Optional[Dict[str, Any]] = None):
            if node_id not in nodes:
                nodes[node_id] = {
                    "id": node_id,
                    "repository_id": repository_id,
                    "node_type": node_type,
                    "name": name,
                    "label": label,
                    "source_reference": source_ref,
                    "properties": props or {},
                }

        def add_edge(src: str, tgt: str, rel_type: str, weight: float = 1.0, evidence: Optional[Dict[str, Any]] = None):
            if src not in nodes or tgt not in nodes or src == tgt:
                return
            key = (src, tgt, rel_type)
            if key not in edge_keys:
                edge_keys.add(key)
                edges.append({
                    "source": src,
                    "target": tgt,
                    "relationship_type": rel_type,
                    "weight": weight,
                    "evidence": evidence or {},
                })

        # 1. Root Repository Node
        repo_node_id = f"repo:{repository_id}"
        add_node(repo_node_id, "repository", "Repository Root", "Repository Root", props={"repository_id": repository_id})

        # Helper maps
        file_by_path: Dict[str, Dict[str, Any]] = {}
        file_by_id: Dict[str, Dict[str, Any]] = {}
        for f in files:
            p = f.get("path", "").replace("\\", "/")
            f["clean_path"] = p
            file_by_path[p] = f
            if f.get("id"):
                file_by_id[f["id"]] = f

        symbols_by_file: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        for s in (symbols or []):
            fid = s.get("file_id")
            if fid and fid in file_by_id:
                symbols_by_file[file_by_id[fid]["clean_path"]].append(s)
            elif s.get("file_path"):
                symbols_by_file[s["file_path"].replace("\\", "/")].append(s)

        # 2. Services / Packages / Modules Nodes
        prof = profile or {}
        monorepo_info = prof.get("monorepo", {})
        is_monorepo = monorepo_info.get("is_monorepo", False)
        services = prof.get("services", [])
        
        # Add Service nodes
        service_node_ids: Dict[str, str] = {}
        if services:
            for s in services:
                s_name = s.get("name", "Service")
                s_path = s.get("service_path", ".")
                s_id = f"service:{repository_id}:{s_name.lower().replace(' ', '_')}"
                add_node(s_id, "service", s_name, s_name, source_ref=s_path, props={"type": s.get("type", "Service"), "path": s_path})
                add_edge(repo_node_id, s_id, "CONTAINS", evidence={"reason": "Repository contains service boundary"})
                service_node_ids[s_path] = s_id
        else:
            default_svc_id = f"service:{repository_id}:main_application"
            add_node(default_svc_id, "service", "Main Application", "Main Application", source_ref=".", props={"type": "Standalone Service"})
            add_edge(repo_node_id, default_svc_id, "CONTAINS", evidence={"reason": "Standalone application service"})
            service_node_ids["."] = default_svc_id

        # 3. Module Nodes
        module_node_ids: Dict[str, str] = {}
        for f in files:
            p = f["clean_path"]
            parts = p.split("/")
            mod_name = parts[0] if len(parts) <= 2 else f"{parts[0]}/{parts[1]}"
            mod_id = f"mod:{repository_id}:{mod_name.replace('/', '_').lower()}"
            if mod_id not in nodes:
                add_node(mod_id, "module", mod_name, mod_name, source_ref=mod_name, props={"module_path": mod_name})
                # Connect Service -> Module
                parent_svc_id = next((sid for spath, sid in service_node_ids.items() if spath != "." and p.startswith(spath)), list(service_node_ids.values())[0])
                add_edge(parent_svc_id, mod_id, "CONTAINS", evidence={"reason": f"Service contains module '{mod_name}'"})
            module_node_ids[p] = mod_id

        # 4. File Nodes
        file_node_ids: Dict[str, str] = {}
        for f in files:
            p = f["clean_path"]
            fname = Path(p).name
            file_id = f"file:{repository_id}:{p}"
            file_node_ids[p] = file_id

            layer_name, layer_cat, _ = self.classify_file_layer(p, symbols_by_file.get(p, []))
            is_test = layer_cat == "testing"

            n_type = "test" if is_test else "file"
            add_node(file_id, n_type, fname, p, source_ref=p, props={
                "language": f.get("language") or "Unknown",
                "line_count": f.get("line_count") or 0,
                "layer": layer_name,
                "layer_category": layer_cat,
                "file_db_id": f.get("id"),
            })

            # Module CONTAINS File
            mod_id = module_node_ids.get(p)
            if mod_id:
                add_edge(mod_id, file_id, "CONTAINS", evidence={"file": p})

        # 5. Application Entry Point Nodes
        entry_points = list(prof.get("entry_points", []))
        if not entry_points:
            cand_ep = next((f.get("path") for f in files if "api" in f.get("path", "").lower() or "app" in f.get("path", "").lower() or "main" in f.get("path", "").lower()), files[0].get("path") if files else None)
            if cand_ep:
                entry_points.append({"file_path": cand_ep, "framework": "Application Entry", "line": 1})

        for ep in entry_points:
            ep_file = ep.get("file_path", "").replace("\\", "/")
            if ep_file in file_node_ids:
                app_id = f"app:{repository_id}:{ep_file}"
                add_node(app_id, "application", Path(ep_file).name, f"Entry: {ep_file}", source_ref=ep_file, props={
                    "framework": ep.get("framework", "Executable"),
                    "line": ep.get("line", 1),
                    "reason": ep.get("reason", "Application bootstrap entry point"),
                })
                # Service EXPOSES / CONTAINS Application
                parent_svc = list(service_node_ids.values())[0] if service_node_ids else list(module_node_ids.values())[0]
                add_edge(parent_svc, app_id, "CONTAINS", evidence={"entry_file": ep_file})
                add_edge(app_id, file_node_ids[ep_file], "EXPOSES", evidence={"entry_line": ep.get("line", 1)})

        # 6. API Endpoint Nodes
        api_endpoints = prof.get("api_endpoints", [])
        for api_item in api_endpoints:
            route = api_item.get("route") or api_item.get("path")
            method = (api_item.get("method") or api_item.get("http_method") or "GET").upper()
            src_file = (api_item.get("file_path") or "").replace("\\", "/")
            api_id = f"api:{repository_id}:{method}_{route.replace('/', '_').replace('{', '').replace('}', '')}"
            add_node(api_id, "api", f"{method} {route}", f"{method} {route}", source_ref=src_file, props={
                "method": method,
                "route": route,
                "framework": api_item.get("framework", "REST API"),
                "line": api_item.get("line", 1),
            })
            if src_file in file_node_ids:
                add_edge(file_node_ids[src_file], api_id, "EXPOSES", evidence={"route": route, "line": api_item.get("line", 1)})

        # 7. Database Nodes & Models
        databases = prof.get("databases", [])
        for db_item in databases:
            db_name = db_item.get("name") or db_item.get("type") or "Database"
            db_cat = db_item.get("category", "Datastore")
            db_id = f"db:{repository_id}:{db_name.lower()}"
            add_node(db_id, "database", db_name, db_name, props={
                "category": db_cat,
                "description": db_item.get("description", ""),
            })
            # Connect files that import/use this database
            ev_files = db_item.get("evidence_files") or ([db_item.get("source_file")] if db_item.get("source_file") else [])
            for ef in ev_files:
                clean_ef = ef.replace("\\", "/")
                if clean_ef in file_node_ids:
                    add_edge(file_node_ids[clean_ef], db_id, "PERSISTS_TO", evidence={"evidence_imports": db_item.get("evidence_imports", [])})

        # 8. External Dependency Nodes
        external_deps = list(prof.get("architecture_tree", {}).get("external_dependencies", []))
        for dep in dependencies:
            if dep.get("dependency_type") == "EXTERNAL" or not dep.get("resolved"):
                external_deps.append({
                    "name": dep.get("target_path") or dep.get("name"),
                    "source_path": dep.get("source_path"),
                    "start_line": dep.get("start_line") or 1,
                })
        for ed in external_deps:
            dep_name = ed.get("name") or ed.get("target_path") or ""
            if dep_name:
                ext_id = f"ext:{repository_id}:{dep_name.lower()}"
                if ext_id not in nodes:
                    add_node(ext_id, "external_dependency", dep_name, dep_name, props={"dependency_type": "external"})
                src_file = (ed.get("source_path") or "").replace("\\", "/")
                if src_file in file_node_ids:
                    add_edge(file_node_ids[src_file], ext_id, "USES", evidence={"line": ed.get("start_line") or 1})

        # 9. Infrastructure Nodes
        infra_items = prof.get("infrastructure", [])
        for inf in infra_items:
            i_path = (inf.get("file_path") or "").replace("\\", "/")
            i_type = inf.get("type", "Infrastructure")
            inf_id = f"infra:{repository_id}:{i_path.replace('/', '_')}"
            add_node(inf_id, "infrastructure", Path(i_path).name, f"{i_type} ({Path(i_path).name})", source_ref=i_path, props={
                "infra_type": i_type,
                "description": inf.get("description", ""),
            })
            if i_path in file_node_ids:
                add_edge(file_node_ids[i_path], inf_id, "CONFIGURES", evidence={"config_type": i_type})
            parent_svc = list(service_node_ids.values())[0]
            add_edge(inf_id, parent_svc, "DEPLOYS", evidence={"infrastructure_file": i_path})

        # 10. Dependency Edges (IMPORTS, CALLS, DEPENDS_ON, TESTS)
        for dep in dependencies:
            src = (dep.get("source_path") or "").replace("\\", "/")
            tgt = (dep.get("target_path") or "").replace("\\", "/")
            if not src or not tgt or src == tgt:
                continue

            src_node_id = file_node_ids.get(src)
            tgt_node_id = file_node_ids.get(tgt)

            if src_node_id and tgt_node_id:
                # Determine relationship type
                src_layer = nodes[src_node_id]["properties"].get("layer_category")
                rel_type = "TESTS" if src_layer == "testing" else "IMPORTS"

                add_edge(src_node_id, tgt_node_id, rel_type, weight=1.0, evidence={
                    "import_name": dep.get("import_name"),
                    "line": dep.get("start_line") or 1,
                    "source_path": src,
                    "target_path": tgt,
                })

                # Module DEPENDS_ON Module
                src_mod = module_node_ids.get(src)
                tgt_mod = module_node_ids.get(tgt)
                if src_mod and tgt_mod and src_mod != tgt_mod:
                    add_edge(src_mod, tgt_mod, "DEPENDS_ON", weight=1.0, evidence={"source_file": src, "target_file": tgt})

        # 11. Symbol Nodes and CALLS / IMPLEMENTS Edges
        for s in (symbols or []):
            stype = s.get("symbol_type") or "function"
            sname = s.get("name") or ""
            fid = s.get("file_id")
            src_f = file_by_id.get(fid, {}).get("clean_path") or s.get("file_path", "").replace("\\", "/")
            
            # Index notable symbols (classes, interfaces, endpoints, main functions, functions)
            ast_meta = s.get("ast_metadata") or {}
            is_key_sym = stype in ["class", "interface", "struct", "trait", "function", "method"] or ast_meta.get("is_main") or ast_meta.get("is_endpoint")
            
            if is_key_sym and src_f and src_f in file_node_ids:
                sym_id = f"sym:{repository_id}:{s.get('qualified_name') or sname}"
                add_node(sym_id, "symbol", sname, f"{stype} {sname}", source_ref=src_f, props={
                    "symbol_type": stype,
                    "start_line": s.get("start_line", 1),
                    "end_line": s.get("end_line", 1),
                })
                # File CONTAINS Symbol
                add_edge(file_node_ids[src_f], sym_id, "CONTAINS", evidence={"line": s.get("start_line", 1)})

        # 12. CALLS Edges (API -> Symbol)
        for api_item in api_endpoints:
            src_file = (api_item.get("file_path") or "").replace("\\", "/")
            route = api_item.get("route") or api_item.get("path", "")
            method = (api_item.get("method") or "GET").upper()
            api_id = f"api:{repository_id}:{method}_{route.replace('/', '_').replace('{', '').replace('}', '')}"
            if api_id in nodes:
                for s in (symbols or []):
                    s_file = file_by_id.get(s.get("file_id"), {}).get("clean_path") or s.get("file_path", "").replace("\\", "/")
                    if s_file == src_file:
                        sym_id = f"sym:{repository_id}:{s.get('qualified_name') or s.get('name')}"
                        if sym_id in nodes:
                            add_edge(api_id, sym_id, "CALLS", evidence={"line": s.get("start_line", 1)})

        return {
            "repository_id": repository_id,
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "node_types": sorted(list({n["node_type"] for n in nodes.values()})),
            "edge_types": sorted(list({e["relationship_type"] for e in edges})),
            "nodes": list(nodes.values()),
            "edges": edges,
        }

    # =========================================================================
    # 2. CANONICAL ARCHITECTURAL COMPONENT DISCOVERY (8 LAYERS)
    # =========================================================================

    def classify_file_layer(
        self,
        file_path: str,
        symbols: Optional[List[Dict[str, Any]]] = None,
    ) -> Tuple[str, str, str]:
        """
        Deterministically classifies a file into one of the 8 canonical architectural layers:
        1. API Layer (presentation_api)
        2. Service Layer (business_logic)
        3. Domain Layer (domain_models)
        4. Data Access Layer (data_access)
        5. Infrastructure Layer (infrastructure)
        6. Test Layer (testing)
        7. Configuration Layer (configuration)
        8. External Integration Layer (external_integrations)
        """
        clean_path = file_path.replace("\\", "/").lower()
        norm_path = f"/{clean_path}" if not clean_path.startswith("/") else clean_path
        fname = Path(clean_path).name

        # 1. Test Layer
        if any(part in norm_path for part in ["/tests/", "/test/", "/__tests__/", "/spec/"]) or \
           fname.startswith("test_") or fname.endswith(("_test.py", ".spec.ts", ".test.ts", ".spec.tsx", ".test.tsx", "_test.go", "_test.rs")):
            return "Test Layer", "testing", "Contains automated test cases and assertions"

        # 2. Infrastructure Layer
        if any(part in norm_path for part in ["/infra/", "/infrastructure/", "/k8s/", "/kubernetes/", "/terraform/", "/deploy/", "/docker/", "/.github/workflows/"]) or \
           fname in ["dockerfile", "docker-compose.yml", "docker-compose.yaml", "makefile", "gemfile"] or fname.startswith("dockerfile."):
            return "Infrastructure Layer", "infrastructure", "Build specifications, container configs, and deployment automation"

        # 3. Configuration Layer
        if any(part in norm_path for part in ["/config/", "/configs/", "/settings/"]) or \
           fname in ["settings.py", "config.py", "config.ts", "vite.config.ts", "tsconfig.json", "package.json", "pyproject.toml", "cargo.toml", "go.mod"] or \
           fname.startswith(".env"):
            return "Configuration Layer", "configuration", "Runtime settings, environment configuration, and project manifests"

        # 4. API Layer
        if any(part in norm_path for part in ["/api/", "/routes/", "/endpoints/", "/routers/", "/controllers/", "/views/", "/handlers/"]) or \
           fname.endswith(("_router.py", "_routes.py", "_controller.py", "controller.ts", "_handler.go")):
            return "API Layer", "presentation_api", "Exposes HTTP routes, request handlers, and parameter validation"

        # 5. Service Layer
        if any(part in norm_path for part in ["/services/", "/service/", "/use_cases/", "/workflows/", "/business/"]) or \
           fname.endswith(("_service.py", "service.ts", "_usecase.py", "_service.go")):
            return "Service Layer", "business_logic", "Encapsulates business operations, workflows, and transaction logic"

        # 6. Data Access Layer
        if any(part in norm_path for part in ["/repositories/", "/repository/", "/dao/", "/data_access/", "/db/"]) or \
           fname.endswith(("_repository.py", "_repo.py", "repository.ts", "_dao.py")):
            return "Data Access Layer", "data_access", "Encapsulates database access queries, DAOs, and ORM persistence operations"

        # 7. Domain Layer
        if any(part in norm_path for part in ["/domain/", "/models/", "/model/", "/entities/", "/entity/", "/schemas/", "/schema/"]) or \
           fname in ["models.py", "entities.py", "schemas.py", "schema.ts", "models.go"]:
            return "Domain Layer", "domain_models", "Defines business domain models, entity schemas, and core invariants"

        # 8. External Integration Layer
        if any(part in norm_path for part in ["/integrations/", "/integration/", "/clients/", "/client/", "/adapters/", "/gateway/"]) or \
           fname.endswith(("_client.py", "_adapter.py", "client.ts", "_client.go")):
            return "External Integration Layer", "external_integrations", "Connects to third-party APIs, external gateways, and remote clients"

        # Default: Core Domain / Utilities
        return "Domain Layer", "domain_models", "Core application domain components and internal routines"

    def discover_components(
        self,
        repository_id: str,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
        symbols: Optional[List[Dict[str, Any]]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Discovers the high-level functional architectural components grouped by their canonical layers.
        Calculates exact file counts, symbol counts, line metrics, and internal/external coupling.
        """
        layer_components: Dict[str, Dict[str, Any]] = {}
        for l_name, l_cat, l_desc in self.CANONICAL_LAYERS:
            layer_components[l_name] = {
                "id": f"component:{repository_id}:{l_cat}",
                "name": l_name,
                "category": l_cat,
                "description": l_desc,
                "files_count": 0,
                "code_lines": 0,
                "symbol_count": 0,
                "files": [],
                "incoming_coupling": 0,
                "outgoing_coupling": 0,
            }

        file_to_layer: Dict[str, str] = {}
        for f in files:
            p = f.get("path", "").replace("\\", "/")
            l_name, _, _ = self.classify_file_layer(p)
            file_to_layer[p] = l_name
            comp = layer_components[l_name]
            comp["files_count"] += 1
            meta = f.get("source_metadata") or {}
            comp["code_lines"] += meta.get("code_lines") or f.get("line_count") or 0
            comp["symbol_count"] += meta.get("symbol_count") or 0
            comp["files"].append(p)

        # Count inter-component and intra-component dependencies
        for dep in dependencies:
            if not dep.get("resolved"):
                continue
            src = (dep.get("source_path") or "").replace("\\", "/")
            tgt = (dep.get("target_path") or "").replace("\\", "/")
            if src in file_to_layer and tgt in file_to_layer:
                src_l = file_to_layer[src]
                tgt_l = file_to_layer[tgt]
                if src_l != tgt_l:
                    layer_components[src_l]["outgoing_coupling"] += 1
                    layer_components[tgt_l]["incoming_coupling"] += 1

        # Return only components that have evidence (files_count > 0)
        return [c for c in layer_components.values() if c["files_count"] > 0]

    # =========================================================================
    # 3. END-TO-END DATA FLOW & BOUNDARY TRACING
    # =========================================================================

    def trace_data_flows(
        self,
        repository_id: str,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
        profile: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Discovers and traces end-to-end data flows from entry points / API routes
        through Services and Repositories down to Database models and External Integrations.
        """
        prof = profile or {}
        api_endpoints = prof.get("api_endpoints", [])
        databases = prof.get("databases", [])
        
        file_to_layer: Dict[str, str] = {}
        for f in files:
            p = f.get("path", "").replace("\\", "/")
            file_to_layer[p] = self.classify_file_layer(p)[0]

        # Build forward adjacency list
        forward_adj: Dict[str, Set[str]] = defaultdict(set)
        for dep in dependencies:
            if not dep.get("resolved"):
                continue
            src = (dep.get("source_path") or "").replace("\\", "/")
            tgt = (dep.get("target_path") or "").replace("\\", "/")
            if src and tgt and src != tgt:
                forward_adj[src].add(tgt)

        data_flows: List[Dict[str, Any]] = []

        # Trace from API endpoints
        for api_item in api_endpoints:
            route = api_item.get("route") or api_item.get("path")
            method = (api_item.get("method") or "GET").upper()
            src_file = (api_item.get("file_path") or "").replace("\\", "/")

            if not src_file:
                continue

            # BFS to find reachable layers (Service -> Data Access -> Database)
            queue = deque([(src_file, [src_file])])
            visited = {src_file}
            found_paths: List[List[str]] = []

            while queue and len(found_paths) < 3:
                curr_file, curr_path = queue.popleft()
                curr_layer = file_to_layer.get(curr_file, "")

                if curr_layer in ["Data Access Layer", "Domain Layer"] and len(curr_path) > 1:
                    found_paths.append(curr_path)

                for next_file in forward_adj.get(curr_file, []):
                    if next_file not in visited and len(curr_path) < 6:
                        visited.add(next_file)
                        queue.append((next_file, curr_path + [next_file]))

            # Sort paths so the most complete end-to-end trace comes first
            found_paths.sort(key=lambda p: -len(p))

            # Format each discovered data flow path
            for path in found_paths:
                layers_sequence = [file_to_layer.get(p, "Core") for p in path]
                target_db = databases[0]["name"] if (databases and databases[0].get("name")) else path[-1]
                data_flows.append({
                    "entry_point": f"{method} {route}",
                    "entry_file": src_file,
                    "flow_steps": path,
                    "layer_sequence": layers_sequence,
                    "target_datastore": target_db,
                    "description": f"Request flow from '{method} {route}' traverses {len(path)} components ({' -> '.join(layers_sequence)}) to {target_db}.",
                })

        return data_flows[:20]

    # =========================================================================
    # 4. COUPLING ANALYSIS, CENTRALITY & ISOLATED MODULE DETECTION
    # =========================================================================

    def analyze_coupling_and_centrality(
        self,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Computes formal architectural coupling metrics:
        - Afferent Coupling (Ca): incoming dependencies from other modules
        - Efferent Coupling (Ce): outgoing dependencies to other modules
        - Instability Metric (I): I = Ce / (Ca + Ce). I=0 (maximally stable), I=1 (maximally instable/flexible)
        - Centrality Ranking: degree centrality and architectural hub classification
        - Isolated / Orphan Modules: modules with 0 incoming or 0 outgoing dependencies
        """
        file_to_module: Dict[str, str] = {}
        for f in files:
            p = f.get("path", "").replace("\\", "/")
            parts = p.split("/")
            mod_name = parts[0] if len(parts) <= 2 else f"{parts[0]}/{parts[1]}"
            file_to_module[p] = mod_name

        all_modules = sorted(list(set(file_to_module.values())))
        ca: Dict[str, Set[str]] = defaultdict(set)  # who depends on module M
        ce: Dict[str, Set[str]] = defaultdict(set)  # what module M depends on

        for dep in dependencies:
            if not dep.get("resolved"):
                continue
            src = (dep.get("source_path") or "").replace("\\", "/")
            tgt = (dep.get("target_path") or "").replace("\\", "/")
            src_m = file_to_module.get(src)
            tgt_m = file_to_module.get(tgt)
            if src_m and tgt_m and src_m != tgt_m:
                ce[src_m].add(tgt_m)
                ca[tgt_m].add(src_m)

        module_metrics: List[Dict[str, Any]] = []
        isolated_modules: List[Dict[str, Any]] = []

        for m in all_modules:
            in_count = len(ca[m])
            out_count = len(ce[m])
            total_dep = in_count + out_count
            instability = round(out_count / total_dep, 2) if total_dep > 0 else 0.0

            # Classification
            if total_dep == 0:
                classification = "ISOLATED"
            elif instability <= 0.3:
                classification = "STABLE_CORE"
            elif instability >= 0.7:
                classification = "VOLATILE"
            else:
                classification = "BALANCED"

            item = {
                "module": m,
                "afferent_coupling_ca": in_count,
                "efferent_coupling_ce": out_count,
                "instability": instability,
                "total_coupling": total_dep,
                "classification": classification,
                "dependents": sorted(list(ca[m])),
                "dependencies": sorted(list(ce[m])),
            }
            module_metrics.append(item)

            if classification == "ISOLATED":
                isolated_modules.append(m)

        # Sort by total centrality descending
        module_metrics.sort(key=lambda x: -x["total_coupling"])

        return {
            "module_metrics": module_metrics,
            "isolated_modules": isolated_modules,
            "architectural_hubs": [m for m in module_metrics if m["total_coupling"] >= 3][:5],
        }

    # =========================================================================
    # 5. CIRCULAR DEPENDENCY DETECTION (TARJAN'S SCC)
    # =========================================================================

    def detect_circular_dependencies(
        self,
        dependencies: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Applies Tarjan's Strongly Connected Components algorithm to identify circular dependency cycles
        at both the file level and module level.
        """
        adj: Dict[str, Set[str]] = defaultdict(set)
        for dep in dependencies:
            if not dep.get("resolved"):
                continue
            src = (dep.get("source_path") or "").replace("\\", "/")
            tgt = (dep.get("target_path") or "").replace("\\", "/")
            if src and tgt and src != tgt:
                adj[src].add(tgt)

        index = 0
        indices: Dict[str, int] = {}
        lowlinks: Dict[str, int] = {}
        on_stack: Set[str] = set()
        stack: List[str] = []
        cycles: List[List[str]] = []

        all_nodes = set(adj.keys()).union(*(adj.values()))

        def strongconnect(v: str):
            nonlocal index
            indices[v] = index
            lowlinks[v] = index
            index += 1
            stack.append(v)
            on_stack.add(v)

            for w in adj.get(v, []):
                if w not in indices:
                    strongconnect(w)
                    lowlinks[v] = min(lowlinks[v], lowlinks[w])
                elif w in on_stack:
                    lowlinks[v] = min(lowlinks[v], indices[w])

            if lowlinks[v] == indices[v]:
                scc = []
                while True:
                    w = stack.pop()
                    on_stack.remove(w)
                    scc.append(w)
                    if w == v:
                        break
                if len(scc) > 1:
                    cycles.append(scc)

        for node in all_nodes:
            if node not in indices:
                strongconnect(node)

        return {
            "has_cycles": len(cycles) > 0,
            "cycle_count": len(cycles),
            "cycles": cycles,
        }

    # =========================================================================
    # 6. ARCHITECTURAL VIOLATIONS & DRIFT DETECTION
    # =========================================================================

    def detect_architectural_violations(
        self,
        files: List[Dict[str, Any]],
        dependencies: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """
        Discovers potential architectural boundary violations:
        1. Service Layer Bypass: API route directly querying database models when a service layer exists.
        2. Architectural Layer Inversion: Database or domain models importing presentation API routes.
        3. Test Pollution: Production source code importing automated test utilities or test cases.
        """
        file_to_layer: Dict[str, Tuple[str, str]] = {}
        for f in files:
            p = f.get("path", "").replace("\\", "/")
            l_name, l_cat, _ = self.classify_file_layer(p)
            file_to_layer[p] = (l_name, l_cat)

        violations: List[Dict[str, Any]] = []

        has_api = any(l[1] == "presentation_api" for l in file_to_layer.values())
        has_service = any(l[1] == "business_logic" for l in file_to_layer.values())
        has_data = any(l[1] in ["data_access", "domain_models"] for l in file_to_layer.values())

        for dep in dependencies:
            if not dep.get("resolved"):
                continue
            src = (dep.get("source_path") or "").replace("\\", "/")
            tgt = (dep.get("target_path") or "").replace("\\", "/")
            if not src or not tgt or src == tgt:
                continue

            src_info = file_to_layer.get(src)
            tgt_info = file_to_layer.get(tgt)

            if not src_info or not tgt_info:
                continue

            src_layer, src_cat = src_info
            tgt_layer, tgt_cat = tgt_info

            # Violation 1: Service Layer Bypass
            if has_service and src_cat == "presentation_api" and tgt_cat == "data_access":
                violations.append({
                    "violation_type": "SERVICE_BYPASS",
                    "severity": "MEDIUM",
                    "title": "Service Layer Bypass",
                    "description": f"Presentation route '{src}' directly imports data access component '{tgt}', bypassing the established Service layer.",
                    "source_file": src,
                    "target_file": tgt,
                    "line": dep.get("start_line") or 1,
                    "remediation": f"Route database queries through a dedicated service workflow in the Service layer.",
                })

            # Violation 2: Architectural Layer Inversion
            if src_cat in ["data_access", "domain_models"] and tgt_cat == "presentation_api":
                violations.append({
                    "violation_type": "LAYER_INVERSION",
                    "severity": "HIGH",
                    "title": "Architectural Layer Inversion",
                    "description": f"Data layer file '{src}' illegitimately depends on presentation API file '{tgt}'.",
                    "source_file": src,
                    "target_file": tgt,
                    "line": dep.get("start_line") or 1,
                    "remediation": "Invert dependency using interfaces or remove presentation references from data models.",
                })

            # Violation 3: Test Pollution
            if src_cat != "testing" and tgt_cat == "testing":
                violations.append({
                    "violation_type": "TEST_POLLUTION",
                    "severity": "HIGH",
                    "title": "Test Dependency in Production Code",
                    "description": f"Production component '{src}' imports test code '{tgt}'.",
                    "source_file": src,
                    "target_file": tgt,
                    "line": dep.get("start_line") or 1,
                    "remediation": "Remove test imports from production code or isolate mock utilities to dedicated test directories.",
                })

        return violations

    # =========================================================================
    # 7. ARCHITECTURAL DIFFING ACROSS REPOSITORY SNAPSHOTS
    # =========================================================================

    def diff_architecture_snapshots(
        self,
        base_profile: Dict[str, Any],
        current_profile: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Compares architectural components, coupling, and metrics between two repository snapshots.
        """
        base_mods = {m.get("name"): m for m in base_profile.get("modules", [])}
        curr_mods = {m.get("name"): m for m in current_profile.get("modules", [])}

        added_modules = [m for name, m in curr_mods.items() if name not in base_mods]
        removed_modules = [m for name, m in base_mods.items() if name not in curr_mods]

        base_services = {s.get("name"): s for s in base_profile.get("services", [])}
        curr_services = {s.get("name"): s for s in current_profile.get("services", [])}

        added_services = [s for name, s in curr_services.items() if name not in base_services]
        removed_services = [s for name, s in base_services.items() if name not in curr_services]

        # API diff
        base_apis = {f"{a.get('method')}_{a.get('route') or a.get('path')}": a for a in base_profile.get("api_endpoints", [])}
        curr_apis = {f"{a.get('method')}_{a.get('route') or a.get('path')}": a for a in current_profile.get("api_endpoints", [])}

        added_apis = [a for key, a in curr_apis.items() if key not in base_apis]
        removed_apis = [a for key, a in base_apis.items() if key not in curr_apis]

        return {
            "base_commit": base_profile.get("commit_sha", "BASE"),
            "current_commit": current_profile.get("commit_sha", "HEAD"),
            "added_modules": added_modules,
            "removed_modules": removed_modules,
            "added_services": added_services,
            "removed_services": removed_services,
            "added_api_endpoints": added_apis,
            "removed_api_endpoints": removed_apis,
            "net_module_delta": len(added_modules) - len(removed_modules),
            "net_api_delta": len(added_apis) - len(removed_apis),
        }

    # =========================================================================
    # 8. MASTER ADVANCED ARCHITECTURE INTELLIGENCE
    # =========================================================================

    async def get_advanced_architecture_intelligence(
        self,
        repository_id: str,
        db: Any,
    ) -> Dict[str, Any]:
        """
        Master orchestration method.
        Compiles the complete Advanced Architecture Intelligence model for the repository.
        """
        from backend.app.models.repository import Repository
        from backend.app.models.file import File
        from backend.app.models.symbol import Symbol
        from backend.app.models.dependency import Dependency
        from sqlalchemy import select

        repo_res = await db.execute(select(Repository).where(Repository.id == repository_id))
        repo = repo_res.scalars().first()
        if not repo:
            raise ValueError(f"Repository '{repository_id}' not found.")

        # Cache lookup
        if repository_id in self._cache:
            return self._cache[repository_id]

        files_res = await db.execute(select(File).where(File.repository_id == repository_id))
        files = [
            {
                "id": f.id,
                "path": f.path,
                "language": f.language,
                "line_count": f.line_count or 0,
                "size_bytes": f.size_bytes or 0,
                "source_metadata": f.source_metadata or {},
            }
            for f in files_res.scalars().all()
        ]

        deps_res = await db.execute(select(Dependency).where(Dependency.repository_id == repository_id))
        file_map = {f["id"]: f["path"] for f in files}
        dependencies = []
        for d in deps_res.scalars().all():
            meta = d.metadata_json or {}
            src = meta.get("source_path") or file_map.get(d.source_file_id)
            tgt = meta.get("target_path") or file_map.get(d.target_file_id)
            is_res = meta.get("resolved", d.target_file_id is not None)
            dependencies.append({
                "id": d.id,
                "name": d.name,
                "source_path": src,
                "target_path": tgt,
                "dependency_type": d.dependency_type,
                "resolved": is_res,
                "start_line": meta.get("start_line") or 1,
            })

        syms_res = await db.execute(select(Symbol).where(Symbol.repository_id == repository_id).limit(1000))
        symbols = [
            {
                "id": s.id,
                "file_id": s.file_id,
                "name": s.name,
                "symbol_type": s.symbol_type,
                "qualified_name": s.qualified_name,
                "start_line": s.start_line,
                "end_line": s.end_line,
                "ast_metadata": s.ast_metadata or {},
            }
            for s in syms_res.scalars().all()
        ]

        meta = repo.metadata_json or {}
        profile = meta.get("profile") or {}

        # 1. Multi-entity architecture graph
        graph = self.build_architecture_graph(repository_id, files, dependencies, symbols, profile)

        # 2. Canonical components discovery
        components = self.discover_components(repository_id, files, dependencies, symbols)

        # 3. Data flows
        data_flows = self.trace_data_flows(repository_id, files, dependencies, profile)

        # 4. Coupling & centrality
        coupling_info = self.analyze_coupling_and_centrality(files, dependencies)

        # 5. Cycles
        cycle_info = self.detect_circular_dependencies(dependencies)

        # 6. Violations & drift
        violations = self.detect_architectural_violations(files, dependencies)

        payload = {
            "repository_id": repository_id,
            "repository_name": repo.name,
            "analyzed_at": datetime.now(timezone.utc).isoformat(),
            "graph": graph,
            "components": components,
            "data_flows": data_flows,
            "coupling": coupling_info,
            "cycles": cycle_info,
            "violations": violations,
            "summary": {
                "total_components": len(components),
                "total_graph_nodes": graph["total_nodes"],
                "total_graph_edges": graph["total_edges"],
                "total_data_flows": len(data_flows),
                "total_violations": len(violations),
                "has_circular_dependencies": cycle_info["has_cycles"],
                "isolated_modules_count": len(coupling_info["isolated_modules"]),
            },
        }

        self._cache[repository_id] = payload
        return payload


architecture_intelligence_service = ArchitectureIntelligenceService()
