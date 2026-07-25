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
      // lastActivityTs = "센서가 마지막으로 보고한 시각"이지 "마지막 실제 움직임 시각"이 아니다.
      // 지금 더미 소스는 짧은 주기로 계속 state를 보내므로 항상 최신이라 4시간 정체(warning)
      // 임계값에 도달하지 않는다 — 실제 Gazebo/레이더 스트림에서 활동 유무를 구분해 갱신하도록
      // 후속 계획에서 다듬을 것.
      set({ present: msg.data.present, lastActivityTs: msg.data.ts })
      if (msg.data.heart_bpm != null) set({ heartBpm: msg.data.heart_bpm })
    }
  },
}))
