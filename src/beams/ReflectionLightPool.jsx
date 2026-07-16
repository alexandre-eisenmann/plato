import {useMemo, useRef} from 'react'
import {useFrame} from '@react-three/fiber'
import {Vector3} from 'three'
import {
  REFLECTION_LIGHT_HEIGHT,
  REFLECTION_LIGHT_LIMIT,
  REFLECTION_LIGHT_OFFSET,
  REFLECTION_LIGHT_RANGE,
} from '../sceneConfig.js'

export default function ReflectionLightPool({registry}) {
  const lights = useRef([])
  const scratch = useMemo(() => ({
    incoming: new Vector3(),
    outgoing: new Vector3(),
  }), [])

  useFrame(() => {
    let lightIndex = 0

    for (const beam of registry.values()) {
      for (let index = 1; index < beam.points.length - 1; index += 1) {
        if (lightIndex >= REFLECTION_LIGHT_LIMIT) break
        const light = lights.current[lightIndex]
        const before = beam.points[index - 1]
        const reflection = beam.points[index]
        const after = beam.points[index + 1]

        scratch.incoming.copy(before).sub(reflection)
        scratch.outgoing.copy(after).sub(reflection)
        light.position.copy(reflection).add(
          scratch.incoming
            .add(scratch.outgoing)
            .normalize()
            .multiplyScalar(REFLECTION_LIGHT_OFFSET),
        )
        light.position.z = REFLECTION_LIGHT_HEIGHT
        light.visible = true
        lightIndex += 1
      }
    }

    for (; lightIndex < lights.current.length; lightIndex += 1) {
      lights.current[lightIndex].visible = false
    }
  }, -1)

  return Array.from({length: REFLECTION_LIGHT_LIMIT}, (_, index) => (
    <pointLight
      key={index}
      ref={light => { lights.current[index] = light }}
      visible={false}
      args={[0xffffff, 0.5, REFLECTION_LIGHT_RANGE]}
    />
  ))
}
