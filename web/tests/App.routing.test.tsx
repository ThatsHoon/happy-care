import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { App } from '../src/App'
import { useStore } from '../src/store'

class MockWS {
  onmessage: ((e: { data: string }) => void) | null = null
  constructor(public url: string) {}
  close() {}
}

beforeEach(() => {
  useStore.setState({ mode: 'outdoor', alert: null, heartBpm: null })
  vi.stubGlobal('WebSocket', MockWS as unknown as typeof WebSocket)
  window.history.pushState({}, '', '/')
})

afterEach(() => {
  window.history.pushState({}, '', '/')
})

test('default path redirects to the kiosk screen', () => {
  render(<App />)
  expect(screen.getByTestId('mode')).toBeInTheDocument()
})

test('"/dashboard" path renders the caregiver dashboard', () => {
  window.history.pushState({}, '', '/dashboard')
  render(<App />)
  expect(screen.getByText('안녕하세요')).toBeInTheDocument()
})
