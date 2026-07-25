import asyncio
import time

from .bus import EventBus
from .contracts import Activity, CareEvent, PersonState, SystemMode, envelope


def _mode(mode: SystemMode, message: str) -> str:
    return envelope("event", CareEvent(
        ts=time.time(), type="mode_change", severity="info",
        mode=mode, message=message))


def _person(heart: float, activity: Activity) -> str:
    return envelope("state", PersonState(
        ts=time.time(), present=True, position=(1.2, 0.8),
        torso_velocity=0.1, activity=activity, heart_bpm=heart, resp_bpm=15.0))


async def run_dummy(bus: EventBus, interval: float = 1.0) -> None:
    """Stand-in for the Gazebo/detection stack.

    Emits a realistic cadence: a short outdoor stroll, docking into indoor mode,
    several calm heart readings, then an occasional fall followed by recovery —
    so the kiosk's home screen is the default view and a fall is a real, transient
    event rather than a permanent state.
    """
    while True:
        await bus.publish(_mode(SystemMode.OUTDOOR, "실외 모드 · 보행 보조"))
        await asyncio.sleep(interval)
        await bus.publish(_person(80.0, Activity.WALKING))
        await asyncio.sleep(interval)

        await bus.publish(_mode(SystemMode.INDOOR, "도킹 · 실내 모드 · 카메라 OFF"))
        await asyncio.sleep(interval)
        for heart in (72.0, 71.0, 73.0, 72.0, 74.0, 72.0):
            await bus.publish(_person(heart, Activity.STILL))
            await asyncio.sleep(interval)

        await bus.publish(envelope("event", CareEvent(
            ts=time.time(), type="fall", severity="critical",
            mode=SystemMode.INDOOR, message="낙상 감지 — 보호자·119 알림")))
        await asyncio.sleep(interval)

        await bus.publish(_person(75.0, Activity.STILL))  # 회복
        await asyncio.sleep(interval)
