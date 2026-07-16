import {describe, expect, it} from 'vitest'
import {Vector3} from 'three'
import {createWallCollisionIndex} from '../maze/wallCollision.js'
import {advanceBeamPath, beamPathLength, traceReflections} from './beamPath.js'

const collisionIndex = createWallCollisionIndex(
  {'h:0:-1': {door: false}},
  20,
  20,
  0.5,
)

function metrics() {
  return {raycasts: 0, wallTests: 0}
}

describe('beam path simulation', () => {
  it('reflects from an indexed wall while preserving travel distance', () => {
    const source = new Vector3(-9.5, -9, 0.5)
    const target = new Vector3(-9.5, -10, 0.5)
    const path = traceReflections(source, target, collisionIndex, metrics())

    expect(path).toHaveLength(3)
    expect(path[1].y).toBeCloseTo(-9.75)
    expect(path[2].y).toBeCloseTo(-9.5)
    expect(beamPathLength(path)).toBeCloseTo(1)
  })

  it('advances a fixed-length beam without changing its length', () => {
    const initial = [
      new Vector3(-9.5, -9, 0.5),
      new Vector3(-9.5, -9.4, 0.5),
    ]
    const advanced = advanceBeamPath(initial, 0.5, collisionIndex, metrics())

    expect(beamPathLength(advanced)).toBeCloseTo(beamPathLength(initial))
    expect(advanced.length).toBeGreaterThan(2)
  })
})
