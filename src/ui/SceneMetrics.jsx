import {useRef} from 'react'
import {useFrame} from '@react-three/fiber'

const SAMPLE_INTERVAL_SECONDS = 0.5

function formatInteger(value) {
  return new Intl.NumberFormat('en').format(value)
}

export default function SceneMetrics({activeBeams, outputRef, simulationMetricsRef}) {
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

    if (sample.current.elapsed < SAMPLE_INTERVAL_SECONDS || !outputRef.current) return

    const fps = sample.current.frames / sample.current.elapsed
    const frameTime = 1000 / fps
    const {memory, render} = gl.info

    outputRef.current.textContent = [
      `FRAME RATE       ${fps.toFixed(0).padStart(6)} FPS`,
      `FRAME TIME       ${frameTime.toFixed(1).padStart(6)} MS`,
      `PEAK LATENCY     ${sample.current.peakFrameTime.toFixed(1).padStart(6)} MS`,
      `ACTIVE BEAMS     ${formatInteger(activeBeams).padStart(6)}`,
      `PATH SEGMENTS    ${formatInteger(segments).padStart(6)}`,
      `RAYCAST / FRAME  ${(sample.current.raycasts / sample.current.frames).toFixed(1).padStart(6)}`,
      `WALL TEST / FR.  ${(sample.current.wallTests / sample.current.frames).toFixed(1).padStart(6)}`,
      `DRAW CALLS       ${formatInteger(render.calls).padStart(6)}`,
      `TRIANGLES        ${formatInteger(render.triangles).padStart(6)}`,
      `GPU RESOURCES    ${`${memory.geometries}G / ${memory.textures}T`.padStart(6)}`,
      `PIXEL RATIO      ${gl.getPixelRatio().toFixed(2).padStart(6)} X`,
    ].join('\n')

    outputRef.current.dataset.health = fps >= 55 ? 'good' : fps >= 40 ? 'fair' : 'poor'
    sample.current.elapsed = 0
    sample.current.frames = 0
    sample.current.peakFrameTime = 0
    sample.current.raycasts = 0
    sample.current.wallTests = 0
  })

  return null
}
