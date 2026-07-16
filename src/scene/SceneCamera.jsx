import {useThree} from '@react-three/fiber'
import {PerspectiveCamera} from '@react-three/drei'

export default function SceneCamera() {
  const viewport = useThree(state => state.viewport)
  return (
    <PerspectiveCamera
      makeDefault
      manual
      up={[0, 0, 1]}
      position={[0, 0, 30]}
      aspect={viewport.width / viewport.height}
    />
  )
}
