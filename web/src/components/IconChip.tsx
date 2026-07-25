import type { LucideIcon } from 'lucide-react'

interface IconChipProps {
  icon: LucideIcon
  tone?: 'blue' | 'good' | 'danger'
  box?: number
  size?: number
}

export function IconChip({ icon: Icon, tone = 'blue', box = 44, size = 24 }: IconChipProps) {
  const cls =
    tone === 'good' ? 'icon-chip is-good' : tone === 'danger' ? 'icon-chip is-danger' : 'icon-chip'
  return (
    <span className={cls} style={{ width: box, height: box }}>
      <Icon size={size} strokeWidth={2.2} aria-hidden="true" />
    </span>
  )
}
