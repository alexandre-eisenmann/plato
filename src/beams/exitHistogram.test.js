import {describe, expect, it} from 'vitest'
import {createExitHistogram} from './exitHistogram.js'

describe('exit histogram', () => {
  it('groups exit events by duration and exit', () => {
    const histogram = createExitHistogram([
      {duration: 3, exit: 'A'},
      {duration: 19.9, exit: 'B'},
      {duration: 63, exit: 'B'},
    ], [205])

    expect(histogram).toEqual([
      {label: '0–10', A: 1, B: 0, active: 0},
      {label: '10–20', A: 0, B: 1, active: 0},
      {label: '20–40', A: 0, B: 0, active: 0},
      {label: '40–80', A: 0, B: 1, active: 0},
      {label: '80–160', A: 0, B: 0, active: 0},
      {label: '160–320', A: 0, B: 0, active: 1},
    ])
  })
})
