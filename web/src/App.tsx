import { Kiosk } from './views/Kiosk'
import { useWebSocket } from './ws'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000/ws'

export function App() {
  useWebSocket(WS_URL)
  return <Kiosk />
}

export default App
