import {useThree} from '@react-three/fiber'
import {PerspectiveCamera} from '@react-three/drei'
import {MAZE_HEIGHT, MAZE_WIDTH} from '../sceneConfig.js'

const CAMERA_FOV_DEGREES = 50
const CAMERA_FRAME_PADDING = 1.15

export function cameraDistanceForMaze(aspect) {
  const halfFovRadians = CAMERA_FOV_DEGREES * Math.PI / 360
  const halfHeight = MAZE_HEIGHT / 2 + 1.5
  const halfWidth = MAZE_WIDTH / 2 + 1.5
  const verticalDistance = halfHeight / Math.tan(halfFovRadians)
  const horizontalDistance = halfWidth / (Math.tan(halfFovRadians) * aspect)
  return Math.max(verticalDistance, horizontalDistance) * CAMERA_FRAME_PADDING
}

export default function SceneCamera() {
  const size = useThree(state => state.size)
  const aspect = size.width / size.height
  return (
    <PerspectiveCamera
      makeDefault
      manual
      up={[0, 0, 1]}
      position={[0, 0, cameraDistanceForMaze(aspect)]}
      aspect={aspect}
      fov={CAMERA_FOV_DEGREES}
    />
  )
}
