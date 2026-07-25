import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { RadialGauge } from '../src/components/RadialGauge'

test('progress arc reflects value', () => {
  const { container } = render(<RadialGauge value={0.75} size={200} stroke={16} />)
  const prog = container.querySelector('[data-role="progress"]')!
  const r = (200 - 16) / 2
  const c = 2 * Math.PI * r
  expect(Number(prog.getAttribute('stroke-dasharray'))).toBeCloseTo(c, 2)
  expect(Number(prog.getAttribute('stroke-dashoffset'))).toBeCloseTo(c * (1 - 0.75), 2)
})

test('value is clamped to [0,1]', () => {
  const { container } = render(<RadialGauge value={1.8} size={100} stroke={10} />)
  const prog = container.querySelector('[data-role="progress"]')!
  expect(Number(prog.getAttribute('stroke-dashoffset'))).toBeCloseTo(0, 5)
})

test('renders center children', () => {
  const { getByText } = render(<RadialGauge value={0.5}><span>안심</span></RadialGauge>)
  expect(getByText('안심')).toBeInTheDocument()
})
