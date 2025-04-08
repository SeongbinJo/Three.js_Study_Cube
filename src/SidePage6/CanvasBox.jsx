import { Canvas, useThree } from "@react-three/fiber"
import { useState, useEffect } from "react"
import { Physics } from "@react-three/rapier"
import * as THREE from "three"
import SidePage6Model from "./SidePage6Model"
import CameraViewDirection from "./CameraViewDirection"
import { PointerLockControls } from "@react-three/drei"
import PlayControl from "./PlayControl"

function ClickHandler({ setClickedInfo }) {
    const { scene, camera } = useThree()

    const handleClick = (event) => {
        event.stopPropagation()

        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        // PointerLockControls를 사용하기 때문에 항상 0,0 으로 기준을 잡아줘야함
        mouse.x = 0
        mouse.y = 0

        // Raycaster 설정
        raycaster.setFromCamera(mouse, camera)

        // 장면에서 객체 교차 감지
        const intersects = raycaster.intersectObjects(scene.children, true)

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object
            const { id, position } = clickedObject.userData

            console.log(`Clicked Box ID: ${id}, Position: ${JSON.stringify(position)}`)



            // 클릭한 객체의 ID 저장
            setClickedInfo({ id, position })
        }
    }

    useEffect(() => {
        window.addEventListener("click", handleClick)
        return () => window.removeEventListener("click", handleClick)
    }, [])

    return null
}

function CanvasBox({ bottomCount, viewDirection, createBoxBtn, setCreateBoxBtn, boxColor }) {
    const [bottomBoxCount, setBottomBoxCount] = useState(bottomCount)
    const [createdBoxes, setCreatedBoxes] = useState([])
    const [clickedInfo, setClickedInfo] = useState(null)

    const setBottom = () => {
        const boxModels = []
        const centerOffset = (bottomBoxCount - 1) / 2;

        for (let i = 0; i < bottomBoxCount; i++) {
            for (let j = 0; j < bottomBoxCount; j++) {
                const x = i - centerOffset;
                const z = j - centerOffset;
                boxModels.push(
                    <SidePage6Model
                        key={`${i}-${j}`}
                        id={`${i}-${j}`}
                        position={[x, 0, z]}
                        color="white"
                        type="fixed"
                    />
                )
            }
        }

        return boxModels
    }

    useEffect(() => {
        if (createBoxBtn) {
            setCreatedBoxes((prev) => [
                ...prev,
                { id: `created-${prev.length}`, position: [0, 10, 0], color: boxColor }
            ]);
            setCreateBoxBtn(false)
        }
    }, [createBoxBtn, setCreateBoxBtn])

    return (
        <Canvas camera={{ position: [0, 20, 40], fov: 30 }}>
            <PointerLockControls />
            <PlayControl />
            <CameraViewDirection view={viewDirection} />
            <directionalLight position={[10, 15, -30]} />
            <directionalLight position={[10, 30, -30]} />
            <Physics>
                {setBottom()}
                {createdBoxes.map((box) => (
                    <SidePage6Model
                        key={box.id}
                        id={box.id}
                        position={box.position}
                        color={box.color}
                        type="dynamic"
                    />
                ))}
            </Physics>
            <ClickHandler setClickedInfo={setClickedInfo} />
        </Canvas>
    )
}

export default CanvasBox