import type { CareEvent } from '../../types'
import { formatClockShort } from '../../lib/derive'

interface ActivityFeedProps {
  events: CareEvent[]
}

function dotTone(severity: CareEvent['severity']): string {
  if (severity === 'critical') return 'd is-danger'
  if (severity === 'warning') return 'd is-warning'
  return 'd'
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="feed">
      <h3>최근 소식</h3>
      {events.length === 0 ? (
        <p className="feed-empty">아직 기록된 소식이 없어요</p>
      ) : (
        events.map((e, i) => (
          <div className="row" key={`${e.ts}-${i}`}>
            <span className="t">{formatClockShort(e.ts)}</span>
            <span className={dotTone(e.severity)} />
            <span className="txt">{e.message}</span>
          </div>
        ))
      )}
    </div>
  )
}
