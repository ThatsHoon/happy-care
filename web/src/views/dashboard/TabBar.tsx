import { Activity, Bell, Home, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type TabKey = 'home' | 'activity' | 'alerts' | 'settings'

interface TabBarProps {
  active: TabKey
}

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'home', label: '홈', icon: Home },
  { key: 'activity', label: '활동', icon: Activity },
  { key: 'alerts', label: '알림', icon: Bell },
  { key: 'settings', label: '설정', icon: Settings },
]

export function TabBar({ active }: TabBarProps) {
  return (
    <nav className="tabbar" aria-label="보호자 앱 내비게이션">
      {TABS.map(({ key, label, icon: Icon }) => (
        <span key={key} className={key === active ? 'tab on' : 'tab'}>
          <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
          {label}
        </span>
      ))}
    </nav>
  )
}
