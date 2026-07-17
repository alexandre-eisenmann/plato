import {describe, expect, it} from 'vitest'
import {BeamColor} from '../sceneConfig.js'
import {createBeam} from './createBeam.js'

describe('createBeam', () => {
  const entry = {
    center: {x: 10, y: 7.5},
    normal: {x: 1, y: 0},
  }

  it('creates a deterministic white beam when dependencies are supplied', () => {
    const beam = createBeam({
      entry,
      random: () => 0.5,
      createId: () => 'beam-1',
    })

    expect(beam.id).toBe('beam-1')
    expect(beam.color).toBe(BeamColor.WHITE)
    expect(beam.source.y).toBeCloseTo(7.5)
    expect(beam.target.y).toBeCloseTo(7.5)
  })

  it('uses the fixed yellow trajectory for shifted launches', () => {
    const beam = createBeam({
      entry,
      shiftKey: true,
      createId: () => 'beam-2',
    })

    expect(beam.color).toBe(BeamColor.YELLOW)
    expect(beam.id).toBe('beam-2')
  })

  it('rotates its launch geometry with the entry wall', () => {
    const beam = createBeam({
      entry: {center: {x: 2.5, y: -5}, normal: {x: 0, y: -1}},
      random: () => 0.5,
      createId: () => 'beam-bottom',
    })

    expect(beam.source.x).toBeCloseTo(2.5)
    expect(beam.target.x).toBeCloseTo(2.5)
    expect(beam.source.y).toBeLessThan(beam.target.y)
  })
})
