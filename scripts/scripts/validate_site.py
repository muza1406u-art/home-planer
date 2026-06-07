"""Validate the Python HomePlaner3D static website files."""

from __future__ import annotations

import ast
from pathlib import Path

REQUIRED_FILES = [
    Path("index.html"),
    Path("src/main.js"),
    Path("src/styles.css"),
    Path("app.py"),
]

missing = [str(path) for path in REQUIRED_FILES if not path.exists()]
if missing:
    raise SystemExit(f"Missing required files: {', '.join(missing)}")

html = Path("index.html").read_text(encoding="utf-8")
js = Path("src/main.js").read_text(encoding="utf-8")
css = Path("src/styles.css").read_text(encoding="utf-8")
app = Path("app.py").read_text(encoding="utf-8")
ast.parse(app)

checks = [
    ("page title", "HomePlaner 3D" in html),
    ("stylesheet link", "/src/styles.css" in html),
    ("module script", "/src/main.js" in html),
    ("Python server", "ThreadingHTTPServer" in app),
    ("room API", "/api/rooms" in app),
    ("length values", "length" in js and "Length" in js),
    ("width values", "width" in js and "Width" in js),
    ("dimension calculator", "dimensionOutput" in js),
    ("dimension cards", "dimension-card" in css),
    ("3D stage styles", "transform-style: preserve-3d" in css),
]

failures = [name for name, passed in checks if not passed]
if failures:
    raise SystemExit(f"Site validation failed: {', '.join(failures)}")

print("Python site validation passed.")
