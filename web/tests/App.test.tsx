import { act, render, screen } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'
import { App } from '../src/App'
import { useStore } from '../src/store'

let last: any
class MockWS {
  onmessage: ((e: { data: string }) => void) | null = null
  constructor(public url: string) { last = this }
  close() {}
}

beforeEach(() => {
  useStore.setState({ mode: 'outdoor', alert: null, heartBpm: null })
  vi.stubGlobal('WebSocket', MockWS as unknown as typeof WebSocket)
})

test('a fall message flows through ws hook into the kiosk alert', () => {
  render(<App />)
  act(() => last.onmessage?.({
    data: JSON.stringify({ kind: 'event', data: { ts: 1, type: 'fall', severity: 'critical', mode: 'indoor', message: '낙상' } }),
  }))
  expect(screen.getByRole('alert')).toHaveTextContent('낙상 감지')
})
