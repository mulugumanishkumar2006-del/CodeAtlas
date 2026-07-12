"""Quick smoke test for RepositoryScanner – run from the backend directory."""

import os
import sys

# Add the backend app to sys.path so we can import directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "apps", "backend"))

from app.services.scanner import RepositoryScanner


def main():
    # Scan the CodeAtlas repo itself as a test target
    repo_root = os.path.join(os.path.dirname(__file__), "..")
    scanner = RepositoryScanner()
    result = scanner.scan(repo_root)

    print(result.summary())
    print(f"Skipped directories: {len(result.skipped_dirs)}")
    print()

    # Show first 20 files as a sample
    for f in result.files[:20]:
        print(f"  {f.relative_path}  ({f.size_bytes:,} bytes)")

    if result.total_files > 20:
        print(f"  ... and {result.total_files - 20} more files")

    print()

    # Verify ignored directories are actually skipped
    ignored_names = {"node_modules", ".git", "dist", ".venv", "__pycache__", ".next"}
    for f in result.files:
        parts = f.relative_path.split("/")
        for part in parts:
            if part in ignored_names:
                print(f"ERROR: File in ignored directory found: {f.relative_path}")
                sys.exit(1)

    print("✓ All files pass ignore-directory check")


if __name__ == "__main__":
    main()
