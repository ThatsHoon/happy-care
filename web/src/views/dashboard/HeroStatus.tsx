import { ShieldCheck, TriangleAlert } from 'lucide-react'
import { RadialGauge } from '../../components/RadialGauge'
import { gaugeValueForLevel } from '../../lib/derive'
import type { SafetyStatus } from '../../lib/derive'

type HeroStatusProps = SafetyStatus

const GRADIENTS: Record<SafetyStatus['level'], { from: string; to: string }> = {
  safe: { from: '#1E5BE6', to: '#5B9BFF' },
  warning: { from: '#E8A23D', to: '#F3C27C' },
  danger: { from: '#E5484D', to: '#F3A0A0' },
}

export function HeroStatus({ level, title, subtitle, pill }: HeroStatusProps) {
  const Icon = level === 'danger' ? TriangleAlert : ShieldCheck
  const { from, to } = GRADIENTS[level]
  return (
    <div className="hero">
      <RadialGauge value={gaugeValueForLevel(level)} size={196} stroke={16} from={from} to={to}>
        <span className={level === 'danger' ? 'gauge-check is-danger' : 'gauge-check'}>
          <Icon size={28} strokeWidth={2.4} aria-hidden="true" />
        </span>
        <span className="gauge-big">{title}</span>
        <span className="gauge-small">{subtitle}</span>
      </RadialGauge>
      <p className="hero-sub">{pill}</p>
    </div>
  )
}
