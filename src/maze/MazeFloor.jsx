import {DoubleSide} from 'three'

export default function MazeFloor({height, width}) {
  return (
    <mesh position={[0, 0, 0]} scale={[width, height, 10]}>
      <planeGeometry />
      <meshPhongMaterial color="green" side={DoubleSide} />
    </mesh>
  )
}
