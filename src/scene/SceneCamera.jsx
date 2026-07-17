import {useThree} from '@react-three/fiber'
import {PerspectiveCamera} from '@react-three/drei'

const CAMERA_FOV_DEGREES = 50
// Leave enough screen-space around the maze for the adaptive exit badges.
const CAMERA_FRAME_PADDING = 1.28

export function cameraDistanceForMaze(aspect, width, height) {
  const halfFovRadians = CAMERA_FOV_DEGREES * Math.PI / 360
  const halfHeight = height / 2 + 1.5
  const halfWidth = width / 2 + 1.5
  const verticalDistance = halfHeight / Math.tan(halfFovRadians)
  const horizontalDistance = halfWidth / (Math.tan(halfFovRadians) * aspect)
  return Math.max(verticalDistance, horizontalDistance) * CAMERA_FRAME_PADDING
}

export default function SceneCamera({height, width}) {
  const size = useThree(state => state.size)
  const aspect = size.width / size.height
  return (
    <PerspectiveCamera
      makeDefault
      manual
      up={[0, 0, 1]}
      position={[0, 0, cameraDistanceForMaze(aspect, width, height)]}
      aspect={aspect}
      fov={CAMERA_FOV_DEGREES}
    />
  )
}
