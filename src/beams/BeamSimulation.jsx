import {useEffect, useMemo} from 'react'
import {useFrame} from '@react-three/fiber'
import {
  BEAM_CULL_MARGIN,
  BEAM_MAX_SIMULATION_STEP_SECONDS,
  BEAM_SPEED,
} from '../sceneConfig.js'
import {hasClearedBounds, isPointInsideBounds} from './beamBounds.js'
import {advanceBeamPath, beamPathLength, hasStableBeamLength} from './beamPath.js'
import {classifyMazeExit} from '../maze/mazeExits.js'

export default function BeamSimulation({
  beam,
  bounds,
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
    exit: undefined,
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
        // Entering the culling safety margin is not the same as entering the
        // maze. Keeping these boundaries separate preserves the visible
        // approach fan and starts transit timing at the actual outer wall.
        isPointInsideBounds(point, bounds)
      ))
    }
    if (simulation.hasReachedMaze) simulation.duration += step
    if (simulation.hasReachedMaze && !simulation.exit) {
      simulation.exit = classifyMazeExit(points, exits)
    }

    const leftMaze = simulation.hasReachedMaze && hasClearedBounds(
      points,
      bounds,
      BEAM_CULL_MARGIN,
    )

    if (!simulation.removalRequested && leftMaze) {
      simulation.removalRequested = true
      onRemove(beam.id, {
        duration: simulation.duration,
        exit: simulation.exit,
      })
    }
  }, -2)

  return null
}
