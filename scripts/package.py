"""Build the installable release ZIP using only Python's standard library."""
from pathlib import Path
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "plugin" / "markdown-for-wordpress"
header = (SOURCE / "markdown-for-wordpress.php").read_text()
version = re.search(r"^ \* Version: ([0-9]+\.[0-9]+\.[0-9]+)$", header, re.M).group(1)
files = [SOURCE / "markdown-for-wordpress.php", SOURCE / "readme.txt", ROOT / "LICENSE"]
files.extend(sorted((SOURCE / "assets").glob("*.js")))
output = ROOT / "dist" / f"markdown-for-wordpress-{version}.zip"
output.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
    for source in files:
        relative = Path(source.name) if source.parent == ROOT else source.relative_to(SOURCE)
        archive.write(source, Path("markdown-for-wordpress") / relative)
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    assert all(name.startswith("markdown-for-wordpress/") for name in archive.namelist())
print(output)
