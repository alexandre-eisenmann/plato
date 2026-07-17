import {describe, expect, it} from 'vitest'
import {cameraDistanceForMaze} from './SceneCamera.jsx'

describe('scene camera framing', () => {
  it('moves farther away for a narrow portrait viewport', () => {
    const landscape = cameraDistanceForMaze(16 / 9, 20, 20)
    const portrait = cameraDistanceForMaze(9 / 16, 20, 20)

    expect(portrait).toBeGreaterThan(landscape)
  })

  it('moves farther away for a larger maze', () => {
    expect(cameraDistanceForMaze(1, 40, 40)).toBeGreaterThan(
      cameraDistanceForMaze(1, 20, 20),
    )
  })
})
