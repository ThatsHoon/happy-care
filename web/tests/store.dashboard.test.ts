import { beforeEach, expect, test } from 'vitest'
import { useStore } from '../src/store'

beforeEach(() => useStore.setState({
  mode: 'outdoor', alert: null, heartBpm: null,
  events: [], present: false, lastActivityTs: null,
}))

test('state message updates present and lastActivityTs', () => {
  useStore.getState().handle(JSON.stringify({
    kind: 'state',
    data: { ts: 1700000000, present: true, position: [1, 1], torso_velocity: 0, activity: 'walking', heart_bpm: 72 },
  }))
  expect(useStore.getState().present).toBe(true)
  expect(useStore.getState().lastActivityTs).toBe(1700000000)
})

test('any event type is appended to events, newest first', () => {
  useStore.getState().handle(JSON.stringify({
    kind: 'event', data: { ts: 1, type: 'mode_change', severity: 'info', mode: 'indoor', message: '도킹' },
  }))
  useStore.getState().handle(JSON.stringify({
    kind: 'event', data: { ts: 2, type: 'fall', severity: 'critical', mode: 'indoor', message: '낙상' },
  }))
  const events = useStore.getState().events
  expect(events).toHaveLength(2)
  expect(events[0].type).toBe('fall')
  expect(events[1].type).toBe('mode_change')
})

test('events list caps at 20 most recent entries', () => {
  for (let i = 0; i < 25; i++) {
    useStore.getState().handle(JSON.stringify({
      kind: 'event', data: { ts: i, type: 'mode_change', severity: 'info', mode: 'indoor', message: `e${i}` },
    }))
  }
  const events = useStore.getState().events
  expect(events).toHaveLength(20)
  expect(events[0].message).toBe('e24')
})
