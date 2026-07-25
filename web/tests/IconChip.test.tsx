import { render } from '@testing-library/react'
import { HeartPulse } from 'lucide-react'
import { expect, test } from 'vitest'
import { IconChip } from '../src/components/IconChip'

test('renders an svg icon inside a toned chip', () => {
  const { container } = render(<IconChip icon={HeartPulse} tone="danger" />)
  const chip = container.querySelector('.icon-chip')!
  expect(chip.className).toContain('is-danger')
  expect(chip.querySelector('svg')).toBeTruthy()
})
