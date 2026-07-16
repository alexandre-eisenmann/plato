import {useCallback, useState} from 'react'
import useKeyPress from '../hooks/useKeyPress.js'
import {createBeam} from './createBeam.js'

export default function useBeamController() {
  const [beams, setBeams] = useState({})

  const spawnBeams = useCallback((count, shiftKey = false) => {
    const additions = {}
    for (let index = 0; index < count; index += 1) {
      const beam = createBeam({shiftKey})
      additions[beam.id] = beam
    }
    setBeams(current => ({...current, ...additions}))
  }, [])

  const removeBeam = useCallback((id) => {
    setBeams(current => {
      if (!(id in current)) return current
      const next = {...current}
      delete next[id]
      return next
    })
  }, [])

  const clearBeams = useCallback(() => setBeams({}), [])
  const launchFromKeyboard = useCallback(
    event => spawnBeams(1, event.shiftKey),
    [spawnBeams],
  )

  useKeyPress('Space', launchFromKeyboard)

  return {
    beams,
    clearBeams,
    removeBeam,
    spawnBeams,
  }
}
