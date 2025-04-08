import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useState, useEffect, useRef } from "react"
import { Physics } from "@react-three/rapier"
import * as THREE from "three"
import SidePage6Model from "./SidePage6Model"
import CameraViewDirection from "./CameraViewDirection"
import { PointerLockControls } from "@react-three/drei"
import PlayControl from "./PlayControl"

function ClickHandler({ setClickedInfo, setBoxes, setHeldBox, heldBox }) {
    const { scene, camera } = useThree()

    const handleClick = (event) => {
        if (event.button !== 0) return // 0: left, 2: right
    
        event.stopPropagation()
    
        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()
    
        mouse.x = 0
        mouse.y = 0
    
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(scene.children, true)
    
        if (heldBox) {
            console.log(`이미 블럭을 들고있음.`)
            return
        }
    
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object
            const { id, position, type } = clickedObject.userData
    
            if (type === "fixed") {
                setClickedInfo({ id, position })
    
                // 박스 제거
                setBoxes((prev) => prev.filter((box) => box.id !== id))
    
                // 손에 들기
                setHeldBox({
                    id,
                    color: clickedObject.material.color.getStyle(),
                })
    
                console.log(`들고있는 박스: ${id}`)
            }
        }
    }

    const handleRightClick = (event) => {
        event.preventDefault() // 브라우저 기본 우클릭 메뉴 방지
        if (heldBox) {
            console.log("블럭을 가져온 상태에서 마우스 우클릭을 함.")
        }
    }

    useEffect(() => {
        const handleMouseDown = (event) => {
            if (event.button === 2 && heldBox) {
                console.log("블럭을 가져온 상태에서 마우스 우클릭을 함.")
                // 예: setHeldBox(null) 등 추가 행동 가능
            }
        }

        window.addEventListener("click", handleClick)
        window.addEventListener("mousedown", handleMouseDown)

        return () => {
            window.removeEventListener("click", handleClick)
            window.removeEventListener("mousedown", handleMouseDown)
        }
    }, [heldBox])
    
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

function CanvasBox({ bottomCount, viewDirection, createBoxBtn, setCreateBoxBtn, boxColor }) {
    const [boxes, setBoxes] = useState([])
    const [clickedInfo, setClickedInfo] = useState(null)
    const [heldBox, setHeldBox] = useState(null)

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
            setBoxes((prev) => [
                ...prev,
                {
                    id: `created-${prev.length}`,
                    position: [0, 10, 0],
                    color: boxColor,
                    type: "dynamic"
                }
            ])
            setCreateBoxBtn(false)
        }
    }, [createBoxBtn, boxColor, setCreateBoxBtn])

    return (
        <Canvas camera={{ position: [0, 20, 40], fov: 30 }}>
            <PointerLockControls />
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
                    />
                ))}
            </Physics>
            {heldBox && <HeldBox box={heldBox} />}
            <ClickHandler setClickedInfo={setClickedInfo} setBoxes={setBoxes} setHeldBox={setHeldBox} heldBox={heldBox} />
        </Canvas>
    )
}

export default CanvasBox