import {useLayoutEffect, useMemo, useRef} from 'react'
import {DoubleSide, Object3D, StaticDrawUsage} from 'three'
import {MAZE_HEIGHT, MAZE_WIDTH, WALL_THICKNESS} from '../sceneConfig.js'
import {createWallTransforms} from './wallTransforms.js'

export default function MazeMesh({walls}) {
  const mesh = useRef()
  const instance = useMemo(() => new Object3D(), [])
  const transforms = useMemo(
    () => createWallTransforms(walls, MAZE_WIDTH, MAZE_HEIGHT),
    [walls],
  )

  useLayoutEffect(() => {
    transforms.forEach(({position, rotationZ}, index) => {
      instance.position.fromArray(position)
      instance.rotation.set(0, 0, rotationZ)
      instance.updateMatrix()
      mesh.current.setMatrixAt(index, instance.matrix)
    })
    mesh.current.instanceMatrix.setUsage(StaticDrawUsage)
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.computeBoundingBox()
    mesh.current.computeBoundingSphere()
  }, [instance, transforms])

  return (
    <instancedMesh
      ref={mesh}
      args={[null, null, transforms.length]}
      castShadow
      receiveShadow
      name="walls"
    >
      <boxGeometry args={[1 + WALL_THICKNESS, WALL_THICKNESS, 0.8]} />
      <meshPhongMaterial color={0x00ff00} side={DoubleSide} shininess={50} />
    </instancedMesh>
  )
}
