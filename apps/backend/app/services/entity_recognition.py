import os
import re
import uuid
from typing import Any, Dict, List, Tuple


class EntityRecognitionEngine:
    """
    Automatically identifies:
    - Docker Services (from docker-compose.yml/yaml)
    - GitHub Actions Workflows (from .github/workflows/*.yml/yaml)
    - Environment Variables (from .env files & code os.getenv/process.env)
    - Celery Tasks (decorated with @shared_task / @task)
    - Cron Jobs (system, workflow triggers, and code APScheduler calls)
    - Database Models (Prisma schema files or SQLAlchemy model classes)
    - Redis Clients
    - Kafka Brokers & Clients
    - RabbitMQ / AMQP Brokers & Clients
    - REST / GraphQL API Endpoints
    """

    def __init__(self, repo_dir: str, repo_id: str):
        self.repo_dir = repo_dir
        self.repo_id = repo_id
        self.nodes: List[Dict[str, Any]] = []
        self.relationships: List[Dict[str, Any]] = []

    def run(self) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
        self.parse_docker_compose()
        self.parse_github_workflows()
        self.parse_env_files()
        self.scan_codebase_for_entities()
        return self.nodes, self.relationships

    def add_node(
        self, node_id: str, node_type: str, name: str, properties: Dict[str, Any] = None
    ):
        # Avoid duplicate nodes
        if any(n["id"] == node_id for n in self.nodes):
            return
        self.nodes.append(
            {
                "id": node_id,
                "type": node_type,
                "name": name,
                "properties": properties or {},
            }
        )

    def add_relationship(
        self,
        source_id: str,
        target_id: str,
        rel_type: str,
        properties: Dict[str, Any] = None,
    ):
        # Avoid duplicate relationships
        if any(
            r["source_id"] == source_id
            and r["target_id"] == target_id
            and r["type"] == rel_type
            for r in self.relationships
        ):
            return
        self.relationships.append(
            {
                "id": str(uuid.uuid4()),
                "source_id": source_id,
                "target_id": target_id,
                "type": rel_type,
                "properties": properties or {},
            }
        )

    def parse_docker_compose(self):
        compose_paths = [
            os.path.join(self.repo_dir, "docker-compose.yml"),
            os.path.join(self.repo_dir, "docker-compose.yaml"),
        ]
        for path in compose_paths:
            if not os.path.exists(path):
                continue
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                # Simple line-by-line parsing for services block
                lines = content.splitlines()
                in_services = False
                current_service = None
                service_indent = -1

                for line in lines:
                    stripped = line.strip()
                    if not stripped or stripped.startswith("#"):
                        continue

                    indent = len(line) - len(line.lstrip())

                    if stripped == "services:":
                        in_services = True
                        service_indent = indent
                        continue

                    if in_services:
                        if indent <= service_indent and stripped != "services:":
                            # Out of services block
                            in_services = False
                            current_service = None
                            continue

                        # Detect service definition (e.g. "db:", "redis:")
                        if stripped.endswith(":") and indent == service_indent + 2:
                            current_service = stripped[:-1].strip()
                            service_node_id = (
                                f"docker::{self.repo_id}::{current_service}"
                            )
                            self.add_node(
                                node_id=service_node_id,
                                node_type="Docker Service",
                                name=current_service,
                                properties={
                                    "source_file": os.path.basename(path),
                                    "raw_type": "Docker Service",
                                },
                            )
                            # Link Repository to Docker Service
                            self.add_relationship(
                                source_id=f"repository::{self.repo_id}",
                                target_id=service_node_id,
                                rel_type="DEPLOYS_TO",
                                properties={"label": "deploys service"},
                            )
                            continue

                        if current_service and indent > service_indent + 2:
                            # Parse image or ports for current service
                            service_node_id = (
                                f"docker::{self.repo_id}::{current_service}"
                            )
                            if stripped.startswith("image:"):
                                image_name = (
                                    stripped.split("image:")[-1].strip().strip("'\"")
                                )
                                # Update service node properties
                                for n in self.nodes:
                                    if n["id"] == service_node_id:
                                        n["properties"]["image"] = image_name

                                # Recognize infrastructure entities based on image name
                                image_lower = image_name.lower()
                                if "redis" in image_lower:
                                    redis_node_id = f"cache::{self.repo_id}::redis"
                                    self.add_node(
                                        redis_node_id,
                                        "Cache",
                                        "RedisCache",
                                        {
                                            "type": "Redis",
                                            "source": "Docker Compose",
                                            "raw_type": "Redis",
                                        },
                                    )
                                    self.add_relationship(
                                        service_node_id,
                                        redis_node_id,
                                        "CONNECTS_TO",
                                        {"label": "runs Redis"},
                                    )
                                elif (
                                    "postgres" in image_lower
                                    or "mysql" in image_lower
                                    or "mariadb" in image_lower
                                ):
                                    db_node_id = f"db::{self.repo_id}::database"
                                    self.add_node(
                                        db_node_id,
                                        "Database Table",
                                        "RelationalDB",
                                        {
                                            "type": "SQL",
                                            "source": "Docker Compose",
                                            "raw_type": "Database Table",
                                        },
                                    )
                                    self.add_relationship(
                                        service_node_id,
                                        db_node_id,
                                        "CONNECTS_TO",
                                        {"label": "runs Database"},
                                    )
                                elif (
                                    "kafka" in image_lower or "zookeeper" in image_lower
                                ):
                                    kafka_node_id = f"broker::{self.repo_id}::kafka"
                                    self.add_node(
                                        kafka_node_id,
                                        "External Service",
                                        "KafkaBroker",
                                        {
                                            "type": "Kafka",
                                            "source": "Docker Compose",
                                            "raw_type": "Kafka",
                                        },
                                    )
                                    self.add_relationship(
                                        service_node_id,
                                        kafka_node_id,
                                        "CONNECTS_TO",
                                        {"label": "runs Kafka"},
                                    )
                                elif "rabbitmq" in image_lower:
                                    rabbitmq_node_id = (
                                        f"broker::{self.repo_id}::rabbitmq"
                                    )
                                    self.add_node(
                                        rabbitmq_node_id,
                                        "External Service",
                                        "RabbitMQBroker",
                                        {
                                            "type": "RabbitMQ",
                                            "source": "Docker Compose",
                                            "raw_type": "RabbitMQ",
                                        },
                                    )
                                    self.add_relationship(
                                        service_node_id,
                                        rabbitmq_node_id,
                                        "CONNECTS_TO",
                                        {"label": "runs RabbitMQ"},
                                    )
            except Exception as e:
                print(f"Error parsing docker-compose file: {e}")

    def parse_github_workflows(self):
        workflow_dir = os.path.join(self.repo_dir, ".github", "workflows")
        if not os.path.exists(workflow_dir):
            return

        for file_name in os.listdir(workflow_dir):
            if not (file_name.endswith(".yml") or file_name.endswith(".yaml")):
                continue
            path = os.path.join(workflow_dir, file_name)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                # Extract workflow name
                name_match = re.search(r"^name:\s*(.+)$", content, re.MULTILINE)
                workflow_name = (
                    name_match.group(1).strip().strip("'\"")
                    if name_match
                    else file_name
                )

                workflow_node_id = f"github_action::{self.repo_id}::{file_name}"
                self.add_node(
                    node_id=workflow_node_id,
                    node_type="GitHub Action",
                    name=workflow_name,
                    properties={
                        "file_path": f".github/workflows/{file_name}",
                        "raw_type": "GitHub Action",
                    },
                )

                # Link Repository to GitHub Action
                self.add_relationship(
                    source_id=f"repository::{self.repo_id}",
                    target_id=workflow_node_id,
                    rel_type="DEPLOYS_TO",
                    properties={"label": "manages workflow"},
                )

                # Check for cron scheduled triggers
                cron_matches = re.findall(r"cron:\s*['\"](.+?)['\"]", content)
                for cron_str in cron_matches:
                    cron_node_id = f"cron::{self.repo_id}::workflow::{file_name}"
                    self.add_node(
                        node_id=cron_node_id,
                        node_type="Cron Job",
                        name=f"Workflow Schedule: {workflow_name}",
                        properties={
                            "cron_expression": cron_str,
                            "trigger": "GitHub Actions",
                            "raw_type": "Cron Job",
                        },
                    )
                    self.add_relationship(
                        source_id=workflow_node_id,
                        target_id=cron_node_id,
                        rel_type="PRODUCES",
                        properties={"label": "schedules workflow"},
                    )
            except Exception as e:
                print(f"Error parsing workflow file {file_name}: {e}")

    def parse_env_files(self):
        env_paths = [
            os.path.join(self.repo_dir, ".env"),
            os.path.join(self.repo_dir, ".env.example"),
            os.path.join(self.repo_dir, ".env.local"),
            os.path.join(self.repo_dir, ".env.development"),
            os.path.join(self.repo_dir, ".env.production"),
        ]
        for path in env_paths:
            if not os.path.exists(path):
                continue
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith("#") or "=" not in line:
                            continue
                        parts = line.split("=", 1)
                        var_name = parts[0].strip()
                        var_val = (
                            parts[1].strip().strip("'\"") if len(parts) > 1 else ""
                        )

                        if var_name:
                            env_node_id = f"env::{self.repo_id}::{var_name}"
                            self.add_node(
                                node_id=env_node_id,
                                node_type="Environment",
                                name=var_name,
                                properties={
                                    "value": var_val,
                                    "source_file": os.path.basename(path),
                                    "raw_type": "Environment Variable",
                                },
                            )
                            # Link Repository to Environment Variable
                            self.add_relationship(
                                source_id=f"repository::{self.repo_id}",
                                target_id=env_node_id,
                                rel_type="USES",
                                properties={"label": "defines environment variable"},
                            )
            except Exception as e:
                print(f"Error parsing env file: {e}")

    def scan_codebase_for_entities(self):
        # Walk codebase recursively
        for root, dirs, files in os.walk(self.repo_dir):
            # Skip ignored directories
            dirs[:] = [
                d
                for d in dirs
                if d
                not in (
                    ".git",
                    "node_modules",
                    ".venv",
                    "venv",
                    "__pycache__",
                    "build",
                    "dist",
                    ".next",
                )
            ]

            for file_name in files:
                relative_path = os.path.relpath(
                    os.path.join(root, file_name), self.repo_dir
                ).replace(os.sep, "/")
                absolute_path = os.path.join(root, file_name)

                # Only scan code files or configurations
                ext = os.path.splitext(file_name)[1].lower()
                if ext not in (".py", ".js", ".jsx", ".ts", ".tsx", ".prisma"):
                    continue

                try:
                    with open(
                        absolute_path, "r", encoding="utf-8", errors="ignore"
                    ) as f:
                        content = f.read()

                    file_node_id = f"file::{relative_path}"

                    # 1. Celery Tasks (Python)
                    if ext == ".py":
                        task_matches = re.findall(
                            r"@(?:shared_task|task|app\.task)\s*\n\s*def\s+(\w+)",
                            content,
                        )
                        for task_name in task_matches:
                            task_node_id = f"symbol::{relative_path}::{task_name}"
                            # We classify this node as Function in ontology, Celery Task in properties
                            self.add_node(
                                node_id=task_node_id,
                                node_type="Function",
                                name=task_name,
                                properties={
                                    "is_celery_task": True,
                                    "raw_type": "Celery Task",
                                },
                            )
                            # Link to Celery Queue if Celery is used
                            queue_node_id = f"queue::{self.repo_id}::celery"
                            self.add_node(
                                queue_node_id,
                                "External Service",
                                "CeleryQueue",
                                {"type": "Celery", "raw_type": "Celery Queue"},
                            )
                            self.add_relationship(
                                task_node_id,
                                queue_node_id,
                                "CONSUMES",
                                {"label": "consumes celery tasks"},
                            )

                    # 2. Redis Client Usage
                    if "redis" in content.lower():
                        if re.search(
                            r"redis\.Redis|StrictRedis|createClient|ioredis|new Redis",
                            content,
                        ):
                            redis_node_id = f"cache::{self.repo_id}::redis"
                            self.add_node(
                                redis_node_id,
                                "Cache",
                                "RedisCache",
                                {"type": "Redis", "raw_type": "Redis"},
                            )
                            self.add_relationship(
                                file_node_id,
                                redis_node_id,
                                "CONNECTS_TO",
                                {"label": "connects to Redis Cache"},
                            )

                    # 3. Kafka Broker Usage
                    if "kafka" in content.lower():
                        if re.search(r"KafkaProducer|KafkaConsumer|new Kafka", content):
                            kafka_node_id = f"broker::{self.repo_id}::kafka"
                            self.add_node(
                                kafka_node_id,
                                "External Service",
                                "KafkaBroker",
                                {"type": "Kafka", "raw_type": "Kafka"},
                            )
                            self.add_relationship(
                                file_node_id,
                                kafka_node_id,
                                "CONNECTS_TO",
                                {"label": "connects to Kafka Broker"},
                            )

                    # 4. RabbitMQ Usage
                    if "pika" in content.lower() or "amqp" in content.lower():
                        if re.search(
                            r"BlockingConnection|ConnectionParameters|amqp\.connect",
                            content,
                        ):
                            rabbitmq_node_id = f"broker::{self.repo_id}::rabbitmq"
                            self.add_node(
                                rabbitmq_node_id,
                                "External Service",
                                "RabbitMQBroker",
                                {"type": "RabbitMQ", "raw_type": "RabbitMQ"},
                            )
                            self.add_relationship(
                                file_node_id,
                                rabbitmq_node_id,
                                "CONNECTS_TO",
                                {"label": "connects to RabbitMQ"},
                            )

                    # 5. Database Models
                    if ext == ".prisma":
                        # Prisma schema models
                        model_matches = re.findall(r"model\s+(\w+)\s*\{", content)
                        for model_name in model_matches:
                            db_node_id = (
                                f"db::{self.repo_id}::table::{model_name.lower()}"
                            )
                            self.add_node(
                                node_id=db_node_id,
                                node_type="Database Table",
                                name=model_name,
                                properties={
                                    "source_file": relative_path,
                                    "raw_type": "Database Model",
                                },
                            )
                            self.add_relationship(
                                file_node_id,
                                db_node_id,
                                "WRITES",
                                {"label": "defines prisma model"},
                            )
                    elif ext == ".py":
                        # SQLAlchemy models: class User(Base):
                        model_matches = re.findall(
                            r"class\s+(\w+)\((?:Base|models\.Model)\):", content
                        )
                        for model_name in model_matches:
                            db_node_id = (
                                f"db::{self.repo_id}::table::{model_name.lower()}"
                            )
                            self.add_node(
                                node_id=db_node_id,
                                node_type="Database Table",
                                name=model_name,
                                properties={
                                    "source_file": relative_path,
                                    "raw_type": "Database Model",
                                },
                            )
                            # Find if the class symbol is declared
                            class_node_id = f"symbol::{relative_path}::{model_name}"
                            self.add_relationship(
                                class_node_id,
                                db_node_id,
                                "WRITES",
                                {"label": "maps to database table"},
                            )

                    # 6. REST API routes
                    if ext == ".py":
                        # FastAPI: @router.get("/items")
                        api_matches = re.findall(
                            r"@\w+\.(get|post|put|delete|patch)\(\s*['\"](.+?)['\"]",
                            content,
                        )
                        for method, route in api_matches:
                            api_node_id = (
                                f"api::{self.repo_id}::{method.upper()}::{route}"
                            )
                            self.add_node(
                                node_id=api_node_id,
                                node_type="API Endpoint",
                                name=f"{method.upper()} {route}",
                                properties={
                                    "method": method.upper(),
                                    "route": route,
                                    "raw_type": "REST API Endpoint",
                                },
                            )
                            self.add_relationship(
                                file_node_id,
                                api_node_id,
                                "EXPOSES",
                                {"label": "exposes REST API endpoint"},
                            )
                    elif ext in (".js", ".ts", ".tsx"):
                        # Express API: app.get('/items', ...) or router.post('/items', ...)
                        api_matches = re.findall(
                            r"\b(?:app|router|express)\.(get|post|put|delete|patch)\(\s*['\"](.+?)['\"]",
                            content,
                        )
                        for method, route in api_matches:
                            api_node_id = (
                                f"api::{self.repo_id}::{method.upper()}::{route}"
                            )
                            self.add_node(
                                node_id=api_node_id,
                                node_type="API Endpoint",
                                name=f"{method.upper()} {route}",
                                properties={
                                    "method": method.upper(),
                                    "route": route,
                                    "raw_type": "REST API Endpoint",
                                },
                            )
                            self.add_relationship(
                                file_node_id,
                                api_node_id,
                                "EXPOSES",
                                {"label": "exposes Express REST API endpoint"},
                            )

                    # 7. GraphQL APIs
                    if (
                        "graphql" in content.lower()
                        or "strawberry" in content.lower()
                        or "gql`" in content.lower()
                    ):
                        # Strawberry GraphQL or general schema query definition
                        is_graphql = False
                        if (
                            "@strawberry.type" in content
                            or "strawberry.Schema(" in content
                        ):
                            is_graphql = True
                        if "ApolloServer(" in content or "gql`" in content:
                            is_graphql = True

                        if is_graphql:
                            gql_node_id = f"graphql_api::{self.repo_id}"
                            self.add_node(
                                node_id=gql_node_id,
                                node_type="API Endpoint",
                                name="GraphQL API Schema",
                                properties={"raw_type": "GraphQL API"},
                            )
                            self.add_relationship(
                                file_node_id,
                                gql_node_id,
                                "EXPOSES",
                                {"label": "defines GraphQL API Schema"},
                            )

                    # 8. Cron Jobs in Python
                    if "cron" in content.lower() or "apscheduler" in content.lower():
                        cron_matches = re.findall(
                            r"['\"]cron['\"]\s*,\s*(?:day_of_week|hour|minute|second|day|month)\s*=",
                            content,
                        )
                        if cron_matches:
                            cron_node_id = (
                                f"cron::{self.repo_id}::code::{relative_path}"
                            )
                            self.add_node(
                                node_id=cron_node_id,
                                node_type="Cron Job",
                                name="Code Scheduler Cron",
                                properties={
                                    "source_file": relative_path,
                                    "raw_type": "APScheduler Cron Job",
                                },
                            )
                            self.add_relationship(
                                file_node_id,
                                cron_node_id,
                                "PRODUCES",
                                {"label": "runs scheduled cron job"},
                            )

                    # 9. Environment Variable Code References
                    # Python: os.getenv("VAR") or os.environ.get("VAR")
                    if ext == ".py":
                        env_refs = re.findall(
                            r"(?:os\.getenv|os\.environ\.get)\(\s*['\"](\w+?)['\"]",
                            content,
                        )
                        for var_name in env_refs:
                            env_node_id = f"env::{self.repo_id}::{var_name}"
                            self.add_node(
                                env_node_id,
                                "Environment",
                                var_name,
                                {"raw_type": "Environment Variable"},
                            )
                            self.add_relationship(
                                file_node_id,
                                env_node_id,
                                "USES",
                                {"label": f"reads {var_name}"},
                            )
                    # JS/TS: process.env.VAR or process.env["VAR"]
                    elif ext in (".js", ".ts", ".tsx"):
                        env_refs = re.findall(
                            r"process\.env\.(\w+)|process\.env\[\s*['\"](\w+?)['\"]",
                            content,
                        )
                        for r_tuple in env_refs:
                            var_name = r_tuple[0] or r_tuple[1]
                            if var_name:
                                env_node_id = f"env::{self.repo_id}::{var_name}"
                                self.add_node(
                                    env_node_id,
                                    "Environment",
                                    var_name,
                                    {"raw_type": "Environment Variable"},
                                )
                                self.add_relationship(
                                    file_node_id,
                                    env_node_id,
                                    "USES",
                                    {"label": f"reads {var_name}"},
                                )

                except Exception as e:
                    print(f"Error scanning file {relative_path} for entities: {e}")
