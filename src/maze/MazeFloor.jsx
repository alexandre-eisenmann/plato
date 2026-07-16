import {DoubleSide} from 'three'
import {MAZE_HEIGHT, MAZE_WIDTH} from '../sceneConfig.js'

export default function MazeFloor() {
  return (
    <mesh position={[0, 0, 0]} scale={[MAZE_WIDTH, MAZE_HEIGHT, 10]}>
      <planeGeometry />
      <meshPhongMaterial color="green" side={DoubleSide} />
    </mesh>
  )
}
