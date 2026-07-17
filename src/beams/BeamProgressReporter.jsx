import {useRef} from 'react'
import {useFrame} from '@react-three/fiber'

const REPORT_INTERVAL_SECONDS = 1

export default function BeamProgressReporter({onProgress, registry}) {
  const elapsed = useRef(0)
  const previousSignature = useRef('')

  useFrame((_, delta) => {
    elapsed.current += delta
    if (elapsed.current < REPORT_INTERVAL_SECONDS) return
    elapsed.current = 0

    const active = [...registry.entries()]
      .filter(([, beam]) => beam.hasReachedMaze)
      .map(([id, beam]) => ({id, duration: beam.duration}))
    const signature = active
      .map(beam => `${beam.id}:${Math.floor(beam.duration)}`)
      .join('|')

    if (signature !== previousSignature.current) {
      previousSignature.current = signature
      onProgress(active.map(beam => beam.duration))
    }
  })

  return null
}
