import { create } from 'zustand'
import type { CareEvent, SystemMode, WsMessage } from './types'

interface AppState {
  mode: SystemMode
  alert: CareEvent | null
  heartBpm: number | null
  connected: boolean
  setConnected: (v: boolean) => void
  clearAlert: () => void
  handle: (raw: string) => void
}

export const useStore = create<AppState>((set) => ({
  mode: 'outdoor',
  alert: null,
  heartBpm: null,
  connected: false,
  setConnected: (v) => set({ connected: v }),
  clearAlert: () => set({ alert: null }),
  handle: (raw) => {
    const msg = JSON.parse(raw) as WsMessage
    if (msg.kind === 'event') {
      if (msg.data.type === 'mode_change') set({ mode: msg.data.mode })
      if (msg.data.type === 'fall') set({ alert: msg.data })
    } else if (msg.kind === 'state') {
      if (msg.data.heart_bpm != null) set({ heartBpm: msg.data.heart_bpm })
    }
  },
}))
