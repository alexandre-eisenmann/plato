export const MAZE_WIDTH = 20
export const MAZE_HEIGHT = 20
export const MAZE_SEED = 'victor mathematician loco9'
export const WALL_THICKNESS = 0.5

export const MAZE_BOUNDS = Object.freeze({
  minX: -MAZE_WIDTH / 2,
  maxX: MAZE_WIDTH / 2,
  minY: -MAZE_HEIGHT / 2,
  maxY: MAZE_HEIGHT / 2,
})

export const BEAM_SPEED = 20
export const BEAM_CULL_MARGIN = 1.5
export const BEAM_PLANES = 15
export const BEAM_MAX_INSTANCES_PER_COLOR = 30000
export const BEAM_MAX_LIFETIME_SECONDS = 20
export const BEAM_MAX_SIMULATION_STEP_SECONDS = 1 / 30

export const REFLECTION_LIGHT_LIMIT = 32
export const REFLECTION_LIGHT_OFFSET = 0.2
export const REFLECTION_LIGHT_HEIGHT = 0.35
export const REFLECTION_LIGHT_RANGE = WALL_THICKNESS + REFLECTION_LIGHT_OFFSET - 0.05

export const AMBIENT_LIGHT_INTENSITY = 0.35
export const DIRECTIONAL_LIGHT_INTENSITY = 0.6

export const BeamColor = Object.freeze({
  WHITE: 'white',
  YELLOW: 'yellow',
})
