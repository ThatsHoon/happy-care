import { useEffect } from 'react'
import { useStore } from './store'

export function useWebSocket(url: string): void {
  const handle = useStore((s) => s.handle)
  const setConnected = useStore((s) => s.setConnected)
  useEffect(() => {
    const ws = new WebSocket(url)
    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onmessage = (e) => handle(e.data as string)
    return () => ws.close()
  }, [url, handle, setConnected])
}
