from abc import ABC, abstractmethod
from typing import Dict, Any, List


class BaseASTParser(ABC):
    """
    Abstract base class for static AST parsers.
    Parsers MUST NEVER execute source code or import repository modules.
    """

    @abstractmethod
    def parse(self, source_code: str, file_path: str = "<unknown>") -> Dict[str, Any]:
        """
        Parse source text statically and return structured symbols, imports, and exports.
        
        Returns:
            {
                "symbols": List[Dict[str, Any]],
                "imports": List[Dict[str, Any]],
                "exports": List[Dict[str, Any]],
                "parse_status": "parsed" | "error" | "unsupported",
                "error": Optional[str],
            }
        """
        pass
