import {useEffect, useMemo} from 'react'
import {useFrame} from '@react-three/fiber'
import {
  BEAM_CULL_MARGIN,
  BEAM_MAX_SIMULATION_STEP_SECONDS,
  BEAM_SPEED,
  MAZE_BOUNDS,
} from '../sceneConfig.js'
import {hasClearedBounds, isPointInsideBounds} from './beamBounds.js'
import {advanceBeamPath, beamPathLength, hasStableBeamLength} from './beamPath.js'
import {classifyMazeExit} from '../maze/mazeExits.js'

export default function BeamSimulation({
  beam,
  collisionIndex,
  exits,
  metricsRef,
  onRemove,
  registry,
}) {
  const simulation = useMemo(() => ({
    duration: 0,
    color: beam.color,
    hasReachedMaze: false,
    length: beamPathLength([beam.source, beam.target]),
    points: [beam.source, beam.target],
    removalRequested: false,
  }), [beam])

  useEffect(() => {
    registry.set(beam.id, simulation)
    return () => registry.delete(beam.id)
  }, [beam.id, registry, simulation])

  useFrame((_, delta) => {
    const step = Math.min(delta, BEAM_MAX_SIMULATION_STEP_SECONDS)
    const points = advanceBeamPath(
      simulation.points,
      step * BEAM_SPEED,
      collisionIndex,
      metricsRef.current,
    )

    metricsRef.current.segments += Math.max(0, points.length - 1)
    if (hasStableBeamLength(points, simulation.length)) simulation.points = points

    if (!simulation.hasReachedMaze) {
      simulation.hasReachedMaze = points.some(point => (
        isPointInsideBounds(point, MAZE_BOUNDS, BEAM_CULL_MARGIN)
      ))
    }
    if (simulation.hasReachedMaze) simulation.duration += step

    const leftMaze = simulation.hasReachedMaze && hasClearedBounds(
      points,
      MAZE_BOUNDS,
      BEAM_CULL_MARGIN,
    )

    if (!simulation.removalRequested && leftMaze) {
      simulation.removalRequested = true
      onRemove(beam.id, {
        duration: simulation.duration,
        exit: classifyMazeExit(points.at(-1), exits),
      })
    }
  }, -2)

  return null
}
