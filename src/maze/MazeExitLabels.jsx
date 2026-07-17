import {Billboard, Text} from '@react-three/drei'
import {useFrame, useThree} from '@react-three/fiber'
import {useRef} from 'react'
import {MathUtils, Vector3} from 'three'
import {WALL_THICKNESS} from '../sceneConfig.js'

const LABEL_HEIGHT = 0.35
const LABEL_SIZE_PIXELS = 22
const MARKER_RADIUS = 0.58
const MARKER_CENTER_CLEARANCE_PIXELS = 27
const MARKER_COLORS = Object.freeze({
  A: '#70ffa4',
  B: '#ffc866',
})
const markerWorldPosition = new Vector3()

export function worldUnitsForPixels(distance, fovDegrees, viewportHeight, pixels) {
  if (viewportHeight <= 0) return 1
  const visibleHeight = 2 * distance * Math.tan(MathUtils.degToRad(fovDegrees) / 2)
  return visibleHeight * pixels / viewportHeight
}

export function markerOffsetForScale(scale) {
  const worldUnitsPerPixel = scale / LABEL_SIZE_PIXELS
  return WALL_THICKNESS / 2 + MARKER_CENTER_CLEARANCE_PIXELS * worldUnitsPerPixel
}

function ExitMarker({exit}) {
  const markerRef = useRef()
  const {camera, size} = useThree()
  const color = MARKER_COLORS[exit.id] ?? 'white'

  useFrame(() => {
    const marker = markerRef.current
    if (!marker) return

    marker.getWorldPosition(markerWorldPosition)
    const distance = camera.position.distanceTo(markerWorldPosition)
    const scale = worldUnitsForPixels(distance, camera.fov, size.height, LABEL_SIZE_PIXELS)
    marker.scale.setScalar(scale)
    const offset = markerOffsetForScale(scale)
    marker.position.set(
      exit.center.x + exit.normal.x * offset,
      exit.center.y + exit.normal.y * offset,
      LABEL_HEIGHT,
    )
  })

  return (
    <Billboard
      ref={markerRef}
      position={[
        exit.center.x + exit.normal.x * markerOffsetForScale(1),
        exit.center.y + exit.normal.y * markerOffsetForScale(1),
        LABEL_HEIGHT,
      ]}
    >
      <mesh renderOrder={10}>
        <circleGeometry args={[0.52, 32]} />
        <meshBasicMaterial color="#07120c" depthTest={false} opacity={0.9} transparent />
      </mesh>
      <mesh renderOrder={11}>
        <ringGeometry args={[0.5, MARKER_RADIUS, 32]} />
        <meshBasicMaterial color={color} depthTest={false} transparent />
      </mesh>
      <Text
        position={[0, 0, 0.02]}
        color="white"
        fontSize={0.85}
        anchorX="center"
        anchorY="middle"
        outlineColor="black"
        outlineWidth={0.035}
        material-depthTest={false}
        renderOrder={12}
      >
        {exit.id}
      </Text>
    </Billboard>
  )
}

export default function MazeExitLabels({exits}) {
  return exits.map(exit => (
    <ExitMarker exit={exit} key={exit.id} />
  ))
}
