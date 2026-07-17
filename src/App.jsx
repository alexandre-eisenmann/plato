import {useMemo, useRef, useState} from 'react'
import seedrandom from 'seedrandom'
import useBeamController from './beams/useBeamController.js'
import {BEAM_ENTRY_POINT} from './beams/createBeam.js'
import {generateMaze} from './maze/generateMaze.js'
import {createWallCollisionIndex} from './maze/wallCollision.js'
import {createMazeExits} from './maze/mazeExits.js'
import Experience from './scene/Experience.jsx'
import Dashboard from './ui/Dashboard.jsx'
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
  const exits = useMemo(
    () => createMazeExits(walls, MAZE_WIDTH, MAZE_HEIGHT, BEAM_ENTRY_POINT),
    [walls],
  )
  const metricsRef = useRef({raycasts: 0, segments: 0, wallTests: 0})
  const statsRef = useRef()
  const {
    activeDurations,
    beams,
    clearBeams,
    clearExitEvents,
    exitEvents,
    removeBeam,
    reportActiveDurations,
    spawnBeams,
  } = useBeamController()

  return (
    <main className="app-shell">
      <Experience
        beams={beams}
        collisionIndex={collisionIndex}
        exits={exits}
        metricsRef={metricsRef}
        onBeamProgress={reportActiveDurations}
        onRemove={removeBeam}
        statsRef={statsRef}
        walls={walls}
      />
      <Dashboard
        activeDurations={activeDurations}
        onClear={clearBeams}
        onLaunch={spawnBeams}
        onResetResults={clearExitEvents}
        outputRef={statsRef}
        exitEvents={exitEvents}
      />
    </main>
  )
}
