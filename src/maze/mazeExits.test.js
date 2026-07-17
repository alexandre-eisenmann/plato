import {describe, expect, it} from 'vitest'
import {classifyMazeExit, createMazeExits} from './mazeExits.js'

describe('maze exits', () => {
  const walls = {
    'v:2:3': {door: true},
    'h:0:-1': {door: true},
  }

  it('names the door nearest the launch point A', () => {
    const exits = createMazeExits(walls, 4, 3, {x: 2.2, y: 1})

    expect(exits.map(exit => exit.id)).toEqual(['A', 'B'])
    expect(exits[0].center).toEqual({x: 2, y: 1})
    expect(exits[1].center).toEqual({x: -1.5, y: -1.5})
  })

  it('classifies a cleared beam by its nearest door', () => {
    const exits = createMazeExits(walls, 4, 3, {x: 2.2, y: 1})

    expect(classifyMazeExit({x: 4, y: 1}, exits)).toBe('A')
    expect(classifyMazeExit({x: -1.5, y: -4}, exits)).toBe('B')
  })
})
