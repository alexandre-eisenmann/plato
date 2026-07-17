import {useMemo} from 'react'
import {BeamColor} from '../sceneConfig.js'
import BeamBatch from './BeamBatch.jsx'
import BeamSimulation from './BeamSimulation.jsx'
import BeamProgressReporter from './BeamProgressReporter.jsx'
import ReflectionLightPool from './ReflectionLightPool.jsx'
import useBeamTextures from './useBeamTextures.js'

export default function BeamSystem({
  beams,
  bounds,
  collisionIndex,
  exits,
  metricsRef,
  onProgress,
  onRemove,
}) {
  const registry = useMemo(() => new Map(), [])
  const textures = useBeamTextures()

  return (
    <>
      <BeamBatch
        color={BeamColor.WHITE}
        registry={registry}
        texture={textures.white}
      />
      <BeamBatch
        color={BeamColor.YELLOW}
        registry={registry}
        texture={textures.yellow}
      />
      <ReflectionLightPool registry={registry} />
      <BeamProgressReporter onProgress={onProgress} registry={registry} />

      {Object.values(beams).map(beam => (
        <BeamSimulation
          key={beam.id}
          beam={beam}
          bounds={bounds}
          collisionIndex={collisionIndex}
          exits={exits}
          metricsRef={metricsRef}
          onRemove={onRemove}
          registry={registry}
        />
      ))}
    </>
  )
}
