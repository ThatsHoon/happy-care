export type SystemMode = 'outdoor' | 'indoor'

export interface CareEvent {
  ts: number
  type: 'fall' | 'vital_alert' | 'isolation_warning' | 'mode_change'
  severity: 'info' | 'warning' | 'critical'
  mode: SystemMode
  message: string
}

export interface PersonState {
  ts: number
  present: boolean
  position: [number, number]
  torso_velocity: number
  activity: string
  resp_bpm?: number | null
  heart_bpm?: number | null
}

export type WsMessage =
  | { kind: 'event'; data: CareEvent }
  | { kind: 'state'; data: PersonState }
