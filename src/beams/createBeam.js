import {Vector3} from 'three'
import {BeamColor} from '../sceneConfig.js'

const ENTRY_TARGET = new Vector3(10.237424798389586, 7.5, 0.5)
const RANDOM_ENTRY_SOURCE = new Vector3(12.237424798389586, 7.5, 0.5)
const FIXED_ENTRY_SOURCE = new Vector3(11.044027937746373, 9.113598317260891, 0.5)
const APPROACH_DISTANCE = 20

export function createBeam({
  shiftKey = false,
  random = Math.random,
  createId = () => crypto.randomUUID(),
} = {}) {
  const source = shiftKey
    ? FIXED_ENTRY_SOURCE.clone()
    : RANDOM_ENTRY_SOURCE.clone().add(
      new Vector3(0, (random() - 0.5) * 10, 0),
    )
  const target = ENTRY_TARGET.clone()
  const approach = target.clone().sub(source).normalize().multiplyScalar(-APPROACH_DISTANCE)

  return {
    id: createId(),
    color: shiftKey ? BeamColor.YELLOW : BeamColor.WHITE,
    source: source.add(approach),
    target: target.add(approach),
  }
}
