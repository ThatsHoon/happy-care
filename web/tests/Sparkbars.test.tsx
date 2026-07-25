import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Sparkbars } from '../src/components/Sparkbars'

test('renders one bar per value', () => {
  const { container } = render(<Sparkbars values={[10, 40, 25, 60]} />)
  expect(container.querySelectorAll('.bars > i')).toHaveLength(4)
})

test('marks bars at or above 55% of the max as active', () => {
  const { container } = render(<Sparkbars values={[10, 100]} />)
  const bars = container.querySelectorAll('.bars > i')
  expect(bars[0].className).not.toContain('on')
  expect(bars[1].className).toContain('on')
})
