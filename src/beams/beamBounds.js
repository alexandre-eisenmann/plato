export function isPointInsideBounds(point, bounds, margin = 0) {
  return (
    point.x >= bounds.minX - margin &&
    point.x <= bounds.maxX + margin &&
    point.y >= bounds.minY - margin &&
    point.y <= bounds.maxY + margin
  )
}

export function hasClearedBounds(points, bounds, margin = 0) {
  if (points.length === 0) return true

  return (
    points.every(point => point.x < bounds.minX - margin) ||
    points.every(point => point.x > bounds.maxX + margin) ||
    points.every(point => point.y < bounds.minY - margin) ||
    points.every(point => point.y > bounds.maxY + margin)
  )
}
