import {useEffect, useMemo} from 'react'
import {CanvasTexture} from 'three'

function createBeamTexture(colorStops) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = 1
  canvas.height = 64
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)

  colorStops.forEach(([offset, color]) => gradient.addColorStop(offset, color))
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)
  return new CanvasTexture(canvas)
}

export default function useBeamTextures() {
  const textures = useMemo(() => ({
    white: createBeamTexture([
      [0, 'rgba(0,0,0,0.1)'],
      [0.1, 'rgba(160,160,160,0.3)'],
      [0.5, 'rgba(255,255,255,0.5)'],
      [0.9, 'rgba(160,160,160,0.3)'],
      [1, 'rgba(0,0,0,0.1)'],
    ]),
    yellow: createBeamTexture([
      [0, 'rgba(0,0,0,0.1)'],
      [0.1, 'rgba(255,215,0,0.3)'],
      [0.5, 'rgba(255,255,0,1)'],
      [0.9, 'rgba(255,215,0,0.3)'],
      [1, 'rgba(0,0,0,0.1)'],
    ]),
  }), [])

  useEffect(() => () => {
    Object.values(textures).forEach(texture => texture.dispose())
  }, [textures])

  return textures
}
