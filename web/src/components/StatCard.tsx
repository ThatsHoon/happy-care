import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { IconChip } from './IconChip'

interface StatCardProps {
  icon: LucideIcon
  label: string
  children?: ReactNode
}

export function StatCard({ icon, label, children }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="sc-top"><IconChip icon={icon} box={26} size={15} />{label}</div>
      {children != null && <div className="sc-val">{children}</div>}
    </div>
  )
}
