import {describe, expect, it} from 'vitest'
import {cameraDistanceForMaze} from './SceneCamera.jsx'

describe('scene camera framing', () => {
  it('moves farther away for a narrow portrait viewport', () => {
    const landscape = cameraDistanceForMaze(16 / 9)
    const portrait = cameraDistanceForMaze(9 / 16)

    expect(portrait).toBeGreaterThan(landscape)
  })
})
