import json
from enum import Enum
from typing import Literal, Optional, Tuple

from pydantic import BaseModel


class SystemMode(str, Enum):
    OUTDOOR = "outdoor"
    INDOOR = "indoor"


class Activity(str, Enum):
    ABSENT = "absent"
    WALKING = "walking"
    SITTING = "sitting"
    LYING = "lying"
    STILL = "still"
    FALL = "fall"


class PersonState(BaseModel):
    ts: float
    present: bool
    position: Tuple[float, float]
    torso_velocity: float
    activity: Activity
    resp_bpm: Optional[float] = None
    heart_bpm: Optional[float] = None


class CareEvent(BaseModel):
    ts: float
    type: Literal["fall", "vital_alert", "isolation_warning", "mode_change"]
    severity: Literal["info", "warning", "critical"]
    mode: SystemMode
    message: str


def envelope(kind: str, model: BaseModel) -> str:
    return json.dumps({"kind": kind, "data": model.model_dump(mode="json")})
