import { render, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'
import { Dashboard } from '../src/views/dashboard/Dashboard'
import { useStore } from '../src/store'

beforeEach(() => {
  const nowSec = Math.floor(Date.now() / 1000)
  useStore.setState({
    mode: 'indoor', alert: null, heartBpm: 72,
    events: [{ ts: nowSec, type: 'mode_change', severity: 'info', mode: 'indoor', message: '도킹' }],
    present: true, lastActivityTs: nowSec,
  })
})

test('renders hero, metrics, map, feed and tab bar together', () => {
  render(<Dashboard />)
  expect(screen.getByText('안녕하세요')).toBeInTheDocument()
  expect(screen.getByText('안심')).toBeInTheDocument()
  expect(screen.getByText('심박')).toBeInTheDocument()
  expect(screen.getByTestId('map-badge')).toHaveTextContent('실내 모드')
  expect(screen.getByText('도킹')).toBeInTheDocument()
  expect(screen.getByText('홈')).toBeInTheDocument()
})
