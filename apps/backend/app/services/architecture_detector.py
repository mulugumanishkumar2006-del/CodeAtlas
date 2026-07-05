from sqlalchemy.orm import Session
from app.models.graph_node import GraphNode
from app.models.graph_relationship import GraphRelationship
from typing import List, Dict, Any

class ArchitectureDetector:
    """
    Analyzes the universal code-and-infrastructure graph in PostgreSQL
    to detect architectural patterns:
    - MVC
    - Layered Architecture
    - Clean / Hexagonal Architecture
    - Repository Pattern
    - CQRS
    - Event Driven
    - Microservices
    - Modular Monolith
    
    Provides confidence scores and lists concrete code evidence.
    """
    def detect(self, db: Session, repo_id: str) -> List[Dict[str, Any]]:
        # Load all nodes and relationships
        nodes = db.query(GraphNode).filter(GraphNode.repository_id == repo_id).all()
        relationships = db.query(GraphRelationship).filter(GraphRelationship.repository_id == repo_id).all()

        patterns = []
        
        # Run detection checks
        patterns.append(self.detect_mvc(nodes, relationships))
        patterns.append(self.detect_layered(nodes, relationships))
        patterns.append(self.detect_clean(nodes, relationships))
        patterns.append(self.detect_repository_pattern(nodes, relationships))
        patterns.append(self.detect_cqrs(nodes, relationships))
        patterns.append(self.detect_event_driven(nodes, relationships))
        patterns.append(self.detect_microservices(nodes, relationships))
        patterns.append(self.detect_modular_monolith(nodes, relationships))
        
        # Filter patterns with confidence > 0.1
        return [p for p in patterns if p["confidence"] > 0.1]

    def detect_mvc(self, nodes: List[GraphNode], relationships: List[GraphRelationship]) -> Dict[str, Any]:
        evidence = []
        score = 0.0
        
        has_model = False
        has_view = False
        has_controller = False
        
        for n in nodes:
            name_lower = n.name.lower()
            path_lower = (n.properties or {}).get("path", "").lower() or (n.properties or {}).get("file_path", "").lower()
            
            if "model" in name_lower or "model" in path_lower:
                if not has_model:
                    evidence.append(f"Discovered Model component: {n.name}")
                    has_model = True
            if "view" in name_lower or "template" in name_lower or "view" in path_lower or "template" in path_lower:
                if not has_view:
                    evidence.append(f"Discovered View/Template component: {n.name}")
                    has_view = True
            if "controller" in name_lower or "controller" in path_lower:
                if not has_controller:
                    evidence.append(f"Discovered Controller component: {n.name}")
                    has_controller = True
                    
        if has_model: score += 0.3
        if has_view: score += 0.3
        if has_controller: score += 0.3
        
        # Check if controllers call models or views
        if has_controller and has_model:
            score += 0.1
            evidence.append("Unidirectional control flow detected from controllers to models.")
            
        return {
            "pattern": "MVC",
            "confidence": min(score, 1.0),
            "description": "Separates application logic into three interconnected components: Models for data, Views for user interface, and Controllers for input logic.",
            "evidence": evidence
        }

    def detect_layered(self, nodes: List[GraphNode], relationships: List[GraphRelationship]) -> Dict[str, Any]:
        evidence = []
        score = 0.0
        
        has_api = False
        has_service = False
        has_repo = False
        has_db = False
        
        for n in nodes:
            n_type = n.type.lower()
            name_lower = n.name.lower()
            path_lower = (n.properties or {}).get("path", "").lower() or (n.properties or {}).get("file_path", "").lower()
            
            if "api" in name_lower or "controller" in name_lower or "api" in path_lower or n_type == "api":
                if not has_api:
                    evidence.append(f"Discovered API Routing layer: {n.name}")
                    has_api = True
            if "service" in name_lower or "logic" in name_lower or "service" in path_lower or n_type == "service":
                if not has_service:
                    evidence.append(f"Discovered Business Service layer: {n.name}")
                    has_service = True
            if "repository" in name_lower or "dao" in name_lower or "repository" in path_lower:
                if not has_repo:
                    evidence.append(f"Discovered Repository/Data Access layer: {n.name}")
                    has_repo = True
            if "db" in name_lower or "database" in name_lower or "table" in name_lower or n_type == "database table":
                if not has_db:
                    evidence.append(f"Discovered Database storage layer: {n.name}")
                    has_db = True
                    
        if has_api: score += 0.25
        if has_service: score += 0.25
        if has_repo: score += 0.25
        if has_db: score += 0.15
        
        # Check strict downward communication flow: API -> Service -> Repository -> Database
        comms = 0
        for r in relationships:
            src_type = next((n.type for n in nodes if n.id == r.source_id), "").lower()
            tgt_type = next((n.type for n in nodes if n.id == r.target_id), "").lower()
            
            if src_type == "api" and tgt_type == "service":
                comms += 1
            elif src_type == "service" and tgt_type in ("database table", "module"):
                comms += 1
                
        if comms > 0:
            score += 0.1
            evidence.append(f"Detected {comms} strict downward architectural layer communication link(s).")
            
        return {
            "pattern": "Layered Architecture",
            "confidence": min(score, 1.0),
            "description": "Organizes code into separate horizontal layers (API, Service, Repository, Database), where each layer has a distinct role and communicates unidirectionally with lower layers.",
            "evidence": evidence
        }

    def detect_clean(self, nodes: List[GraphNode], relationships: List[GraphRelationship]) -> Dict[str, Any]:
        evidence = []
        score = 0.0
        
        has_domain = False
        has_ports = False
        has_adapters = False
        
        for n in nodes:
            name_lower = n.name.lower()
            path_lower = (n.properties or {}).get("path", "").lower() or (n.properties or {}).get("file_path", "").lower()
            
            if "domain" in name_lower or "core" in name_lower or "entities" in name_lower or "domain" in path_lower or "core" in path_lower:
                if not has_domain:
                    evidence.append(f"Discovered Pure Domain/Core layer: {n.name}")
                    has_domain = True
            if "port" in name_lower or "usecase" in name_lower or "use_case" in name_lower or "port" in path_lower or "usecase" in path_lower:
                if not has_ports:
                    evidence.append(f"Discovered Ports/Interface Use-Cases: {n.name}")
                    has_ports = True
            if "adapter" in name_lower or "gateway" in name_lower or "delivery" in name_lower or "adapter" in path_lower or "gateway" in path_lower:
                if not has_adapters:
                    evidence.append(f"Discovered Adapters/Gateways: {n.name}")
                    has_adapters = True
                    
        if has_domain: score += 0.35
        if has_ports: score += 0.35
        if has_adapters: score += 0.2
        
        # If domain imports nothing from adapters
        if has_domain and has_adapters:
            domain_violates = False
            for r in relationships:
                src = next((n for n in nodes if n.id == r.source_id), None)
                tgt = next((n for n in nodes if n.id == r.target_id), None)
                if src and tgt:
                    src_path = (src.properties or {}).get("path", "").lower() or (src.properties or {}).get("file_path", "").lower()
                    tgt_path = (tgt.properties or {}).get("path", "").lower() or (tgt.properties or {}).get("file_path", "").lower()
                    if ("domain" in src_path or "core" in src_path) and ("adapter" in tgt_path or "infrastructure" in tgt_path):
                        domain_violates = True
            
            if not domain_violates:
                score += 0.1
                evidence.append("Dependency Rule enforced: Domain/Core layer remains clean of external adapters or dependencies.")
            else:
                evidence.append("Warning: Dependency Rule violation detected (Domain layer imports outer adapters).")
                
        return {
            "pattern": "Clean Architecture",
            "confidence": min(score, 1.0),
            "description": "Standardizes separation of concerns by putting the pure domain/business logic at the core, while frameworks, databases, and UI are outer adapters communicating via interfaces (ports).",
            "evidence": evidence
        }

    def detect_repository_pattern(self, nodes: List[GraphNode], relationships: List[GraphRelationship]) -> Dict[str, Any]:
        evidence = []
        score = 0.0
        
        repos = []
        for n in nodes:
            if "repository" in n.name.lower() or "dao" in n.name.lower():
                repos.append(n.name)
                
        if len(repos) > 0:
            score += 0.5
            evidence.append(f"Discovered data repositories: {', '.join(repos[:4])}...")
            
        if len(repos) > 3:
            score += 0.3
            evidence.append(f"Detected robust repository abstraction layer containing {len(repos)} data access classes.")
            
        # Check if service layers communicate with repositories
        serv_calls_repo = False
        for r in relationships:
            src = next((n for n in nodes if n.id == r.source_id), None)
            tgt = next((n for n in nodes if n.id == r.target_id), None)
            if src and tgt:
                if "service" in src.name.lower() and ("repository" in tgt.name.lower() or "dao" in tgt.name.lower()):
                    serv_calls_repo = True
                    break
        if serv_calls_repo:
            score += 0.2
            evidence.append("Business services interact directly with repository interfaces.")
            
        return {
            "pattern": "Repository Pattern",
            "confidence": min(score, 1.0),
            "description": "Mediates between domain service layers and database mapping using a collection-like interface for accessing domain objects.",
            "evidence": evidence
        }

    def detect_cqrs(self, nodes: List[GraphNode], relationships: List[GraphRelationship]) -> Dict[str, Any]:
        evidence = []
        score = 0.0
        
        has_command = False
        has_query = False
        has_handler = False
        
        for n in nodes:
            name_lower = n.name.lower()
            path_lower = (n.properties or {}).get("path", "").lower() or (n.properties or {}).get("file_path", "").lower()
            
            if "command" in name_lower or "command" in path_lower:
                if not has_command:
                    evidence.append(f"Discovered Command definition: {n.name}")
                    has_command = True
            if "query" in name_lower or "query" in path_lower:
                if not has_query:
                    evidence.append(f"Discovered Query definition: {n.name}")
                    has_query = True
            if "handler" in name_lower or "handler" in path_lower:
                if not has_handler:
                    evidence.append(f"Discovered command/query Handler: {n.name}")
                    has_handler = True
                    
        if has_command: score += 0.4
        if has_query: score += 0.4
        if has_handler: score += 0.2
        
        return {
            "pattern": "CQRS",
            "confidence": min(score, 1.0),
            "description": "Segregates write operations (Commands) from read operations (Queries) to optimize performance, scaling, and security.",
            "evidence": evidence
        }

    def detect_event_driven(self, nodes: List[GraphNode], relationships: List[GraphRelationship]) -> Dict[str, Any]:
        evidence = []
        score = 0.0
        
        has_broker = False
        broker_types = set()
        
        for n in nodes:
            raw_type = (n.properties or {}).get("raw_type", "").lower()
            name_lower = n.name.lower()
            if raw_type in ("kafka", "rabbitmq", "celery queue") or "broker" in name_lower or "queue" in name_lower or "redis" in name_lower:
                has_broker = True
                broker_types.add(n.name)
                
        if has_broker:
            score += 0.6
            evidence.append(f"Discovered active message brokers/queues: {', '.join(broker_types)}.")
            
        # Scan relationships for events
        event_relations = 0
        for r in relationships:
            label = (r.properties or {}).get("label", "").lower()
            if any(term in label for term in ("publish", "consume", "emit", "event", "queue", "topic")):
                event_relations += 1
                
        if event_relations > 0:
            score += 0.4
            evidence.append(f"Detected {event_relations} async event pub/sub connection(s) in codebase.")
            
        return {
            "pattern": "Event Driven",
            "confidence": min(score, 1.0),
            "description": "Uses asynchronous message passing, queues, and event streams to trigger actions and decouple services.",
            "evidence": evidence
        }

    def detect_microservices(self, nodes: List[GraphNode], relationships: List[GraphRelationship]) -> Dict[str, Any]:
        evidence = []
        score = 0.0
        
        docker_services = []
        package_files = set()
        
        for n in nodes:
            raw_type = (n.properties or {}).get("raw_type", "").lower()
            if raw_type == "docker service":
                docker_services.append(n.name)
            elif n.type.lower() == "module" and ("package.json" in n.name or "requirements.txt" in n.name):
                package_files.add(n.name)
                
        if len(docker_services) > 2:
            score += 0.5
            evidence.append(f"Discovered {len(docker_services)} infrastructure services running in docker-compose: {', '.join(docker_services[:4])}.")
            
        if len(package_files) > 1:
            score += 0.3
            evidence.append(f"Detected multiple independent dependency files representing microservices: {', '.join(list(package_files)[:3])}.")
            
        # Check network endpoints calls (api connections)
        if len(docker_services) > 2 and len(package_files) > 1:
            score += 0.2
            evidence.append("Architectural services are decoupled and isolated within individual directory modules.")
            
        return {
            "pattern": "Microservices",
            "confidence": min(score, 1.0),
            "description": "Composes the application from small, independent, autonomous services that communicate over network protocols (REST, gRPC, event brokers).",
            "evidence": evidence
        }

    def detect_modular_monolith(self, nodes: List[GraphNode], relationships: List[GraphRelationship]) -> Dict[str, Any]:
        evidence = []
        score = 0.0
        
        has_monolith = True
        docker_services = [n for n in nodes if (n.properties or {}).get("raw_type", "").lower() == "docker service"]
        if len(docker_services) > 4:
            has_monolith = False
            
        domains = set()
        for n in nodes:
            path = (n.properties or {}).get("path", "") or (n.properties or {}).get("file_path", "")
            if path and ("apps/" in path or "src/" in path or "domains/" in path):
                parts = path.split("/")
                for p in parts:
                    if p in ("apps", "src", "domains"):
                        idx = parts.index(p)
                        if idx + 1 < len(parts):
                            domains.add(parts[idx+1])
                            
        if has_monolith:
            score += 0.3
            evidence.append("Single monolith process architecture detected.")
            
        if len(domains) > 1:
            score += 0.5
            evidence.append(f"Discovered multiple subdomain modules running in the monolith: {', '.join(list(domains))}.")
            
        if len(domains) > 3:
            score += 0.2
            evidence.append("Detected highly modular subdomain decomposition pattern.")
            
        return {
            "pattern": "Modular Monolith",
            "confidence": min(score, 1.0),
            "description": "Maintains a single execution codebase (Monolith) but segregates logic into distinct, loosely-coupled, self-contained modules that communicate in-memory.",
            "evidence": evidence
        }
