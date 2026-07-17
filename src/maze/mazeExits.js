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

function distanceSquared(a, b) {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2
}

export function createMazeExits(walls, width, height, entryPoint) {
  const doors = Object.entries(walls)
    .filter(([, wall]) => wall.door)
    .map(([key]) => ({key, ...doorGeometry(key, width, height)}))

  doors.sort((a, b) => (
    distanceSquared(a.center, entryPoint) - distanceSquared(b.center, entryPoint)
  ))

  return doors.map((door, index) => ({
    ...door,
    id: index === 0 ? 'A' : 'B',
  }))
}

export function classifyMazeExit(point, exits) {
  if (!point || exits.length === 0) return undefined
  return exits.reduce((nearest, exit) => (
    distanceSquared(point, exit.center) < distanceSquared(point, nearest.center)
      ? exit
      : nearest
  )).id
}
