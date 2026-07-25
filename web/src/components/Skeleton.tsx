interface SkeletonProps {
  width?: number | string
  height?: number | string
  radius?: number
}

export function Skeleton({ width = '100%', height = 20, radius = 10 }: SkeletonProps) {
  return (
    <span
      className="skeleton"
      aria-hidden="true"
      style={{ width, height, borderRadius: radius }}
    />
  )
}
