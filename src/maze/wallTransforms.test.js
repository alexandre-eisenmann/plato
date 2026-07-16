import { describe, expect, it } from 'vitest'
import { createWallTransforms } from './wallTransforms.js'

describe('wall transforms', () => {
  it('preserves horizontal and vertical wall placement', () => {
    const walls = {
      'h:0:-1': {door: false},
      'v:0:-1': {door: false},
      'h:1:0': {door: true},
    }

    expect(createWallTransforms(walls, 20, 20)).toEqual([
      {
        key: 'h:0:-1',
        position: [-9.5, -10, 0.4],
        rotationZ: 0,
      },
      {
        key: 'v:0:-1',
        position: [-10, -9.5, 0.4],
        rotationZ: Math.PI / 2,
      },
    ])
  })

  it('creates one visible instance per non-door wall', () => {
    const walls = {
      'h:0:-1': {door: false},
      'h:1:-1': {door: false},
      'v:0:-1': {door: true},
    }

    expect(createWallTransforms(walls, 2, 1)).toHaveLength(2)
  })
})
