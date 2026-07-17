import {describe, expect, it} from 'vitest'
import {createMazeExperiment, createRandomMazeSeed} from './createMazeExperiment.js'

describe('maze experiment', () => {
  it('creates a deterministic square maze with bounds and two named exits', () => {
    const first = createMazeExperiment({size: 12, seed: 'dynamic-maze'})
    const second = createMazeExperiment({size: 12, seed: 'dynamic-maze'})

    expect(first.walls).toEqual(second.walls)
    expect(first.bounds).toEqual({minX: -6, maxX: 6, minY: -6, maxY: 6})
    expect(first.exits.map(exit => exit.id)).toEqual(['A', 'B'])
  })

  it('creates a compact display seed', () => {
    expect(createRandomMazeSeed(() => '12345678-abcd-ef00-1122')).toBe('12345678ABCD')
  })
})
