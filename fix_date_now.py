import re
import os

files = [
    "apps/backend/app/enterprise/enterprise_simulation_engine.py",
    "apps/backend/app/enterprise/governance_compliance_engine.py",
    "apps/backend/app/ai_cto/enterprise_ai_cto_engine.py",
]

pattern = re.compile(r"Date\.now\(\) if 'Date' in globals\(\) else '(\d+)'")

for f in files:
    path = os.path.join(os.getcwd(), f)
    with open(path, "r", encoding="utf-8") as fh:
        content = fh.read()
    fixed = pattern.sub(lambda m: f"'{m.group(1)}'", content)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(fixed)
    print(f"Fixed: {f}")
