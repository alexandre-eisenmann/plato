export function createWallTransforms(walls, width, height) {
  return Object.entries(walls).flatMap(([key, wall]) => {
    if (wall.door) return []

    const [direction, firstIndex, secondIndex] = key.split(':')
    const i = Number.parseInt(firstIndex, 10)
    const j = Number.parseInt(secondIndex, 10)

    if (direction === 'v') {
      return [{
        key,
        position: [
          j + 1 - width / 2,
          i - height / 2 + 0.5,
          0.4,
        ],
        rotationZ: Math.PI / 2,
      }]
    }

    return [{
      key,
      position: [
        i - width / 2 + 0.5,
        j - height / 2 + 1,
        0.4,
      ],
      rotationZ: 0,
    }]
  })
}
