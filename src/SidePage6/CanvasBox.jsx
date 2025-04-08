import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useState, useEffect, useRef } from "react"
import { Physics } from "@react-three/rapier"
import * as THREE from "three"
import SidePage6Model from "./SidePage6Model"
import CameraViewDirection from "./CameraViewDirection"
import { PointerLockControls } from "@react-three/drei"
import PlayControl from "./PlayControl"

function ClickHandler({ setClickedInfo, setBoxes, setHeldBox }) {
    const { scene, camera } = useThree()

    const handleClick = (event) => {
        event.stopPropagation()

        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        mouse.x = 0
        mouse.y = 0

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(scene.children, true)

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object
            const { id, position, type } = clickedObject.userData
            console.log('sibal?')

            if (type === "fixed") {
                setClickedInfo({ id, position })

                // 박스 제거
                setBoxes((prev) => prev.filter((box) => box.id !== id))

                // 손에 들기
                setHeldBox({
                    id,
                    color: clickedObject.material.color.getStyle(),
                })

                console.log(`Picked up box: ${id}`)
            }
        }else {
            console.log('sibal')
        }
    }

    useEffect(() => {
        window.addEventListener("click", handleClick)
        return () => {
            window.removeEventListener("click", handleClick)
        }
    })
    
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
            <ClickHandler setClickedInfo={setClickedInfo} setBoxes={setBoxes} setHeldBox={setHeldBox} />
        </Canvas>
    )
}

export default CanvasBox