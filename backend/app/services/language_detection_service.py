import os
from pathlib import Path
from typing import Dict, Any, List, Optional


class LanguageDetectionService:
    """
    Deterministic language detection service based on file extensions and signatures.
    """

    EXTENSION_MAP: Dict[str, str] = {
        # Python
        ".py": "Python",
        ".pyi": "Python",
        ".pyw": "Python",
        # JavaScript / TypeScript
        ".js": "JavaScript",
        ".jsx": "JavaScript",
        ".mjs": "JavaScript",
        ".cjs": "JavaScript",
        ".ts": "TypeScript",
        ".mts": "TypeScript",
        ".cts": "TypeScript",
        ".tsx": "TSX",
        # Systems & Compiled
        ".c": "C",
        ".h": "C",
        ".cpp": "C++",
        ".hpp": "C++",
        ".cc": "C++",
        ".cxx": "C++",
        ".hxx": "C++",
        ".hh": "C++",
        ".go": "Go",
        ".rs": "Rust",
        ".java": "Java",
        ".kt": "Kotlin",
        ".kts": "Kotlin",
        ".swift": "Swift",
        ".cs": "C#",
        # Web & Scripting
        ".php": "PHP",
        ".rb": "Ruby",
        ".sh": "Shell",
        ".bash": "Shell",
        ".zsh": "Shell",
        ".html": "HTML",
        ".htm": "HTML",
        ".css": "CSS",
        ".scss": "SCSS",
        ".sass": "SCSS",
        ".less": "SCSS",
        # Data & Config
        ".json": "JSON",
        ".yaml": "YAML",
        ".yml": "YAML",
        ".toml": "TOML",
        ".xml": "XML",
        ".sql": "SQL",
        ".md": "Markdown",
        ".markdown": "Markdown",
    }

    FILENAME_MAP: Dict[str, str] = {
        "dockerfile": "Docker",
        "makefile": "Makefile",
        "cmakelists.txt": "CMake",
        "gemfile": "Ruby",
        "rakefile": "Ruby",
        "cargo.toml": "Rust",
        "package.json": "JSON",
        "tsconfig.json": "JSON",
    }

    def detect_language(self, filepath: str | Path) -> str:
        path = Path(filepath)
        filename_lower = path.name.lower()

        # Check special filenames first
        if filename_lower in self.FILENAME_MAP:
            return self.FILENAME_MAP[filename_lower]

        ext = path.suffix.lower()
        if ext in self.EXTENSION_MAP:
            return self.EXTENSION_MAP[ext]

        # Check secondary extensions (e.g. .test.tsx -> .tsx)
        if len(path.suffixes) > 1:
            last_ext = path.suffixes[-1].lower()
            if last_ext in self.EXTENSION_MAP:
                return self.EXTENSION_MAP[last_ext]

        return "Unknown"

    def calculate_language_distribution(self, files: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate language distribution metrics from a list of scanned file metadata dictionaries.
        """
        stats: Dict[str, Dict[str, Any]] = {}
        total_files = len(files)
        total_lines = sum(f.get("line_count", 0) for f in files)
        total_code_lines = sum(f.get("code_lines", f.get("line_count", 0)) for f in files)
        total_blank_lines = sum(f.get("blank_lines", 0) for f in files)
        total_comment_lines = sum(f.get("comment_lines", 0) for f in files)
        total_bytes = sum(f.get("size_bytes", 0) for f in files)

        for f in files:
            lang = f.get("language") or "Unknown"
            if lang not in stats:
                stats[lang] = {
                    "language": lang,
                    "file_count": 0,
                    "line_count": 0,
                    "code_lines": 0,
                    "blank_lines": 0,
                    "comment_lines": 0,
                    "size_bytes": 0,
                    "percentage": 0.0,
                }
            stats[lang]["file_count"] += 1
            stats[lang]["line_count"] += f.get("line_count", 0)
            stats[lang]["code_lines"] += f.get("code_lines", f.get("line_count", 0))
            stats[lang]["blank_lines"] += f.get("blank_lines", 0)
            stats[lang]["comment_lines"] += f.get("comment_lines", 0)
            stats[lang]["size_bytes"] += f.get("size_bytes", 0)

        # Calculate percentages based on line counts (or file count if 0 lines)
        for lang, data in stats.items():
            if total_lines > 0:
                data["percentage"] = round((data["line_count"] / total_lines) * 100, 2)
            elif total_files > 0:
                data["percentage"] = round((data["file_count"] / total_files) * 100, 2)
            else:
                data["percentage"] = 0.0

        # Sort by line_count descending
        sorted_languages = sorted(
            stats.values(),
            key=lambda x: (x["line_count"], x["file_count"]),
            reverse=True,
        )

        return {
            "languages": sorted_languages,
            "primary_language": sorted_languages[0]["language"] if sorted_languages else "Unknown",
            "total_files": total_files,
            "total_lines": total_lines,
            "total_code_lines": total_code_lines,
            "total_blank_lines": total_blank_lines,
            "total_comment_lines": total_comment_lines,
            "total_bytes": total_bytes,
        }



language_service = LanguageDetectionService()
