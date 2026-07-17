import {describe, expect, it} from 'vitest'
import {calculateExitBPercentage} from './Dashboard.jsx'

describe('calculateExitBPercentage', () => {
  it('reports the percentage of completed beams that reached B', () => {
    const events = [
      {exit: 'A'},
      {exit: 'B'},
      {exit: 'B'},
    ]

    expect(calculateExitBPercentage(events)).toBe(67)
  })

  it('reports zero before any beams complete', () => {
    expect(calculateExitBPercentage([])).toBe(0)
  })
})
