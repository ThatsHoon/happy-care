import asyncio
from happy_care.bus import EventBus


def test_publish_delivers_to_all_subscribers():
    async def scenario():
        bus = EventBus()
        q1, q2 = bus.subscribe(), bus.subscribe()
        await bus.publish("hello")
        a = await asyncio.wait_for(q1.get(), 1)
        b = await asyncio.wait_for(q2.get(), 1)
        return a, b
    assert asyncio.run(scenario()) == ("hello", "hello")


def test_unsubscribe_stops_delivery():
    async def scenario():
        bus = EventBus()
        q = bus.subscribe()
        bus.unsubscribe(q)
        await bus.publish("x")
        return q.qsize()
    assert asyncio.run(scenario()) == 0
