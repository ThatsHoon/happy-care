interface SparkbarsProps {
  values: number[]
}

export function Sparkbars({ values }: SparkbarsProps) {
  const max = Math.max(1, ...values)
  return (
    <div className="bars">
      {values.map((v, i) => (
        <i
          key={i}
          className={v >= max * 0.55 ? 'on' : ''}
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  )
}
