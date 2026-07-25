import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from .bus import EventBus


def create_app(with_dummy: bool = False, interval: float = 1.0) -> FastAPI:
    bus = EventBus()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        task = None
        if with_dummy:
            from .dummy_source import run_dummy
            task = asyncio.create_task(run_dummy(bus, interval))
        yield
        if task:
            task.cancel()

    app = FastAPI(lifespan=lifespan)
    app.state.bus = bus

    @app.websocket("/ws")
    async def ws(websocket: WebSocket) -> None:
        await websocket.accept()
        q = bus.subscribe()
        try:
            while True:
                await websocket.send_text(await q.get())
        except WebSocketDisconnect:
            pass
        finally:
            bus.unsubscribe(q)

    return app


app = create_app(with_dummy=True, interval=1.0)
