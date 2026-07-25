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
