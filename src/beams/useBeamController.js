import {useCallback, useRef, useState} from 'react'
import useKeyPress from '../hooks/useKeyPress.js'
import {createBeam, replayBeam} from './createBeam.js'

export default function useBeamController(entry) {
  const [beams, setBeams] = useState({})
  const [activeDurations, setActiveDurations] = useState([])
  const [exitEvents, setExitEvents] = useState([])
  const [championBeam, setChampionBeam] = useState()
  const beamRegistry = useRef(new Map())

  const spawnBeams = useCallback((count, shiftKey = false) => {
    const additions = {}
    for (let index = 0; index < count; index += 1) {
      const beam = createBeam({entry, shiftKey})
      additions[beam.id] = beam
      beamRegistry.current.set(beam.id, beam)
    }
    setBeams(current => ({...current, ...additions}))
  }, [entry])

  const removeBeam = useCallback((id, exitEvent) => {
    const removedBeam = beamRegistry.current.get(id)
    beamRegistry.current.delete(id)
    setBeams(current => {
      if (!(id in current)) return current
      const next = {...current}
      delete next[id]
      return next
    })
    if (exitEvent?.exit) setExitEvents(current => [...current, exitEvent])
    if (exitEvent?.exit === 'B' && removedBeam) {
      setChampionBeam(current => current ?? removedBeam)
    }
  }, [])

  const launchChampion = useCallback(() => {
    if (!championBeam) return
    const beam = replayBeam(championBeam)
    beamRegistry.current.set(beam.id, beam)
    setBeams(current => ({...current, [beam.id]: beam}))
  }, [championBeam])

  const clearBeams = useCallback(() => {
    beamRegistry.current.clear()
    setBeams({})
    setActiveDurations([])
  }, [])
  const clearExitEvents = useCallback(() => {
    setExitEvents([])
    setChampionBeam(undefined)
  }, [])
  const launchFromKeyboard = useCallback(
    event => spawnBeams(1, event.shiftKey),
    [spawnBeams],
  )

  useKeyPress('Space', launchFromKeyboard)

  return {
    activeDurations,
    beams,
    championBeam,
    clearBeams,
    clearExitEvents,
    exitEvents,
    launchChampion,
    reportActiveDurations: setActiveDurations,
    removeBeam,
    spawnBeams,
  }
}
