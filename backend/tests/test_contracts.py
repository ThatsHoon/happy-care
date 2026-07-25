import json
from happy_care.contracts import (
    SystemMode, Activity, PersonState, CareEvent, envelope,
)


def test_care_event_serializes_to_envelope():
    e = CareEvent(ts=1.0, type="fall", severity="critical",
                  mode=SystemMode.INDOOR, message="낙상 감지")
    raw = envelope("event", e)
    msg = json.loads(raw)
    assert msg["kind"] == "event"
    assert msg["data"]["type"] == "fall"
    assert msg["data"]["mode"] == "indoor"   # enum -> value
    assert msg["data"]["severity"] == "critical"


def test_person_state_position_is_list_in_json():
    s = PersonState(ts=2.0, present=True, position=(1.2, 0.8),
                    torso_velocity=0.1, activity=Activity.WALKING,
                    heart_bpm=72.0, resp_bpm=15.0)
    data = json.loads(envelope("state", s))["data"]
    assert data["position"] == [1.2, 0.8]     # tuple -> list
    assert data["activity"] == "walking"
    assert data["heart_bpm"] == 72.0
