import {useMemo, useRef, useState} from 'react'
import seedrandom from 'seedrandom'
import useBeamController from './beams/useBeamController.js'
import DeveloperTools from './dev/DeveloperTools.jsx'
import {generateMaze} from './maze/generateMaze.js'
import {createWallCollisionIndex} from './maze/wallCollision.js'
import Experience from './scene/Experience.jsx'
import {
  MAZE_HEIGHT,
  MAZE_SEED,
  MAZE_WIDTH,
  WALL_THICKNESS,
} from './sceneConfig.js'

export default function App() {
  const [walls] = useState(() => (
    generateMaze(MAZE_WIDTH, MAZE_HEIGHT, seedrandom(MAZE_SEED))
  ))
  const collisionIndex = useMemo(() => (
    createWallCollisionIndex(
      walls,
      MAZE_WIDTH,
      MAZE_HEIGHT,
      WALL_THICKNESS,
    )
  ), [walls])
  const metricsRef = useRef({raycasts: 0, segments: 0, wallTests: 0})
  const statsRef = useRef()
  const {beams, clearBeams, removeBeam, spawnBeams} = useBeamController()

  return (
    <main className="app-shell">
      <Experience
        beams={beams}
        collisionIndex={collisionIndex}
        metricsRef={metricsRef}
        onRemove={removeBeam}
        statsRef={statsRef}
        walls={walls}
      />
      {import.meta.env.DEV && (
        <DeveloperTools
          onClear={clearBeams}
          onLaunch={spawnBeams}
          outputRef={statsRef}
        />
      )}
    </main>
  )
}
