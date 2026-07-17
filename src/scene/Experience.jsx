import {Canvas} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'
import BeamSystem from '../beams/BeamSystem.jsx'
import MazeFloor from '../maze/MazeFloor.jsx'
import MazeExitLabels from '../maze/MazeExitLabels.jsx'
import MazeMesh from '../maze/MazeMesh.jsx'
import {
  AMBIENT_LIGHT_INTENSITY,
  CAMERA_MAX_DISTANCE,
  CAMERA_MAX_POLAR_ANGLE,
  CAMERA_MIN_DISTANCE,
  DIRECTIONAL_LIGHT_INTENSITY,
} from '../sceneConfig.js'
import SceneCamera from './SceneCamera.jsx'
import SceneMetrics from '../ui/SceneMetrics.jsx'

export default function Experience({
  beams,
  bounds,
  collisionIndex,
  exits,
  height,
  metricsRef,
  onBeamProgress,
  onRemove,
  statsRef,
  walls,
  width,
}) {
  return (
    <Canvas className="scene-canvas">
      <color attach="background" args={['black']} />
      <SceneCamera height={height} width={width} />
      <SceneMetrics
        activeBeams={Object.keys(beams).length}
        outputRef={statsRef}
        simulationMetricsRef={metricsRef}
      />

      <ambientLight args={[0xffffff, AMBIENT_LIGHT_INTENSITY]} />
      <directionalLight
        position={[5, 2, 10]}
        args={[0xffffff, DIRECTIONAL_LIGHT_INTENSITY]}
      />

      <MazeFloor height={height} width={width} />
      <MazeMesh height={height} walls={walls} width={width} />
      <MazeExitLabels exits={exits} />
      <BeamSystem
        beams={beams}
        bounds={bounds}
        collisionIndex={collisionIndex}
        exits={exits}
        metricsRef={metricsRef}
        onProgress={onBeamProgress}
        onRemove={onRemove}
      />
      <OrbitControls
        maxDistance={Math.max(CAMERA_MAX_DISTANCE, Math.max(width, height) * 5)}
        maxPolarAngle={CAMERA_MAX_POLAR_ANGLE}
        minDistance={CAMERA_MIN_DISTANCE}
      />
    </Canvas>
  )
}
