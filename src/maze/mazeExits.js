function doorGeometry(key, width, height) {
  const [direction, firstIndex, secondIndex] = key.split(':')
  const i = Number.parseInt(firstIndex, 10)
  const j = Number.parseInt(secondIndex, 10)

  if (direction === 'v') {
    const x = j + 1 - width / 2
    return {
      center: {x, y: i - height / 2 + 0.5},
      normal: {x: x < 0 ? -1 : 1, y: 0},
    }
  }

  const y = j + 1 - height / 2
  return {
    center: {x: i - width / 2 + 0.5, y},
    normal: {x: 0, y: y < 0 ? -1 : 1},
  }
}

const DOOR_HALF_WIDTH = 0.5
const CROSSING_TOLERANCE = 1e-9

function distanceSquared(a, b) {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2
}

export function createMazeExits(walls, width, height, entryPoint) {
  const doors = Object.entries(walls)
    .filter(([, wall]) => wall.door)
    .map(([key]) => ({key, ...doorGeometry(key, width, height)}))

  if (entryPoint) {
    doors.sort((a, b) => (
      distanceSquared(a.center, entryPoint) - distanceSquared(b.center, entryPoint)
    ))
  }

  return doors.map((door, index) => ({
    ...door,
    id: index === 0 ? 'A' : 'B',
  }))
}

function signedDistanceFromDoor(point, exit) {
  return (
    (point.x - exit.center.x) * exit.normal.x +
    (point.y - exit.center.y) * exit.normal.y
  )
}

function crossesDoorOutward(start, end, exit) {
  const startDistance = signedDistanceFromDoor(start, exit)
  const endDistance = signedDistanceFromDoor(end, exit)
  const travelDistance = endDistance - startDistance

  if (
    startDistance > CROSSING_TOLERANCE ||
    endDistance < -CROSSING_TOLERANCE ||
    travelDistance <= CROSSING_TOLERANCE
  ) return false

  const crossingProgress = -startDistance / travelDistance
  if (crossingProgress < 0 || crossingProgress > 1) return false

  const crossing = {
    x: start.x + (end.x - start.x) * crossingProgress,
    y: start.y + (end.y - start.y) * crossingProgress,
  }
  const tangent = {x: -exit.normal.y, y: exit.normal.x}
  const offset = (
    (crossing.x - exit.center.x) * tangent.x +
    (crossing.y - exit.center.y) * tangent.y
  )

  return Math.abs(offset) <= DOOR_HALF_WIDTH + CROSSING_TOLERANCE
}

export function classifyMazeExit(points, exits) {
  if (!points || points.length < 2 || exits.length === 0) return undefined

  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1]
    const end = points[index]
    const exit = exits.find(candidate => crossesDoorOutward(start, end, candidate))
    if (exit) return exit.id
  }

  return undefined
}
