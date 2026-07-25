import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import './dashboard.css'
import { useStore } from '../../store'
import { deriveSafetyStatus } from '../../lib/derive'
import { HeroStatus } from './HeroStatus'
import { MetricCards } from './MetricCards'
import { HomeMap } from './HomeMap'
import { ActivityFeed } from './ActivityFeed'
import { TabBar } from './TabBar'

function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export function Dashboard() {
  const mode = useStore((s) => s.mode)
  const alert = useStore((s) => s.alert)
  const heartBpm = useStore((s) => s.heartBpm)
  const present = useStore((s) => s.present)
  const lastActivityTs = useStore((s) => s.lastActivityTs)
  const events = useStore((s) => s.events)
  const now = useNow()

  const status = deriveSafetyStatus({
    present,
    lastActivityTs,
    hasCriticalAlert: alert?.severity === 'critical',
    now,
  })

  return (
    <div className="dash">
      <div className="dash-appbar">
        <div>
          <div className="hi">안녕하세요</div>
          <div className="who">어머니 상태예요</div>
        </div>
        <button type="button" className="iconbtn" aria-label="알림">
          <Bell size={20} strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>

      <HeroStatus {...status} />
      {/* 활동량은 8주 스켈레톤 단계의 시뮬레이션 값 — 실제 활동 스트림은 후속 계획에서 연동 */}
      <MetricCards heartBpm={heartBpm} activity={[40, 65, 50, 75, 60, 45]} />
      <HomeMap mode={mode} />
      <ActivityFeed events={events} />
      <TabBar active="home" />
    </div>
  )
}
