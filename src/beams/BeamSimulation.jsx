import {useEffect, useMemo} from 'react'
import {useFrame} from '@react-three/fiber'
import {
  BEAM_CULL_MARGIN,
  BEAM_MAX_LIFETIME_SECONDS,
  BEAM_MAX_SIMULATION_STEP_SECONDS,
  BEAM_SPEED,
  MAZE_BOUNDS,
} from '../sceneConfig.js'
import {hasClearedBounds, isPointInsideBounds} from './beamBounds.js'
import {advanceBeamPath, beamPathLength, hasStableBeamLength} from './beamPath.js'

export default function BeamSimulation({
  beam,
  collisionIndex,
  metricsRef,
  onRemove,
  registry,
}) {
  const simulation = useMemo(() => ({
    age: 0,
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
    simulation.age += delta
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

    const expired = simulation.age >= BEAM_MAX_LIFETIME_SECONDS
    const leftMaze = simulation.hasReachedMaze && hasClearedBounds(
      points,
      MAZE_BOUNDS,
      BEAM_CULL_MARGIN,
    )

    if (!simulation.removalRequested && (expired || leftMaze)) {
      simulation.removalRequested = true
      onRemove(beam.id)
    }
  }, -2)

  return null
}
