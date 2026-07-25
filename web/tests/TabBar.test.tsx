import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { TabBar } from '../src/views/dashboard/TabBar'

test('renders four tabs with the active one marked', () => {
  render(<TabBar active="home" />)
  expect(screen.getByText('홈').closest('.tab')?.className).toContain('on')
  expect(screen.getByText('활동')).toBeInTheDocument()
  expect(screen.getByText('알림')).toBeInTheDocument()
  expect(screen.getByText('설정')).toBeInTheDocument()
})

test('only the home tab has a screen, so only it is focusable/enabled', () => {
  render(<TabBar active="home" />)
  const home = screen.getByText('홈').closest('button')!
  expect(home).not.toBeDisabled()
  expect(home).toHaveAttribute('aria-selected', 'true')
  for (const label of ['활동', '알림', '설정']) {
    const tab = screen.getByText(label).closest('button')!
    expect(tab).toBeDisabled()
    expect(tab).toHaveAttribute('aria-selected', 'false')
  }
})
