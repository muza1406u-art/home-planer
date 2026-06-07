"""Python server for the HomePlaner3D website.

Run with:
    python3 app.py

The app uses only Python's standard library, serves the static planner files,
and exposes room length/width data at /api/rooms for simple inspection.
"""

from __future__ import annotations

import json
import mimetypes
from dataclasses import asdict, dataclass
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = 4173


@dataclass(frozen=True)
class Room:
    name: str
    length: float
    width: float
    color: str
    x: int
    y: int

    @property
    def area(self) -> float:
        return self.length * self.width

    @property
    def perimeter(self) -> float:
        return 2 * (self.length + self.width)

    def to_payload(self) -> dict[str, float | int | str]:
        payload = asdict(self)
        payload["area"] = round(self.area, 2)
        payload["perimeter"] = round(self.perimeter, 2)
        return payload


ROOMS = [
    Room("Living Room", 5.6, 4.4, "#77a6ff", 22, 16),
    Room("Kitchen", 3.9, 3.2, "#ffbc68", 60, 17),
    Room("Bedroom", 4.6, 3.8, "#b38cff", 20, 58),
    Room("Bath", 2.7, 2.7, "#62dbc7", 62, 60),
]


class HomePlanerHandler(BaseHTTPRequestHandler):
    def do_HEAD(self) -> None:  # noqa: N802 - required by BaseHTTPRequestHandler
        self.handle_request(send_body=False)

    def do_GET(self) -> None:  # noqa: N802 - required by BaseHTTPRequestHandler
        self.handle_request(send_body=True)

    def handle_request(self, send_body: bool) -> None:
        parsed_path = urlparse(self.path).path
        if parsed_path == "/api/rooms":
            self.send_json({"rooms": [room.to_payload() for room in ROOMS]}, send_body=send_body)
            return

        if parsed_path in {"/", "/index.html"}:
            self.send_file(ROOT / "index.html", send_body=send_body)
            return

        file_path = (ROOT / unquote(parsed_path.lstrip("/"))).resolve()
        if ROOT not in file_path.parents or not file_path.is_file():
            self.send_error(404, "File not found")
            return

        self.send_file(file_path, send_body=send_body)

    def send_json(self, payload: dict, send_body: bool = True) -> None:
        body = json.dumps(payload, indent=2).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if send_body:
            self.wfile.write(body)

    def send_file(self, file_path: Path, send_body: bool = True) -> None:
        body = file_path.read_bytes()
        content_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
        if file_path.suffix == ".js":
            content_type = "text/javascript"
        self.send_response(200)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if send_body:
            self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        print(f"{self.address_string()} - {format % args}")


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), HomePlanerHandler)
    print(f"HomePlaner3D Python server running at http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
