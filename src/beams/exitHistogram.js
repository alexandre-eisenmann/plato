const MINIMUM_BOUNDARIES = [0, 10, 20, 40, 80]

function createBoundaries(maximumDuration) {
  const boundaries = [...MINIMUM_BOUNDARIES]
  while (boundaries.at(-1) <= maximumDuration) {
    boundaries.push(boundaries.at(-1) * 2)
  }
  return boundaries
}

export function createExitHistogram(events, activeDurations = []) {
  const maximumDuration = Math.max(
    0,
    ...events.map(event => event.duration),
    ...activeDurations,
  )
  const boundaries = createBoundaries(maximumDuration)

  return boundaries.slice(1).map((maximum, index) => {
    const minimum = boundaries[index]
    const inRange = events.filter(event => (
      event.duration >= minimum && event.duration < maximum
    ))

    return {
      label: `${minimum}–${maximum}`,
      A: inRange.filter(event => event.exit === 'A').length,
      B: inRange.filter(event => event.exit === 'B').length,
      active: activeDurations.filter(duration => (
        duration >= minimum && duration < maximum
      )).length,
    }
  })
}
