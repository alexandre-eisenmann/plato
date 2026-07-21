import {Vector3} from 'three'
import {BeamColor} from '../sceneConfig.js'

export const DEFAULT_BEAM_ENTRY_POINT = Object.freeze({
  x: 10.237424798389586,
  y: 7.5,
})
const TARGET_OUTSIDE_OFFSET = 0.237424798389586
const RANDOM_SOURCE_OUTSIDE_OFFSET = 2.237424798389586
const RANDOM_TANGENT_SPREAD = 10
const RANDOM_BEAM_LENGTH = RANDOM_SOURCE_OUTSIDE_OFFSET - TARGET_OUTSIDE_OFFSET
const FIXED_SOURCE_OUTSIDE_OFFSET = 1.044027937746373
const FIXED_SOURCE_TANGENT_OFFSET = 1.613598317260891
const APPROACH_DISTANCE = 20

export function createBeam({
  entry,
  shiftKey = false,
  random = Math.random,
  createId = () => crypto.randomUUID(),
} = {}) {
  const normal = new Vector3(entry.normal.x, entry.normal.y, 0)
  const tangent = new Vector3(-entry.normal.y, entry.normal.x, 0)
  const center = new Vector3(entry.center.x, entry.center.y, 0.5)
  const target = center.clone().addScaledVector(normal, TARGET_OUTSIDE_OFFSET)
  const candidateSource = shiftKey
    ? center.clone()
      .addScaledVector(normal, FIXED_SOURCE_OUTSIDE_OFFSET)
      .addScaledVector(tangent, FIXED_SOURCE_TANGENT_OFFSET)
    : center.clone()
      .addScaledVector(normal, RANDOM_SOURCE_OUTSIDE_OFFSET)
      .addScaledVector(tangent, (random() - 0.5) * RANDOM_TANGENT_SPREAD)
  const source = shiftKey
    ? candidateSource
    : target.clone().addScaledVector(
      target.clone().sub(candidateSource).normalize(),
      -RANDOM_BEAM_LENGTH,
    )
  const approach = target.clone().sub(source).normalize().multiplyScalar(-APPROACH_DISTANCE)

  return {
    id: createId(),
    color: shiftKey ? BeamColor.YELLOW : BeamColor.WHITE,
    source: source.add(approach),
    target: target.add(approach),
  }
}

export function replayBeam(beam, createId = () => crypto.randomUUID()) {
  return {
    id: createId(),
    color: beam.color,
    source: beam.source.clone(),
    target: beam.target.clone(),
  }
}
