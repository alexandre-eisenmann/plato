import seedrandom from 'seedrandom';



const directions = [[1,0],[-1,0],[0,1],[0,-1]]

function mark_as_visited(cell, visited) {
    const [x,y]  = cell
    visited[`${x}-${y}`] = true
}

function pick_unvisited_neighbours(cell, w, h, visited, random) {
    const [x,y]  = cell
    for (const [i,j] of shuffle(directions, random)) {
        const [xx, yy] = [x+i,y+j]
        if (xx >= 0 && xx < w && yy>=0 && yy < h && !(`${xx}-${yy}` in visited)) {
            return [xx,yy]
        }
    }
}

function shuffle(xs, random) {
    // return xs
    return xs.slice().sort(function() {
        return 0.5 - random();
    });
} 

function remove_wall(a,b, walls) {
    const [ax, ay] = a
    const [bx, by] = b
    let key = null
    if (ax === bx) {
        if (ay < by) {
            key = `h:${ax}:${ay}`
        } else {
            key = `h:${ax}:${by}`
        }
    } else {
        if (ax < bx) {
            key = `v:${ay}:${ax}`
        } else {
            key = `v:${ay}:${bx}`
        }
    }
    delete walls[key]
}


function all_walls(width, height, random) {
    const walls = {}
    const boundaries = []
    const number_of_doors = 2
    for (var w = 0; w <= width; w++) {
        for (var h = 0; h <= height; h++) {
            if (w<width) {
                const key = `h:${w}:${h-1}`
                if (h===0 || h===height)
                    boundaries.push(key)
                walls[key] = {door: false}
            } 
            if (h<height) {
                const key = `v:${h}:${w-1}`
                if (w===0 || w===width)
                    boundaries.push(key)
                walls[key] = {door: false}
            }
        }
    }
    for (let i=0; i< number_of_doors; i++) {
        const enter = boundaries.splice(Math.floor(random()*boundaries.length), 1)
        walls[enter]["door"] = true
    }
    return walls
}

export function maze(w, h, random= new seedrandom('victor mathematician')) {
    const stack = []
    const visited = {}
    const walls = all_walls(w,h, random)
    const initial = [Math.floor(random()*w),Math.floor(random()*h)]
    mark_as_visited(initial, visited)
    stack.push(initial)

    while (stack.length > 0) {
        const [x,y] = stack.pop()
        const neighbour = pick_unvisited_neighbours([x,y],w,h,visited, random)
        if (neighbour) {
            stack.push([x,y])
            remove_wall([x,y],neighbour, walls)
            mark_as_visited(neighbour, visited)
            stack.push(neighbour)
        }
    }
    return walls
}

