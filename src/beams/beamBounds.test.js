import { describe, expect, it } from 'vitest'
import {hasClearedBounds, isPointInsideBounds} from './beamBounds.js'

const bounds = {
  minX: -10,
  maxX: 10,
  minY: -10,
  maxY: 10,
}

describe('beam bounds', () => {
  it('recognizes points inside the maze', () => {
    expect(isPointInsideBounds({x: 0, y: 0}, bounds)).toBe(true)
    expect(isPointInsideBounds({x: 11, y: 0}, bounds)).toBe(false)
    expect(isPointInsideBounds({x: 11, y: 0}, bounds, 1)).toBe(true)
  })

  it('waits until the complete trail clears an edge', () => {
    const crossingRightEdge = [{x: 9, y: 0}, {x: 12, y: 0}]
    const beyondRightEdge = [{x: 12, y: 0}, {x: 13, y: 0}]

    expect(hasClearedBounds(crossingRightEdge, bounds, 1)).toBe(false)
    expect(hasClearedBounds(beyondRightEdge, bounds, 1)).toBe(true)
  })

  it('handles every exit direction', () => {
    expect(hasClearedBounds([{x: -12, y: 0}], bounds, 1)).toBe(true)
    expect(hasClearedBounds([{x: 0, y: -12}], bounds, 1)).toBe(true)
    expect(hasClearedBounds([{x: 0, y: 12}], bounds, 1)).toBe(true)
  })

  it('does not cull a segment spanning opposite sides', () => {
    expect(hasClearedBounds([{x: -12, y: 0}, {x: 12, y: 0}], bounds, 1)).toBe(false)
  })
})
