import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ActivityFeed } from '../src/views/dashboard/ActivityFeed'
import type { CareEvent } from '../src/types'

const events: CareEvent[] = [
  { ts: 1700000000, type: 'fall', severity: 'critical', mode: 'indoor', message: '낙상 감지 — 보호자·119 알림' },
  { ts: 1699999000, type: 'mode_change', severity: 'info', mode: 'indoor', message: '도킹 · 실내 모드 · 카메라 OFF' },
]

test('renders each event message with a tone dot', () => {
  const { container } = render(<ActivityFeed events={events} />)
  expect(screen.getByText('낙상 감지 — 보호자·119 알림')).toBeInTheDocument()
  expect(screen.getByText('도킹 · 실내 모드 · 카메라 OFF')).toBeInTheDocument()
  expect(container.querySelector('.d.is-danger')).toBeTruthy()
})

test('shows an empty state when there are no events', () => {
  render(<ActivityFeed events={[]} />)
  expect(screen.getByText('아직 기록된 소식이 없어요')).toBeInTheDocument()
})
