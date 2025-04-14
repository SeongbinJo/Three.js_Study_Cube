import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useState, useEffect, useRef } from "react"
import { Physics } from "@react-three/rapier"
import * as THREE from "three"
import SidePage6Model from "./SidePage6Model"
import CameraViewDirection from "./CameraViewDirection"
import { PointerLockControls } from "@react-three/drei"
import PlayControl from "./PlayControl"

function ClickHandler({ clickedInfo, setClickedInfo, setBoxes, setHeldBox, heldBox }) {
    const { scene, camera } = useThree()

    const handleClick = (event) => {
        if (event.button !== 0) return // 왼쪽 클릭만 처리

        event.stopPropagation()

        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2(0, 0) // 항상 화면 중심

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(scene.children, true)

        if (intersects.length > 0) {
            const intersection = intersects[0]
            const clickedObject = intersection.object
            const { id, position, type } = clickedObject.userData

            // 클릭한 면 방향 구하기
            const faceNormal = intersection.face?.normal.clone()
            faceNormal?.applyMatrix3(new THREE.Matrix3().getNormalMatrix(clickedObject.matrixWorld)).normalize()

            // 만약 블럭을 들고 있는 상태라면 놓기 처리
            if (heldBox && faceNormal && position) {
                const offset = new THREE.Vector3(0, 0, 0)
                const [x, y, z] = [faceNormal.x, faceNormal.y, faceNormal.z].map((v) => Math.round(v))
                if (x === 1) offset.set(1, 0, 0)
                else if (x === -1) offset.set(-1, 0, 0)
                else if (y === 1) offset.set(0, 1, 0)
                else if (y === -1) offset.set(0, -1, 0)
                else if (z === 1) offset.set(0, 0, 1)
                else if (z === -1) offset.set(0, 0, -1)

                const targetPos = new THREE.Vector3(...position).add(offset)

                setBoxes(prev => [
                    ...prev,
                    {
                        id: `placed-${Date.now()}`,
                        position: [targetPos.x, targetPos.y, targetPos.z],
                        color: heldBox.color,
                        type: "fixed"
                    }
                ])

                // 창작 모드일 경우 계속 생성하게끔
                if (!heldBox.persistent) {
                    setHeldBox(null)
                    setClickedInfo(null)
                }

                console.log(`블럭을 ${[x, y, z]} 방향으로 놓았음. 위치:`, targetPos.toArray())
                return
            }

            // 들고 있는 블럭이 없고, 클릭한 것이 fixed 블럭이면 들기 처리
            if (!heldBox && type === "fixed") {
                setClickedInfo({ id, position })

                // 박스 제거
                setBoxes((prev) => prev.filter((box) => box.id !== id))

                // 손에 들기
                setHeldBox({
                    id,
                    color: clickedObject.material.color.getStyle(),
                })

                console.log(`블럭 ${id}을 들었음`)
            } else {
                console.log("블럭을 들고 있는 상태라서 클릭만 처리함.")
            }
        }
    }

    useEffect(() => {
        const handleMouseDown = (event) => {
            if (event.button === 2) { // 우클릭
                event.preventDefault()
        
                if (heldBox) {
                    if (heldBox.persistent) {
                        console.log("persistent 블럭 내려놓기")
                        setHeldBox(null)
                    } else if (clickedInfo) {
                        console.log("블럭을 가져온 상태에서 마우스 우클릭을 함. → 원래 자리로 돌려놓기")
        
                        // 블럭 다시 boxes에 추가
                        setBoxes(prev => [
                            ...prev,
                            {
                                id: heldBox.id,
                                position: clickedInfo.position,
                                color: heldBox.color,
                                type: "fixed"
                            }
                        ])
                        setHeldBox(null)
                        setClickedInfo(null)
                    }
                }
        
                return
            }
        }

        window.addEventListener("click", handleClick)
        window.addEventListener("mousedown", handleMouseDown)

        return () => {
            window.removeEventListener("click", handleClick)
            window.removeEventListener("mousedown", handleMouseDown)
        }
    }, [heldBox, clickedInfo])

    return null
}

function HeldBox({ box }) {
    const { camera } = useThree()
    const ref = useRef()

    useFrame(() => {
        if (ref.current) {
            const direction = new THREE.Vector3()
            const right = new THREE.Vector3()
            const up = new THREE.Vector3()
            
            camera.getWorldDirection(direction)
            direction.normalize()

            // 오른쪽 방향 벡터 구하기
            right.crossVectors(direction, camera.up).normalize()

            // 위쪽 방향 벡터
            up.copy(camera.up).normalize()

            // 블럭 위치 = 카메라 앞 + 오른쪽으로 약간 + 아래로 약간
            const newPosition = camera.position.clone()
                .add(direction.multiplyScalar(2))     // 카메라 앞쪽으로
                .add(right.multiplyScalar(0.9))       // 오른쪽으로
                .add(up.multiplyScalar(-0.5))         // 아래로

            ref.current.position.copy(newPosition)
        }
    })

    return (
        <mesh ref={ref}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={box.color} />
        </mesh>
    )
}


// // 호버링 된 블럭 근처 grid 표현

// function HighlightHandler({ boxes, setHighlightMap }) {
//     const { camera, scene } = useThree()
//     const raycaster = useRef(new THREE.Raycaster())
  
//     useFrame(() => {
//       const mouse = new THREE.Vector2(0, 0) // 중앙 고정
//       raycaster.current.setFromCamera(mouse, camera)
  
//       const intersects = raycaster.current.intersectObjects(scene.children, true)
  
//       let highlightCenter = null
//       if (intersects.length > 0) {
//         const intersected = intersects.find((obj) => obj.object.userData?.type === "fixed")
//         if (intersected) {
//           highlightCenter = intersected.object.position
//         }
//       }
  
//       const newMap = {}
//       if (highlightCenter) {
//         for (const box of boxes) {
//           const dist = new THREE.Vector3(...box.position).distanceTo(highlightCenter)
//           newMap[box.id] = dist <= 2 // 반경 1만 highlight
//         }
//       }
  
//       setHighlightMap(newMap)
//     })
  
//     return null
//   }


function CanvasBox({ bottomCount, viewDirection, createBoxBtn, setCreateBoxBtn, boxColor, showInventory }) {
    const [boxes, setBoxes] = useState([])
    const [clickedInfo, setClickedInfo] = useState(null)
    const [heldBox, setHeldBox] = useState(null)
    // const [highlightMap, setHighlightMap] = useState({})


    useEffect(() => {
        const boxModels = []
        const centerOffset = (bottomCount - 1) / 2

        for (let i = 0; i < bottomCount; i++) {
            for (let j = 0; j < bottomCount; j++) {
                const x = i - centerOffset
                const z = j - centerOffset
                boxModels.push({
                    id: `fixed-${i}-${j}`,
                    position: [x, 0, z],
                    color: "white",
                    type: "fixed"
                })
            }
        }

        setBoxes(boxModels)
    }, [bottomCount])

    useEffect(() => {
        if (createBoxBtn) {
            // 새 블럭을 손에 쥐도록 heldBox 상태를 설정
            setHeldBox({
                id: `hand-${Date.now()}`,
                color: boxColor,
                persistent: true,
            })
            setCreateBoxBtn(false) // 한 번만 생성되도록 false로 리셋
            console.log('사용하기 눌렸고 useEffect 작동함')
        }
    }, [createBoxBtn])

    useEffect(() => {
        if (showInventory) {
            document.exitPointerLock?.()
        }
    }, [showInventory])

    return (
        <Canvas camera={{ position: [0, 20, 40], fov: 30 }}>
            {!showInventory && <PointerLockControls />}
            <PlayControl />
            <CameraViewDirection view={viewDirection} />
            <directionalLight position={[10, 15, -30]} />
            <directionalLight position={[10, 30, -30]} />
            <Physics>
            {boxes.map((box) => (
          <SidePage6Model
            key={box.id}
            id={box.id}
            position={box.position}
            color={box.color}
            type={box.type}
            // highlight={highlightMap[box.id]}
          />
        ))}
            </Physics>
            {heldBox && <HeldBox box={heldBox} />}
           {!showInventory && <ClickHandler clickedInfo={clickedInfo} setClickedInfo={setClickedInfo} setBoxes={setBoxes} setHeldBox={setHeldBox} heldBox={heldBox} showInventory={showInventory} />}
            {/* <HighlightHandler boxes={boxes} setHighlightMap={setHighlightMap} /> */}
        </Canvas>
    )
}

export default CanvasBox