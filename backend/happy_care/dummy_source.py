import asyncio
import time

from .bus import EventBus
from .contracts import Activity, CareEvent, PersonState, SystemMode, envelope


async def run_dummy(bus: EventBus, interval: float = 1.0) -> None:
    while True:
        await bus.publish(envelope("event", CareEvent(
            ts=time.time(), type="mode_change", severity="info",
            mode=SystemMode.OUTDOOR, message="실외 모드 · 보행 중")))
        await asyncio.sleep(interval)

        await bus.publish(envelope("event", CareEvent(
            ts=time.time(), type="mode_change", severity="info",
            mode=SystemMode.INDOOR, message="도킹 · 실내 모드 · 카메라 OFF")))
        await asyncio.sleep(interval)

        await bus.publish(envelope("state", PersonState(
            ts=time.time(), present=True, position=(1.2, 0.8),
            torso_velocity=0.1, activity=Activity.WALKING,
            heart_bpm=72.0, resp_bpm=15.0)))
        await asyncio.sleep(interval)

        await bus.publish(envelope("event", CareEvent(
            ts=time.time(), type="fall", severity="critical",
            mode=SystemMode.INDOOR, message="낙상 감지 — 보호자·119 알림")))
        await asyncio.sleep(interval)
