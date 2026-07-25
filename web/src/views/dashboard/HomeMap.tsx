interface HomeMapProps {
  mode: 'indoor' | 'outdoor'
  room?: string
}

export function HomeMap({ mode, room = '거실' }: HomeMapProps) {
  return (
    <div className="map-card">
      <div className="map-top">
        <span>집 · 실시간 위치</span>
        <span className="map-badge" data-testid="map-badge">
          {mode === 'indoor' ? '실내 모드' : '실외 모드'}
        </span>
      </div>
      <svg className="plan" viewBox="0 0 240 104" role="img" aria-label={`현재 위치: ${room}`}>
        <rect className={mode === 'indoor' ? 'room is-active' : 'room'} x="2" y="2" width="120" height="58" rx="10" />
        <rect className="room" x="128" y="2" width="110" height="58" rx="10" />
        <rect className="room" x="2" y="66" width="78" height="36" rx="10" />
        <rect className="room" x="86" y="66" width="152" height="36" rx="10" />
        <text x="14" y="32" fontSize="12" fontWeight="700" fill="var(--blue-deep)">{room}</text>
        <text x="140" y="34" fontSize="12" fontWeight="700" fill="var(--faint)">침실</text>
        <text x="14" y="88" fontSize="11" fontWeight="700" fill="var(--faint)">주방</text>
        <text x="98" y="88" fontSize="11" fontWeight="700" fill="var(--faint)">화장실</text>
        {mode === 'indoor' && <circle data-testid="here-dot" cx="70" cy="40" r="8" fill="var(--blue)" />}
      </svg>
    </div>
  )
}
