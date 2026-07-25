import { act, render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { Kiosk } from '../src/views/Kiosk'
import { useStore } from '../src/store'

beforeEach(() => useStore.setState({ mode: 'outdoor', alert: null, heartBpm: null }))

test('shows indoor mode text', () => {
  act(() => useStore.setState({ mode: 'indoor' }))
  render(<Kiosk />)
  expect(screen.getByTestId('mode')).toHaveTextContent('실내 모드')
})

test('renders fall alert when a fall event arrives', () => {
  render(<Kiosk />)
  act(() => useStore.getState().handle(JSON.stringify({
    kind: 'event', data: { ts: 1, type: 'fall', severity: 'critical', mode: 'indoor', message: '낙상' },
  })))
  expect(screen.getByRole('alert')).toHaveTextContent('낙상 감지')
})
