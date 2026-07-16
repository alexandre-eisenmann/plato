import {Vector3} from 'three'
import {createWallTransforms} from './wallTransforms.js'

const EPSILON = 1e-9

function bucketKey(x, y) {
  return `${x}:${y}`
}

export function createWallCollisionIndex(
  walls,
  width,
  height,
  wallThickness,
  cellSize = 1,
) {
  const halfLongSide = (1 + wallThickness) / 2
  const halfShortSide = wallThickness / 2
  const boxes = createWallTransforms(walls, width, height).map(transform => {
    const vertical = transform.rotationZ !== 0
    const halfX = vertical ? halfShortSide : halfLongSide
    const halfY = vertical ? halfLongSide : halfShortSide
    return {
      minX: transform.position[0] - halfX,
      maxX: transform.position[0] + halfX,
      minY: transform.position[1] - halfY,
      maxY: transform.position[1] + halfY,
    }
  })
  const buckets = new Map()

  boxes.forEach((box, boxIndex) => {
    const minCellX = Math.floor(box.minX / cellSize)
    const maxCellX = Math.floor(box.maxX / cellSize)
    const minCellY = Math.floor(box.minY / cellSize)
    const maxCellY = Math.floor(box.maxY / cellSize)

    for (let x = minCellX; x <= maxCellX; x += 1) {
      for (let y = minCellY; y <= maxCellY; y += 1) {
        const key = bucketKey(x, y)
        const bucket = buckets.get(key) ?? []
        bucket.push(boxIndex)
        buckets.set(key, bucket)
      }
    }
  })

  return {boxes, buckets, cellSize}
}

function intersectBox(source, direction, box, minimumT) {
  let entryT = 0
  let exitT = 1
  let normalX = 0
  let normalY = 0

  for (const axis of ['x', 'y']) {
    const origin = source[axis]
    const delta = direction[axis]
    const minimum = axis === 'x' ? box.minX : box.minY
    const maximum = axis === 'x' ? box.maxX : box.maxY

    if (Math.abs(delta) < EPSILON) {
      if (origin < minimum || origin > maximum) return null
      continue
    }

    let nearT = (minimum - origin) / delta
    let farT = (maximum - origin) / delta
    const nearNormal = delta > 0 ? -1 : 1
    if (nearT > farT) {
      [nearT, farT] = [farT, nearT]
    }

    if (nearT > entryT) {
      entryT = nearT
      normalX = axis === 'x' ? nearNormal : 0
      normalY = axis === 'y' ? nearNormal : 0
    }
    exitT = Math.min(exitT, farT)
    if (entryT > exitT) return null
  }

  if (entryT <= minimumT || entryT > 1) return null
  return {entryT, normalX, normalY}
}

export function intersectWallIndex(source, target, index, metrics) {
  const direction = target.clone().sub(source)
  const distance = direction.length()
  if (distance === 0) return null

  const minimumT = 0.00001 / distance
  const minCellX = Math.floor(Math.min(source.x, target.x) / index.cellSize)
  const maxCellX = Math.floor(Math.max(source.x, target.x) / index.cellSize)
  const minCellY = Math.floor(Math.min(source.y, target.y) / index.cellSize)
  const maxCellY = Math.floor(Math.max(source.y, target.y) / index.cellSize)
  const candidates = new Set()

  for (let x = minCellX; x <= maxCellX; x += 1) {
    for (let y = minCellY; y <= maxCellY; y += 1) {
      const bucket = index.buckets.get(bucketKey(x, y))
      if (bucket) bucket.forEach(boxIndex => candidates.add(boxIndex))
    }
  }

  let closest = null
  for (const boxIndex of candidates) {
    if (metrics) metrics.wallTests += 1
    const intersection = intersectBox(
      source,
      direction,
      index.boxes[boxIndex],
      minimumT,
    )
    if (intersection && (!closest || intersection.entryT < closest.entryT)) {
      closest = intersection
    }
  }

  if (!closest) return null
  return {
    point: source.clone().add(direction.multiplyScalar(closest.entryT)),
    normal: new Vector3(closest.normalX, closest.normalY, 0),
  }
}
