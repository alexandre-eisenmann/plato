import { describe, expect, it } from 'vitest'
import seedrandom from 'seedrandom'
import {generateMaze} from './generateMaze.js'

describe('maze', () => {
  it('is deterministic for a seeded random source', () => {
    const first = generateMaze(4, 3, seedrandom('plato'))
    const second = generateMaze(4, 3, seedrandom('plato'))

    expect(second).toEqual(first)
  })

  it('creates a perfect maze with two boundary doors', () => {
    const width = 4
    const height = 3
    const walls = generateMaze(width, height, seedrandom('plato'))
    const doors = Object.entries(walls).filter(([, wall]) => wall.door)

    // A rectangular grid starts with this many edges; a spanning tree removes
    // exactly one edge for every cell after the first.
    const allEdges = width * (height + 1) + height * (width + 1)
    expect(Object.keys(walls)).toHaveLength(allEdges - (width * height - 1))
    expect(doors).toHaveLength(2)
  })
})
