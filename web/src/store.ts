import { create } from 'zustand'
import type { CareEvent, SystemMode, WsMessage } from './types'

const MAX_EVENTS = 20

interface AppState {
  mode: SystemMode
  alert: CareEvent | null
  heartBpm: number | null
  connected: boolean
  events: CareEvent[]
  present: boolean
  lastActivityTs: number | null
  setConnected: (v: boolean) => void
  clearAlert: () => void
  handle: (raw: string) => void
}

export const useStore = create<AppState>((set, get) => ({
  mode: 'outdoor',
  alert: null,
  heartBpm: null,
  connected: false,
  events: [],
  present: false,
  lastActivityTs: null,
  setConnected: (v) => set({ connected: v }),
  clearAlert: () => set({ alert: null }),
  handle: (raw) => {
    const msg = JSON.parse(raw) as WsMessage
    if (msg.kind === 'event') {
      if (msg.data.type === 'mode_change') set({ mode: msg.data.mode })
      if (msg.data.type === 'fall') set({ alert: msg.data })
      set({ events: [msg.data, ...get().events].slice(0, MAX_EVENTS) })
    } else if (msg.kind === 'state') {
      set({ present: msg.data.present, lastActivityTs: msg.data.ts })
      if (msg.data.heart_bpm != null) set({ heartBpm: msg.data.heart_bpm })
    }
  },
}))
