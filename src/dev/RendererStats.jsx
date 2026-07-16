import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const SAMPLE_INTERVAL_SECONDS = 0.5

function formatInteger(value) {
  return new Intl.NumberFormat('en').format(value)
}

export default function RendererStats({activeBeams, outputRef, simulationMetricsRef}) {
  const sample = useRef({
    elapsed: 0,
    frames: 0,
    peakFrameTime: 0,
    raycasts: 0,
    wallTests: 0,
  })

  useFrame(({gl}, delta) => {
    sample.current.elapsed += delta
    sample.current.frames += 1
    sample.current.peakFrameTime = Math.max(sample.current.peakFrameTime, delta * 1000)
    sample.current.raycasts += simulationMetricsRef.current.raycasts
    sample.current.wallTests += simulationMetricsRef.current.wallTests

    const segments = simulationMetricsRef.current.segments
    simulationMetricsRef.current.raycasts = 0
    simulationMetricsRef.current.segments = 0
    simulationMetricsRef.current.wallTests = 0

    if (
      sample.current.elapsed < SAMPLE_INTERVAL_SECONDS ||
      !outputRef.current
    ) {
      return
    }

    const fps = sample.current.frames / sample.current.elapsed
    const frameTime = 1000 / fps
    const {memory, render} = gl.info

    outputRef.current.textContent = [
      `${fps.toFixed(0)} FPS  ${frameTime.toFixed(1)} ms`,
      `${sample.current.peakFrameTime.toFixed(1)} ms peak`,
      `${activeBeams} active beam${activeBeams === 1 ? '' : 's'}`,
      `${formatInteger(segments)} beam segments`,
      `${(sample.current.raycasts / sample.current.frames).toFixed(1)} raycasts/frame`,
      `${(sample.current.wallTests / sample.current.frames).toFixed(1)} wall tests/frame`,
      `${formatInteger(render.calls)} draw calls`,
      `${formatInteger(render.triangles)} triangles`,
      `${formatInteger(memory.geometries)} geometries`,
      `${formatInteger(memory.textures)} textures`,
      `${gl.getPixelRatio().toFixed(2)}× DPR`,
    ].join('\n')

    outputRef.current.dataset.health = fps >= 55
      ? 'good'
      : fps >= 40
        ? 'fair'
        : 'poor'

    sample.current.elapsed = 0
    sample.current.frames = 0
    sample.current.peakFrameTime = 0
    sample.current.raycasts = 0
    sample.current.wallTests = 0
  })

  return null
}
