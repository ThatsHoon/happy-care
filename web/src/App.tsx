import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Kiosk } from './views/Kiosk'
import { Dashboard } from './views/dashboard/Dashboard'
import { useWebSocket } from './ws'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000/ws'

export function App() {
  useWebSocket(WS_URL)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/kiosk" element={<Kiosk />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/kiosk" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
