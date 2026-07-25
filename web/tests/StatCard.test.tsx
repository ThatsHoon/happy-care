import { render, screen } from '@testing-library/react'
import { HeartPulse } from 'lucide-react'
import { expect, test } from 'vitest'
import { StatCard } from '../src/components/StatCard'

test('shows label and value', () => {
  render(<StatCard icon={HeartPulse} label="심박">72</StatCard>)
  expect(screen.getByText('심박')).toBeInTheDocument()
  expect(screen.getByText('72')).toBeInTheDocument()
})
