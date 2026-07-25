import json
from fastapi.testclient import TestClient
from happy_care.app import create_app


def test_kiosk_receives_mode_change_and_fall():
    app = create_app(with_dummy=True, interval=0.01)
    seen: set[str] = set()
    # TestClient must be entered as a context manager for the FastAPI
    # lifespan (startup/shutdown) to run at all — without this, the
    # dummy_source background task never starts and the websocket read
    # below blocks forever. This is required regardless of dummy_source's
    # presence; it is not a workaround, it is the correct TestClient usage
    # for a lifespan-dependent app on the installed Starlette/FastAPI version.
    with TestClient(app) as client, client.websocket_connect("/ws") as ws:
        # Collect event types over a window and stop once both have arrived.
        # A freshly-connected subscriber may miss the first few messages, so we
        # assert both event types appear rather than relying on their order.
        for _ in range(80):
            msg = json.loads(ws.receive_text())
            if msg["kind"] == "event":
                seen.add(msg["data"]["type"])
            if {"mode_change", "fall"} <= seen:
                break
    assert "mode_change" in seen
    assert "fall" in seen
