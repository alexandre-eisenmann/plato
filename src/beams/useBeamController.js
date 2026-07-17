import {useCallback, useState} from 'react'
import useKeyPress from '../hooks/useKeyPress.js'
import {createBeam} from './createBeam.js'

export default function useBeamController(entry) {
  const [beams, setBeams] = useState({})
  const [activeDurations, setActiveDurations] = useState([])
  const [exitEvents, setExitEvents] = useState([])

  const spawnBeams = useCallback((count, shiftKey = false) => {
    const additions = {}
    for (let index = 0; index < count; index += 1) {
      const beam = createBeam({entry, shiftKey})
      additions[beam.id] = beam
    }
    setBeams(current => ({...current, ...additions}))
  }, [entry])

  const removeBeam = useCallback((id, exitEvent) => {
    setBeams(current => {
      if (!(id in current)) return current
      const next = {...current}
      delete next[id]
      return next
    })
    if (exitEvent?.exit) setExitEvents(current => [...current, exitEvent])
  }, [])

  const clearBeams = useCallback(() => {
    setBeams({})
    setActiveDurations([])
  }, [])
  const clearExitEvents = useCallback(() => setExitEvents([]), [])
  const launchFromKeyboard = useCallback(
    event => spawnBeams(1, event.shiftKey),
    [spawnBeams],
  )

  useKeyPress('Space', launchFromKeyboard)

  return {
    activeDurations,
    beams,
    clearBeams,
    clearExitEvents,
    exitEvents,
    reportActiveDurations: setActiveDurations,
    removeBeam,
    spawnBeams,
  }
}
