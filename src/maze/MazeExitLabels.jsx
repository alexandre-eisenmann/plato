import {Text} from '@react-three/drei'

const LABEL_OFFSET = 1.1

export default function MazeExitLabels({exits}) {
  return exits.map(exit => (
    <Text
      key={exit.id}
      position={[
        exit.center.x + exit.normal.x * LABEL_OFFSET,
        exit.center.y + exit.normal.y * LABEL_OFFSET,
        0.08,
      ]}
      color="white"
      fontSize={0.72}
      anchorX="center"
      anchorY="middle"
      outlineColor="black"
      outlineWidth={0.012}
    >
      {exit.id}
    </Text>
  ))
}
