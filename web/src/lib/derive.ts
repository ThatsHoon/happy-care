export type SafetyLevel = 'safe' | 'warning' | 'danger'

export interface SafetyStatus {
  level: SafetyLevel
  title: string
  subtitle: string
  pill: string
}

export interface DeriveSafetyInput {
  present: boolean
  lastActivityTs: number | null // epoch seconds
  hasCriticalAlert: boolean
  now: number // epoch ms
}

const STALE_MS = 4 * 60 * 60 * 1000 // 4시간

export function deriveSafetyStatus(input: DeriveSafetyInput): SafetyStatus {
  const { present, lastActivityTs, hasCriticalAlert, now } = input
  const activityPart = lastActivityTs != null
    ? `${formatRelativeTime(lastActivityTs, now)} 활동`
    : '활동 기록 없음'
  const presencePart = present ? '재실 중' : '외출 중'

  if (hasCriticalAlert) {
    return {
      level: 'danger',
      title: '위험',
      subtitle: '즉시 확인이 필요해요',
      pill: `${presencePart} · ${activityPart} · 확인 필요`,
    }
  }

  const isStale = lastActivityTs != null && now - lastActivityTs * 1000 > STALE_MS
  if (present && isStale) {
    return {
      level: 'warning',
      title: '주의',
      subtitle: '최근 활동이 뜸해요',
      pill: `${presencePart} · ${activityPart} · 확인 권장`,
    }
  }

  return {
    level: 'safe',
    title: '안심',
    subtitle: '오늘도 평온해요',
    pill: `${presencePart} · ${activityPart} · 이상 없음`,
  }
}

export function gaugeValueForLevel(level: SafetyLevel): number {
  if (level === 'danger') return 0.25
  if (level === 'warning') return 0.55
  return 0.9
}

export function formatRelativeTime(fromTsSeconds: number, nowMs: number): string {
  const diffMs = nowMs - fromTsSeconds * 1000
  if (diffMs < 60_000) return '방금 전'
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}분 전`
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)}시간 전`
  return `${Math.floor(diffMs / 86_400_000)}일 전`
}

export function formatClockShort(tsSeconds: number): string {
  const d = new Date(tsSeconds * 1000)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}
