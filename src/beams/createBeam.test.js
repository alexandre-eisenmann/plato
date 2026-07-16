import {describe, expect, it} from 'vitest'
import {BeamColor} from '../sceneConfig.js'
import {createBeam} from './createBeam.js'

describe('createBeam', () => {
  it('creates a deterministic white beam when dependencies are supplied', () => {
    const beam = createBeam({
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
      shiftKey: true,
      createId: () => 'beam-2',
    })

    expect(beam.color).toBe(BeamColor.YELLOW)
    expect(beam.id).toBe('beam-2')
  })
})
