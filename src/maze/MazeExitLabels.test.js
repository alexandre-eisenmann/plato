import {describe, expect, it} from 'vitest'
import {markerOffsetForScale, worldUnitsForPixels} from './MazeExitLabels.jsx'

describe('worldUnitsForPixels', () => {
  it('grows a marker with camera distance to preserve its screen size', () => {
    const nearScale = worldUnitsForPixels(10, 50, 800, 34)
    const farScale = worldUnitsForPixels(40, 50, 800, 34)

    expect(farScale).toBeCloseTo(nearScale * 4)
  })

  it('shrinks a marker when the viewport has more vertical pixels', () => {
    const smallViewportScale = worldUnitsForPixels(20, 50, 400, 34)
    const largeViewportScale = worldUnitsForPixels(20, 50, 800, 34)

    expect(largeViewportScale).toBeCloseTo(smallViewportScale / 2)
  })
})

describe('markerOffsetForScale', () => {
  it('moves the marker outward as its world-space size grows', () => {
    const nearOffset = markerOffsetForScale(0.5)
    const farOffset = markerOffsetForScale(2)

    expect(farOffset).toBeGreaterThan(nearOffset)
  })
})
