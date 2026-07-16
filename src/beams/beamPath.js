import {intersectWallIndex} from '../maze/wallCollision.js'

const LENGTH_TOLERANCE = 1e-7

export function beamPathLength(points) {
  let distance = 0
  for (let index = 1; index < points.length; index += 1) {
    distance += points[index - 1].distanceTo(points[index])
  }
  return distance
}

export function traceReflections(source, target, collisionIndex, metrics) {
  const points = [source]
  let remainingDistance = source.distanceTo(target)
  let intersection = findIntersection(source, target, collisionIndex, metrics)

  while (intersection) {
    const incoming = target.clone().sub(source).normalize()
    const projection = incoming.dot(intersection.normal)
    const reflected = incoming.sub(
      intersection.normal.clone().multiplyScalar(2 * projection),
    )

    remainingDistance -= source.distanceTo(intersection.point)
    source = intersection.point.clone()
    target = source.clone().add(
      reflected.normalize().multiplyScalar(remainingDistance),
    )
    points.push(source)
    intersection = findIntersection(source, target, collisionIndex, metrics)
  }

  points.push(target)
  return points
}

function findIntersection(source, target, collisionIndex, metrics) {
  metrics.raycasts += 1
  return intersectWallIndex(source, target, collisionIndex, metrics)
}

export function advanceBeamPath(points, distance, collisionIndex, metrics) {
  if (distance === 0 || points.length < 2) return points

  const nextPoints = points.slice(0, -2)
  let source = points.at(-2)
  let target = points.at(-1)
  const extension = target.clone().sub(source).normalize().multiplyScalar(distance)
  target = target.clone().add(extension)
  nextPoints.push(...traceReflections(source, target, collisionIndex, metrics))

  let shortened = 0
  while (shortened < distance && nextPoints.length >= 2) {
    source = nextPoints[0]
    target = nextPoints[1]
    nextPoints.shift()
    shortened += source.distanceTo(target)
  }

  const remainder = distance - shortened
  const newStart = target.clone().add(
    target.clone().sub(source).normalize().multiplyScalar(remainder),
  )
  nextPoints.unshift(newStart)
  return nextPoints
}

export function hasStableBeamLength(points, expectedLength) {
  return Math.abs(beamPathLength(points) - expectedLength) < LENGTH_TOLERANCE
}
