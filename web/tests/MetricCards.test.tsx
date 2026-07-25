import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { MetricCards } from '../src/views/dashboard/MetricCards'

test('shows heart rate value and label', () => {
  render(<MetricCards heartBpm={72} activity={[10, 20, 30]} />)
  expect(screen.getByText('심박')).toBeInTheDocument()
  expect(screen.getByText('72')).toBeInTheDocument()
})

test('shows a placeholder while heart rate is not yet known', () => {
  render(<MetricCards heartBpm={null} activity={[10, 20, 30]} />)
  expect(screen.getByText('측정 중')).toBeInTheDocument()
})
