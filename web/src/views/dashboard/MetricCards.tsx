import { Activity, HeartPulse } from 'lucide-react'
import { StatCard } from '../../components/StatCard'
import { Sparkbars } from '../../components/Sparkbars'

interface MetricCardsProps {
  heartBpm: number | null
  activity: number[]
}

export function MetricCards({ heartBpm, activity }: MetricCardsProps) {
  return (
    <div className="metrics">
      <StatCard icon={HeartPulse} label="심박">
        {heartBpm != null ? (
          <>
            {heartBpm}
            <span className="u">회/분</span>
          </>
        ) : (
          '측정 중'
        )}
      </StatCard>
      <StatCard icon={Activity} label="활동량">
        <Sparkbars values={activity} />
      </StatCard>
    </div>
  )
}
