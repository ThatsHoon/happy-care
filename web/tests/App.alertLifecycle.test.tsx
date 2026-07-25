import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
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
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  window.history.pushState({}, '', '/')
})

test('fall alert auto-clears after 6s while the dashboard route is mounted (not just kiosk)', () => {
  window.history.pushState({}, '', '/dashboard')
  render(<App />)
  act(() => last.onmessage?.({
    data: JSON.stringify({ kind: 'event', data: { ts: 1, type: 'fall', severity: 'critical', mode: 'indoor', message: '낙상' } }),
  }))
  expect(useStore.getState().alert?.type).toBe('fall')
  act(() => { vi.advanceTimersByTime(6000) })
  expect(useStore.getState().alert).toBeNull()
})

test('a second fall event restarts the 6s timer instead of clearing early', () => {
  window.history.pushState({}, '', '/kiosk')
  render(<App />)
  act(() => last.onmessage?.({
    data: JSON.stringify({ kind: 'event', data: { ts: 1, type: 'fall', severity: 'critical', mode: 'indoor', message: '낙상1' } }),
  }))
  act(() => { vi.advanceTimersByTime(4000) })
  act(() => last.onmessage?.({
    data: JSON.stringify({ kind: 'event', data: { ts: 2, type: 'fall', severity: 'critical', mode: 'indoor', message: '낙상2' } }),
  }))
  act(() => { vi.advanceTimersByTime(4000) })
  expect(useStore.getState().alert?.message).toBe('낙상2')
  act(() => { vi.advanceTimersByTime(2000) })
  expect(useStore.getState().alert).toBeNull()
})
