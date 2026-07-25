import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Kiosk } from './views/Kiosk'
import { Dashboard } from './views/dashboard/Dashboard'
import { useStore } from './store'
import { useWebSocket } from './ws'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000/ws'

// 낙상 경보 자동 해제는 여기(App 최상단, 라우트 무관)에서 소유한다 —
// Kiosk/Dashboard 중 어느 화면이 떠 있든 6초 뒤 동일하게 사라져야 한다.
function useFallAlertAutoDismiss(timeoutMs = 6000): void {
  const alert = useStore((s) => s.alert)
  const clearAlert = useStore((s) => s.clearAlert)
  const alertTs = alert?.type === 'fall' ? alert.ts : null
  useEffect(() => {
    if (alertTs == null) return
    const id = setTimeout(() => clearAlert(), timeoutMs)
    return () => clearTimeout(id)
  }, [alertTs, clearAlert, timeoutMs])
}

export function App() {
  useWebSocket(WS_URL)
  useFallAlertAutoDismiss()
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
