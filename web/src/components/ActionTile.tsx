import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface ActionTileProps {
  icon: LucideIcon
  label: string
  tone?: 'default' | 'danger'
  children?: ReactNode
}

export function ActionTile({ icon: Icon, label, tone = 'default', children }: ActionTileProps) {
  return (
    <button type="button" className={tone === 'danger' ? 'tile tile--danger' : 'tile'}>
      <span className="tile-icon">
        <Icon size={34} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="tile-label">{label}</span>
      {children != null && <span className="tile-value">{children}</span>}
    </button>
  )
}
