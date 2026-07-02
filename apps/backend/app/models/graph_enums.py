from enum import Enum


class GraphNodeType(str, Enum):
    REPOSITORY = "Repository"
    FOLDER = "Folder"
    FILE = "File"
    MODULE = "Module"
    CLASS = "Class"
    INTERFACE = "Interface"
    FUNCTION = "Function"
    METHOD = "Method"
    VARIABLE = "Variable"
    API_ENDPOINT = "API Endpoint"
    DATABASE_TABLE = "Database Table"
    EXTERNAL_SERVICE = "External Service"


class GraphRelationshipType(str, Enum):
    IMPORTS = "IMPORTS"
    CALLS = "CALLS"
    INHERITS = "INHERITS"
    IMPLEMENTS = "IMPLEMENTS"
    USES = "USES"
    DEPENDS_ON = "DEPENDS_ON"
    REFERENCES = "REFERENCES"
    READS = "READS"
    WRITES = "WRITES"
    ROUTES_TO = "ROUTES_TO"
