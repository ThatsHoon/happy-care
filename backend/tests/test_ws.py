import json
from fastapi.testclient import TestClient
from happy_care.app import create_app


def test_kiosk_receives_mode_change_then_fall():
    app = create_app(with_dummy=True, interval=0.01)
    seen_events = []
    # TestClient must be entered as a context manager for the FastAPI
    # lifespan (startup/shutdown) to run at all — without this, the
    # dummy_source background task never starts and the websocket read
    # below blocks forever. This is required regardless of dummy_source's
    # presence; it is not a workaround, it is the correct TestClient usage
    # for a lifespan-dependent app on the installed Starlette/FastAPI version.
    with TestClient(app) as client, client.websocket_connect("/ws") as ws:
        for _ in range(40):
            msg = json.loads(ws.receive_text())
            if msg["kind"] == "event":
                seen_events.append(msg["data"]["type"])
                if msg["data"]["type"] == "fall":
                    break
    assert "mode_change" in seen_events
    assert seen_events[-1] == "fall"
