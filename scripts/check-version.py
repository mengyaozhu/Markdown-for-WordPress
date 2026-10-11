"""Validate release metadata and, in CI, the triggering semantic tag."""
import json
import os
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
package = json.loads((root / "package.json").read_text())["version"]
assert re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+", package), package
lock = json.loads((root / "package-lock.json").read_text())
php = (root / "plugin/markdown-for-wordpress/markdown-for-wordpress.php").read_text()
readme = (root / "plugin/markdown-for-wordpress/readme.txt").read_text()
assert re.search(r"^ \* Version: (.+)$", php, re.M).group(1) == package
assert re.search(r"^Stable tag: (.+)$", readme, re.M).group(1) == package
assert lock["version"] == lock["packages"][""]["version"] == package
assert all(v == package for v in re.findall(r"'([0-9]+\.[0-9]+\.[0-9]+)-'", php))
if os.environ.get("GITHUB_REF_TYPE") == "tag":
    assert os.environ["GITHUB_REF_NAME"] == "v" + package
print("Version consistency PASS: " + package)
