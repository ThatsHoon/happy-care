import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Footprints, HeartPulse, Phone, PersonStanding, ShieldCheck, Siren,
  TriangleAlert, Wifi, WifiOff,
} from 'lucide-react'
import { useStore } from '../store'
import { Skeleton } from '../components/Skeleton'
import { ActionTile } from '../components/ActionTile'
import { RadialGauge } from '../components/RadialGauge'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function formatClock(d: Date): string {
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, '0')
  const ampm = h < 12 ? '오전' : '오후'
  const h12 = ((h + 11) % 12) + 1
  return `${ampm} ${h12}:${m} · ${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}`
}

function useClock(): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function Kiosk() {
  const mode = useStore((s) => s.mode)
  const alert = useStore((s) => s.alert)
  const heartBpm = useStore((s) => s.heartBpm)
  const connected = useStore((s) => s.connected)
  const now = useClock()

  const isIndoor = mode === 'indoor'
  const StatusIcon = isIndoor ? ShieldCheck : Footprints
  const title = isIndoor ? '지켜보고 있어요' : '함께 걷고 있어요'
  const sub = isIndoor ? '실내 모드 · 카메라 꺼짐' : '실외 모드 · 보행 보조'

  return (
    <div className="kiosk">
      <div className="topbar">
        <span className="clock">{formatClock(now)}</span>
        <span className={connected ? 'conn is-on' : 'conn'}>
          {connected ? <Wifi size={18} aria-hidden="true" /> : <WifiOff size={18} aria-hidden="true" />}
          {connected ? '연결됨' : '연결 중'}
        </span>
      </div>

      <header className="kstatus">
        <RadialGauge value={0.86} size={216} stroke={14}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mode}
              className="kgauge-icon"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.35 }}
            >
              <StatusIcon size={64} strokeWidth={1.9} aria-hidden="true" />
            </motion.span>
          </AnimatePresence>
        </RadialGauge>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="ktitle">{title}</h1>
            <p data-testid="mode" className="ksub">{sub}</p>
          </motion.div>
        </AnimatePresence>
      </header>

      <div className="grid">
        <ActionTile icon={HeartPulse} label="건강 상태">
          {heartBpm != null ? (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              {heartBpm}
              <span className="unit">회/분</span>
            </motion.span>
          ) : (
            <Skeleton width={120} height={40} radius={12} />
          )}
        </ActionTile>
        <ActionTile icon={PersonStanding} label="보행 도움" />
        <ActionTile icon={Phone} label="가족 연결" />
        <ActionTile icon={Siren} label="도움 요청" tone="danger" />
      </div>

      <AnimatePresence>
        {alert?.type === 'fall' && (
          <motion.div className="fall-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              role="alert"
              className="fall-card"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              <span className="fall-icon">
                <TriangleAlert size={56} strokeWidth={2.2} aria-hidden="true" />
              </span>
              <h2 className="fall-title">낙상 감지</h2>
              <p className="fall-sub">도움을 부르고 있어요</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
