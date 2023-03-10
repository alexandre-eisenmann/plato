import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useKeyboardControls } from '@react-three/drei'
import { AdditiveBlending, DoubleSide, Vector3, Quaternion, Raycaster, Plane } from "three";
import useKeypress from "./useKeypress.js"
import { v4 as uuidv4 } from 'uuid';




import { maze } from "./MazeGenerator"
import seedrandom from 'seedrandom';


function Camera(props) {
  const viewport = useThree((state) => state.viewport)
  return <PerspectiveCamera makeDefault manual up = {[0,0,1]}  position={[0, 0, 30]} aspect={viewport.width/viewport.height} />
}


function generateLaserBodyCanvas(color = 'white') {
  var canvas = document.createElement(`canvas`);
  var context = canvas.getContext('2d');
  canvas.width = 1;
  canvas.height = 64;
  // set gradient
  var gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  if (color === "white") {
    gradient.addColorStop(0, 'rgba(  0,  0,  0,0.1)');
    gradient.addColorStop(0.1, 'rgba(160,160,160,0.3)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(0.9, 'rgba(160,160,160,0.3)');
    gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');
  } else if (color === "yellow") {
    gradient.addColorStop(0, 'rgba(  0,  0,  0,0.1)');
    gradient.addColorStop(0.1, 'rgba(255,215,0,0.3)');
    gradient.addColorStop(0.5, 'rgba(255,255,0,1)');
    gradient.addColorStop(0.9, 'rgba(255,215,0,0.3)');
    gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');
  }


  // fill the rectangle
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  // return the just built canvas 
  return canvas;
}

function Wall(props) {
  const mesh = useRef()
  // useHelper(mesh, VertexNormalsHelper, 0.1,'cyan')
  
  const {x, y, height = 0.8, tickness = 0.5, length = 1,boundary, horizontal} = props
  const color = 0x00ff00
  // const color = "green"

  let element = null
  if (horizontal) {
    element = <mesh ref={mesh} receiveShadow={true} castShadow={true} name="wall" position={[x ,y -  1/2 ,height/2]} >
      <boxGeometry  args={[length + tickness , tickness, height]} /> 
      <meshPhongMaterial color={color} side={DoubleSide} shininess={50}/>
    </mesh>
  } else {
    element = <mesh ref={mesh} receiveShadow={true} castShadow={true} name="wall" position={[x - length/2, y + length/2 -1/2,height/2]} rotation={[0, 0, Math.PI / 2]} >
    <boxGeometry  args={[length + tickness, tickness, height]} /> 
    <meshPhongMaterial color={color} side={DoubleSide} shininess={50}/>
  </mesh>

  }

  return ( 
      element
  )

}

function calculate_normal(intersection) {
  const geometry = intersection.object.geometry
  const positions = geometry.getAttribute('position');
  const face = intersection.face
  const va = new Vector3(positions.getX(face.a),positions.getY(face.a),positions.getZ(face.a)).applyMatrix4(intersection.object.matrixWorld)
  const vb = new Vector3(positions.getX(face.b),positions.getY(face.b),positions.getZ(face.b)).applyMatrix4(intersection.object.matrixWorld)
  const vc = new Vector3(positions.getX(face.c),positions.getY(face.c),positions.getZ(face.c)).applyMatrix4(intersection.object.matrixWorld)
  const center = intersection.object.position
  const plane = new Plane().setFromCoplanarPoints(va, vb, vc)
  const distance = plane.distanceToPoint(center);
  const projectedPoint = center.clone().sub(plane.normal.clone().multiplyScalar(distance));
  return projectedPoint.clone().sub(center).normalize()
}


function move(pointArray, ds, walls) {
  if (ds===0 || pointArray.length < 2) return pointArray
  let [source, target] = pointArray.splice(pointArray.length - 2, 2)
  let dv = target.clone().sub(source).normalize().multiplyScalar(ds)
  target = target.clone().add(dv)

  const reflection = reflect(source, target, walls)
  pointArray = pointArray.concat(reflection)

  let amountShortened = 0
  while (amountShortened < ds) {
    [source, target] = pointArray.slice(0,2)
    pointArray.shift()
    amountShortened += source.distanceTo(target)
  }

  dv = target.clone().sub(source).normalize().multiplyScalar(ds - amountShortened)
  pointArray.unshift(target.clone().add(dv))

  return pointArray
}

function len(pointArray) {
  let distance = 0
  pointArray.slice(1).map((ele, i) => {
    distance += ele.distanceTo(pointArray[i])
  })
  return distance
}


function reflect(source, target, walls) {
  const pointArray = []
  const threshold = 0.00001
  let direction = target.clone().sub(source).normalize()

  
  let distance = source.distanceTo(target)

  let raycaster = new Raycaster(source, direction, threshold, distance - threshold);
  let intersections = raycaster.intersectObjects(walls);
  pointArray.push(source)
  while (intersections.length > 0) {
    let closestIntersection = intersections[0];
    const vector = target.clone().sub(source).normalize()
    let normal = calculate_normal(closestIntersection)
    const projection = vector.dot(normal);
    const reflectedVector = vector.clone().sub(normal.clone().multiplyScalar(2 * projection));    

    const distanceToContact = source.distanceTo(closestIntersection.point)
    distance -= distanceToContact
    source = closestIntersection.point.clone()
    target = source.clone().add(reflectedVector.clone().normalize().multiplyScalar(distance))
    direction = target.clone().sub(source).normalize()
    raycaster = new Raycaster(source, direction, threshold,distance - threshold);
    intersections = raycaster.intersectObjects(walls);

    pointArray.push(source)

  }
  pointArray.push(target)
  
  return pointArray
  
}



function Laser({id, from, to ,canvas, notify}) {
  const [points, setPoints] = useState([from,to])
  let length = len([from, to])
  useFrame((state, delta) => {
    const {scene} = state
    const {children} = scene
    const speed = delta*20
    const walls = children.filter(mesh => mesh.name === "wall");
    const pointArray = move(points,speed ,walls)
    const difference = len(pointArray) - length
    if ( Math.abs(difference) < 0.0000001 )
      setPoints(pointArray)
      if (pointArray.length > 0 && (pointArray[0].x > 30 || pointArray[0].y > 30)) {
        notify({type: "remove", id: id})
      }
  }) 

  
  return (
      <group>
       {points && points.slice(1).map((ele,i) => {
           const f = points[i]
           const t = ele
           return <LaserFragment key={i} from={f} to={t} canvas={canvas}/> 
       })}

      {points && points.slice(1,-1).map((ele,i) => {
           const a = points[i]
           const b = ele
           const c = points[i+1]
           const position = b.clone().add(a.clone().sub(b).add(c.clone().sub(b)).normalize().multiplyScalar(0.2))
           return <pointLight key={i} castShadow={true} position={position} args={[0xffffff , 0.5, 4]} /> 
       })}
      </group>
      
  )
}

function LaserFragment({from, to, planes=15,canvas = generateLaserBodyCanvas(),...props}) {


    const mesh = useRef()
    const textureRef = useRef()
    const size = to.distanceTo(from)
    const center = from.clone().add(to.clone().sub(from).divideScalar(2))
    
    const quaternion = new Quaternion().setFromUnitVectors( new Vector3(1,0,0).normalize(), to.clone().sub(from).normalize()  ); 

  

    useEffect(() => {

        textureRef.current.needsUpdate = true;
    })

    return (
      <mesh ref={mesh} {...props}>
        <mesh  position={center}  quaternion={quaternion} scale={[size*5,1,1]}>
          {[...Array(planes).keys()].map(i => {
            return <mesh key={i}  rotation={[i/planes * Math.PI,0,0]}>
              
              <planeGeometry args={[0.2,0.1]}  />
              <meshBasicMaterial  blending={AdditiveBlending} color={0x4444aa} side={DoubleSide} depthWrite={false} transparent={true} >
                  <pointLight args={[0xffffff, 1, 4]} />
                  <canvasTexture 
                    ref={textureRef}
                    attach="map"
                    image={canvas}
                  >        
                  </canvasTexture>
              </meshBasicMaterial>
              </mesh>
          })}
        </mesh>
      </mesh>
    )

}


const width = 20
const height = 20
export default function App() {
  
  const [walls, setWalls] = useState(maze(width,height, new seedrandom('victor mathematician loco9')))

  

  const [doors, setDoors] = useState([])

  const [lasers, setLasers] = useState({})


  const keyPressed = useKeypress('Space');



  useEffect(() => {
    const {shiftKey, code} = keyPressed
    if (code === 'Space') {
        console.log("shift",shiftKey)
        let color = "red"

        let source = new Vector3(10.237424798389586 + 2,7.5,0.5)

        if (!shiftKey) {
          source = source.add(new Vector3(0,(Math.random()-0.5)*10, 0 ))
          color = "white"
        } else {
          source = new Vector3(11.044027937746373, 9.113598317260891,0.5)
        }
  
        let target = new Vector3(10.237424798389586,7.5,0.5)
        
        const direction = target.clone().sub(source).normalize().multiplyScalar(-20)
        source = source.clone().add(direction)
        target = target.clone().add(direction)



        const _lasers = {...lasers}
        _lasers[uuidv4()] = {source, target, color}
        setLasers(_lasers)

    }

  }, [keyPressed])

  useEffect(() => {
    const holes = []
    Object.keys(walls).map((wall,k) => {

      let [direction,i,j] = wall.split(":")        
      i = parseInt(i)
      j = parseInt(j)

      if (walls[wall].door) {
        if (direction === "v") {
          const y = i - height/2 + 0.5
          const x = j + 1.0 - width/2 + 0.5 
          const ref = new Vector3(x,y,0.4).add(new Vector3(-0.25, 0, 0))
          holes.push(ref)
        } else {
          const x = i - width/2 + 0.5
          const y = j - height/2 + 1.5 - 0.75
        }
      }
    })

    setDoors(holes)


  }, [ walls])

    
  const laserCanvas = generateLaserBodyCanvas()
  const yellowLaserCanvas = generateLaserBodyCanvas('yellow')


  const notify = ({type, id}) => {
    
    if (type === "remove") {
      const _lasers = {...lasers}
      delete _lasers[id]
      setLasers(_lasers)
  
      console.log(`laser ${id} lost `)
  
    }
    
  }

  return (

    <Canvas  >
      <color attach="background" args={['black']} />
      <Camera />
      <ambientLight args={[0xffffff, 0.1]}   />
      <directionalLight position={[5,2,10]} args={[0xffffff, 0.2]} /> 
      {/* <axesHelper args ={[50]} /> */}

       <mesh position={[0, 0, 0]} scale={[width, height, 10]}  > 
        <planeGeometry />
        <meshPhongMaterial color="green" side={DoubleSide} />
      </mesh>

      {Object.keys(lasers).map(id => {
        const {source, target, color} = lasers[id]

        if (color === 'white') {
          return <Laser key={id} id={id} from={source} to={target} canvas={laserCanvas} notify={notify}/>
        } else {
          return <Laser key={id} id={id} from={source} to={target} canvas={yellowLaserCanvas} notify={notify}/>
        }
        
      })}



      {Object.keys(walls).map((wall,k) => {
        let [direction,i,j] = wall.split(":")        
        i = parseInt(i)
        j = parseInt(j)

        if (!walls[wall].door) {
  
          
          if (direction === "v") {
            const boundary = j === -1 || j === width -1
            const y = i - height/2 + 0.5
            const x = j + 1.0 - width/2 + 0.5
            return <Wall key={`v-${k}`} x={x} y={y} boundary={boundary} vertical   /> 
          } else {
            const boundary = j === -1 || j === height -1
            const x = i - width/2 + 0.5
            const y = j - height/2 + 1.5
            return <Wall key={`h-${k}`} x={x} y={y} boundary={boundary} horizontal  />
          }
        }

      })}


      {/* {doors.map((door,i) => {
          return <mesh  position={door}  key={`d-${i}`}>
            <boxGeometry args={[0.1,0.1,0.1]} /> 
            <meshPhongMaterial attach="material" color="yellow" />
          </mesh> 

      })} */}

  
      <OrbitControls />
    </Canvas>
  )
}
