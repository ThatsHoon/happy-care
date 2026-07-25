import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { HeroStatus } from '../src/views/dashboard/HeroStatus'
import { gaugeValueForLevel } from '../src/lib/derive'

test('renders title, subtitle and pill text', () => {
  render(<HeroStatus level="safe" title="안심" subtitle="오늘도 평온해요" pill="재실 중 · 5분 전 활동 · 이상 없음" />)
  expect(screen.getByText('안심')).toBeInTheDocument()
  expect(screen.getByText('오늘도 평온해요')).toBeInTheDocument()
  expect(screen.getByText('재실 중 · 5분 전 활동 · 이상 없음')).toBeInTheDocument()
})

test('gauge fill reflects the danger level', () => {
  const { container } = render(<HeroStatus level="danger" title="위험" subtitle="즉시 확인이 필요해요" pill="확인 필요" />)
  const prog = container.querySelector('[data-role="progress"]')!
  const r = (196 - 16) / 2
  const c = 2 * Math.PI * r
  const expected = c * (1 - gaugeValueForLevel('danger'))
  expect(Number(prog.getAttribute('stroke-dashoffset'))).toBeCloseTo(expected, 2)
})
