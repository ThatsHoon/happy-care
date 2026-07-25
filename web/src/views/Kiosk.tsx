import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store'

export function Kiosk() {
  const { mode, alert, heartBpm } = useStore()
  const modeText = mode === 'indoor' ? '실내 모드 · 지켜보는 중' : '실외 모드 · 보행 중'
  return (
    <div style={{ fontFamily: 'Malgun Gothic, sans-serif', padding: 24 }}>
      <div data-testid="mode" style={{ fontSize: 28, fontWeight: 800 }}>
        {mode === 'indoor' ? '🟢 ' : '🚶 '}{modeText}
      </div>
      {heartBpm != null && (
        <div style={{ fontSize: 24, marginTop: 12 }}>❤️ {heartBpm}</div>
      )}
      <AnimatePresence>
        {alert?.type === 'fall' && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: 24, padding: 24, borderRadius: 16,
              background: '#C8321F', color: '#fff', fontSize: 26, fontWeight: 800,
            }}
          >
            🆘 낙상 감지 — 도움을 부르는 중
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
