import {Text} from '@react-three/drei'

const LABEL_OFFSET = 1

export default function MazeExitLabels({exits}) {
  return exits.map(exit => (
    <group key={exit.id}>
      <mesh
        position={[
          exit.center.x + exit.normal.x * 0.35,
          exit.center.y + exit.normal.y * 0.35,
          0.08,
        ]}
        rotation={[0, 0, Math.atan2(exit.normal.y, exit.normal.x)]}
      >
        <planeGeometry args={[0.45, 0.025]} />
        <meshBasicMaterial color="white" toneMapped={false} />
      </mesh>
      <Text
        position={[
          exit.center.x + exit.normal.x * LABEL_OFFSET,
          exit.center.y + exit.normal.y * LABEL_OFFSET,
          0.08,
        ]}
        color="white"
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {exit.id}
      </Text>
    </group>
  ))
}
