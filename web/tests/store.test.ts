import { beforeEach, expect, test } from 'vitest'
import { useStore } from '../src/store'

beforeEach(() => useStore.setState({ mode: 'outdoor', alert: null, heartBpm: null }))

test('mode_change event updates mode', () => {
  useStore.getState().handle(JSON.stringify({
    kind: 'event', data: { ts: 1, type: 'mode_change', severity: 'info', mode: 'indoor', message: 'x' },
  }))
  expect(useStore.getState().mode).toBe('indoor')
})

test('fall event sets alert', () => {
  useStore.getState().handle(JSON.stringify({
    kind: 'event', data: { ts: 1, type: 'fall', severity: 'critical', mode: 'indoor', message: '낙상' },
  }))
  expect(useStore.getState().alert?.type).toBe('fall')
})

test('state message updates heartBpm', () => {
  useStore.getState().handle(JSON.stringify({
    kind: 'state', data: { ts: 1, present: true, position: [1, 1], torso_velocity: 0, activity: 'walking', heart_bpm: 72 },
  }))
  expect(useStore.getState().heartBpm).toBe(72)
})
