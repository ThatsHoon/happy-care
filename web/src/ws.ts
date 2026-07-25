import { useEffect } from 'react'
import { useStore } from './store'

export function useWebSocket(url: string): void {
  const handle = useStore((s) => s.handle)
  useEffect(() => {
    const ws = new WebSocket(url)
    ws.onmessage = (e) => handle(e.data as string)
    return () => ws.close()
  }, [url, handle])
}
