import {describe, expect, it} from 'vitest'
import {Vector3} from 'three'
import {createWallCollisionIndex, intersectWallIndex} from './wallCollision.js'

const walls = {
  'h:0:-1': {door: false},
  'v:0:-1': {door: false},
}

describe('wall collision index', () => {
  const index = createWallCollisionIndex(walls, 20, 20, 0.5)

  it('finds the nearest horizontal wall and its normal', () => {
    const hit = intersectWallIndex(
      new Vector3(-9.5, -9, 0.5),
      new Vector3(-9.5, -11, 0.5),
      index,
    )

    expect(hit.point.x).toBeCloseTo(-9.5)
    expect(hit.point.y).toBeCloseTo(-9.75)
    expect(hit.normal.toArray()).toEqual([0, 1, 0])
  })

  it('finds the nearest vertical wall and its normal', () => {
    const hit = intersectWallIndex(
      new Vector3(-9, -9.5, 0.5),
      new Vector3(-11, -9.5, 0.5),
      index,
    )

    expect(hit.point.x).toBeCloseTo(-9.75)
    expect(hit.point.y).toBeCloseTo(-9.5)
    expect(hit.normal.toArray()).toEqual([1, 0, 0])
  })

  it('tests only nearby wall candidates', () => {
    const metrics = {wallTests: 0}
    intersectWallIndex(
      new Vector3(8, 8, 0.5),
      new Vector3(8.5, 8.5, 0.5),
      index,
      metrics,
    )

    expect(metrics.wallTests).toBe(0)
  })
})
