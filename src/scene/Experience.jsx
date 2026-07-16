import {Canvas} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'
import BeamSystem from '../beams/BeamSystem.jsx'
import RendererStats from '../dev/RendererStats.jsx'
import MazeFloor from '../maze/MazeFloor.jsx'
import MazeMesh from '../maze/MazeMesh.jsx'
import {
  AMBIENT_LIGHT_INTENSITY,
  DIRECTIONAL_LIGHT_INTENSITY,
} from '../sceneConfig.js'
import SceneCamera from './SceneCamera.jsx'

export default function Experience({
  beams,
  collisionIndex,
  metricsRef,
  onRemove,
  statsRef,
  walls,
}) {
  return (
    <Canvas>
      <color attach="background" args={['black']} />
      <SceneCamera />
      {import.meta.env.DEV && (
        <RendererStats
          activeBeams={Object.keys(beams).length}
          outputRef={statsRef}
          simulationMetricsRef={metricsRef}
        />
      )}

      <ambientLight args={[0xffffff, AMBIENT_LIGHT_INTENSITY]} />
      <directionalLight
        position={[5, 2, 10]}
        args={[0xffffff, DIRECTIONAL_LIGHT_INTENSITY]}
      />

      <MazeFloor />
      <MazeMesh walls={walls} />
      <BeamSystem
        beams={beams}
        collisionIndex={collisionIndex}
        metricsRef={metricsRef}
        onRemove={onRemove}
      />
      <OrbitControls />
    </Canvas>
  )
}
