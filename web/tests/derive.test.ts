import { expect, test } from 'vitest'
import {
  deriveSafetyStatus, gaugeValueForLevel, formatRelativeTime, formatClockShort,
} from '../src/lib/derive'

const NOW = 1_700_000_000_000 // 고정 기준 시각(ms), 실시계 비의존

test('critical alert overrides everything to danger', () => {
  const s = deriveSafetyStatus({
    present: true, lastActivityTs: NOW / 1000 - 60, hasCriticalAlert: true, now: NOW,
  })
  expect(s.level).toBe('danger')
  expect(s.title).toBe('위험')
})

test('present and recently active is safe', () => {
  const s = deriveSafetyStatus({
    present: true, lastActivityTs: NOW / 1000 - 300, hasCriticalAlert: false, now: NOW,
  })
  expect(s.level).toBe('safe')
  expect(s.title).toBe('안심')
})

test('present but activity stale beyond 4 hours is warning', () => {
  const s = deriveSafetyStatus({
    present: true, lastActivityTs: NOW / 1000 - 5 * 3600, hasCriticalAlert: false, now: NOW,
  })
  expect(s.level).toBe('warning')
  expect(s.title).toBe('주의')
})

test('absent (외출 중) stays safe even if last activity is stale', () => {
  const s = deriveSafetyStatus({
    present: false, lastActivityTs: NOW / 1000 - 5 * 3600, hasCriticalAlert: false, now: NOW,
  })
  expect(s.level).toBe('safe')
})

test('gaugeValueForLevel maps level to fill amount', () => {
  expect(gaugeValueForLevel('safe')).toBe(0.9)
  expect(gaugeValueForLevel('warning')).toBe(0.55)
  expect(gaugeValueForLevel('danger')).toBe(0.25)
})

test('formatRelativeTime buckets: just now / minutes / hours / days', () => {
  expect(formatRelativeTime(NOW / 1000 - 30, NOW)).toBe('방금 전')
  expect(formatRelativeTime(NOW / 1000 - 600, NOW)).toBe('10분 전')
  expect(formatRelativeTime(NOW / 1000 - 7200, NOW)).toBe('2시간 전')
  expect(formatRelativeTime(NOW / 1000 - 172800, NOW)).toBe('2일 전')
})

test('formatClockShort formats HH:MM with zero-padding', () => {
  const d = new Date(2026, 0, 1, 9, 5, 0)
  expect(formatClockShort(d.getTime() / 1000)).toBe('09:05')
})
