import {useLayoutEffect, useMemo, useRef} from 'react'
import {useFrame} from '@react-three/fiber'
import {
  AdditiveBlending,
  DoubleSide,
  DynamicDrawUsage,
  Object3D,
  Quaternion,
  Vector3,
} from 'three'
import {
  BEAM_MAX_INSTANCES_PER_COLOR,
  BEAM_PLANES,
} from '../sceneConfig.js'

export default function BeamBatch({color, registry, texture}) {
  const mesh = useRef()
  const scratch = useMemo(() => ({
    center: new Vector3(),
    direction: new Vector3(),
    directionQuaternion: new Quaternion(),
    instance: new Object3D(),
    rollQuaternion: new Quaternion(),
    xAxis: new Vector3(1, 0, 0),
  }), [])

  useLayoutEffect(() => {
    mesh.current.count = 0
    mesh.current.instanceMatrix.setUsage(DynamicDrawUsage)
  }, [])

  useFrame(() => {
    let instanceIndex = 0

    for (const beam of registry.values()) {
      if (beam.color !== color) continue

      for (let pointIndex = 1; pointIndex < beam.points.length; pointIndex += 1) {
        const from = beam.points[pointIndex - 1]
        const to = beam.points[pointIndex]
        const size = from.distanceTo(to)
        if (size === 0) continue

        scratch.direction.copy(to).sub(from).normalize()
        scratch.center.copy(from).add(to).multiplyScalar(0.5)
        scratch.directionQuaternion.setFromUnitVectors(scratch.xAxis, scratch.direction)

        for (let plane = 0; plane < BEAM_PLANES; plane += 1) {
          if (instanceIndex >= BEAM_MAX_INSTANCES_PER_COLOR) break
          scratch.rollQuaternion.setFromAxisAngle(
            scratch.xAxis,
            plane / BEAM_PLANES * Math.PI,
          )
          scratch.instance.position.copy(scratch.center)
          scratch.instance.quaternion
            .copy(scratch.directionQuaternion)
            .multiply(scratch.rollQuaternion)
          scratch.instance.scale.set(size * 5, 1, 1)
          scratch.instance.updateMatrix()
          mesh.current.setMatrixAt(instanceIndex, scratch.instance.matrix)
          instanceIndex += 1
        }
      }
    }

    mesh.current.count = instanceIndex
    mesh.current.instanceMatrix.needsUpdate = true
  }, -1)

  return (
    <instancedMesh
      ref={mesh}
      args={[null, null, BEAM_MAX_INSTANCES_PER_COLOR]}
      frustumCulled={false}
    >
      <planeGeometry args={[0.2, 0.1]} />
      <meshBasicMaterial
        blending={AdditiveBlending}
        color={0x4444aa}
        side={DoubleSide}
        depthTest
        depthWrite={false}
        map={texture}
        toneMapped={false}
        transparent
      />
    </instancedMesh>
  )
}
