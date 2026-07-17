import seedrandom from 'seedrandom'
import {createMazeBounds} from '../sceneConfig.js'
import {generateMaze} from './generateMaze.js'
import {createMazeExits} from './mazeExits.js'

export function createMazeExperiment({
  size,
  seed,
  preferredEntryPoint,
}) {
  const width = size
  const height = size
  const walls = generateMaze(width, height, seedrandom(seed))

  return {
    bounds: createMazeBounds(width, height),
    exits: createMazeExits(
      walls,
      width,
      height,
      preferredEntryPoint,
    ),
    height,
    seed,
    walls,
    width,
  }
}

export function createRandomMazeSeed(createId = () => crypto.randomUUID()) {
  return createId().replaceAll('-', '').slice(0, 12).toUpperCase()
}
