import seedrandom from 'seedrandom'

const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]]
const DOOR_COUNT = 2

function cellKey([x, y]) {
  return `${x}-${y}`
}

function markVisited(cell, visited) {
  visited[cellKey(cell)] = true
}

function shuffle(values, random) {
  // Preserve the original seeded ordering so existing maze seeds stay stable.
  return values.slice().sort(() => 0.5 - random())
}

function pickUnvisitedNeighbour([x, y], width, height, visited, random) {
  for (const [dx, dy] of shuffle(DIRECTIONS, random)) {
    const neighbour = [x + dx, y + dy]
    const [nextX, nextY] = neighbour
    const insideMaze = (
      nextX >= 0 && nextX < width && nextY >= 0 && nextY < height
    )
    if (insideMaze && !(cellKey(neighbour) in visited)) return neighbour
  }
  return undefined
}

function removeWallBetween([ax, ay], [bx, by], walls) {
  const key = ax === bx
    ? `h:${ax}:${Math.min(ay, by)}`
    : `v:${ay}:${Math.min(ax, bx)}`
  delete walls[key]
}

function createAllWalls(width, height, random) {
  const walls = {}
  const boundaries = []

  for (let x = 0; x <= width; x += 1) {
    for (let y = 0; y <= height; y += 1) {
      if (x < width) {
        const key = `h:${x}:${y - 1}`
        if (y === 0 || y === height) boundaries.push(key)
        walls[key] = {door: false}
      }
      if (y < height) {
        const key = `v:${y}:${x - 1}`
        if (x === 0 || x === width) boundaries.push(key)
        walls[key] = {door: false}
      }
    }
  }

  for (let index = 0; index < DOOR_COUNT; index += 1) {
    const boundaryIndex = Math.floor(random() * boundaries.length)
    const [doorKey] = boundaries.splice(boundaryIndex, 1)
    walls[doorKey].door = true
  }
  return walls
}

export function generateMaze(
  width,
  height,
  random = seedrandom('victor mathematician'),
) {
  const walls = createAllWalls(width, height, random)
  const visited = {}
  const initial = [
    Math.floor(random() * width),
    Math.floor(random() * height),
  ]
  const stack = [initial]
  markVisited(initial, visited)

  while (stack.length > 0) {
    const cell = stack.pop()
    const neighbour = pickUnvisitedNeighbour(
      cell,
      width,
      height,
      visited,
      random,
    )
    if (!neighbour) continue

    stack.push(cell)
    removeWallBetween(cell, neighbour, walls)
    markVisited(neighbour, visited)
    stack.push(neighbour)
  }

  return walls
}
