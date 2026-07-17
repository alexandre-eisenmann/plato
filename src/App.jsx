import {useCallback, useMemo, useRef, useState} from 'react'
import useBeamController from './beams/useBeamController.js'
import {DEFAULT_BEAM_ENTRY_POINT} from './beams/createBeam.js'
import {
  createMazeExperiment,
  createRandomMazeSeed,
} from './maze/createMazeExperiment.js'
import {createWallCollisionIndex} from './maze/wallCollision.js'
import Experience from './scene/Experience.jsx'
import Dashboard from './ui/Dashboard.jsx'
import {
  MAZE_SEED,
  MAZE_WIDTH,
  WALL_THICKNESS,
} from './sceneConfig.js'

export default function App() {
  const [experiment, setExperiment] = useState(() => createMazeExperiment({
    size: MAZE_WIDTH,
    seed: MAZE_SEED,
    preferredEntryPoint: DEFAULT_BEAM_ENTRY_POINT,
  }))
  const collisionIndex = useMemo(() => (
    createWallCollisionIndex(
      experiment.walls,
      experiment.width,
      experiment.height,
      WALL_THICKNESS,
    )
  ), [experiment])
  const metricsRef = useRef({raycasts: 0, segments: 0, wallTests: 0})
  const statsRef = useRef()
  const {
    activeDurations,
    beams,
    championBeam,
    clearBeams,
    clearExitEvents,
    exitEvents,
    launchChampion,
    removeBeam,
    reportActiveDurations,
    spawnBeams,
  } = useBeamController(experiment.exits[0])
  const generateNewMaze = useCallback(size => {
    clearBeams()
    clearExitEvents()
    metricsRef.current = {raycasts: 0, segments: 0, wallTests: 0}
    setExperiment(createMazeExperiment({
      size,
      seed: createRandomMazeSeed(),
    }))
  }, [clearBeams, clearExitEvents])

  return (
    <main className="app-shell">
      <Experience
        beams={beams}
        bounds={experiment.bounds}
        collisionIndex={collisionIndex}
        exits={experiment.exits}
        height={experiment.height}
        metricsRef={metricsRef}
        onBeamProgress={reportActiveDurations}
        onRemove={removeBeam}
        statsRef={statsRef}
        walls={experiment.walls}
        width={experiment.width}
      />
      <Dashboard
        activeDurations={activeDurations}
        onClear={clearBeams}
        onLaunch={spawnBeams}
        onLaunchChampion={launchChampion}
        onGenerateMaze={generateNewMaze}
        onResetResults={clearExitEvents}
        outputRef={statsRef}
        exitEvents={exitEvents}
        mazeSeed={experiment.seed}
        mazeSize={experiment.width}
        hasChampion={Boolean(championBeam)}
      />
    </main>
  )
}
