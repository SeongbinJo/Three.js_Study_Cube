import { Canvas, useThree } from "@react-three/fiber"
import { useState, useEffect } from "react"
import { Physics } from "@react-three/rapier"
import * as THREE from "three"
import SidePage5Model from "./SidePage5Model"
import CameraViewDirection from "./CameraViewDirection"

function ClickHandler({ setClickedId }) {
    const { scene, camera } = useThree()

    const handleClick = (event) => {
        event.stopPropagation()

        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        // 마우스 좌표 정규화 (-1 ~ 1 범위)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        // Raycaster 설정
        raycaster.setFromCamera(mouse, camera)

        // 장면에서 객체 교차 감지
        const intersects = raycaster.intersectObjects(scene.children, true)

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object
            console.log(`Clicked Box ID: ${clickedObject.userData.id}`)

            // 클릭한 객체의 ID 저장
            setClickedId(clickedObject.userData.id)
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
    const [clickedId, setClickedId] = useState(null)

    const setBottom = () => {
        const boxModels = []
        const centerOffset = (bottomBoxCount - 1) / 2;

        for (let i = 0; i < bottomBoxCount; i++) {
            for (let j = 0; j < bottomBoxCount; j++) {
                const x = i - centerOffset;
                const z = j - centerOffset;
                boxModels.push(
                    <SidePage5Model 
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
        <Canvas camera={{ fov: 30 }}>
            <CameraViewDirection view={viewDirection} />
            <directionalLight position={[10, 15, -30]} />
            <directionalLight position={[10, 30, -30]} />
            <Physics>
                {setBottom()}
                {createdBoxes.map((box) => (
                    <SidePage5Model 
                        key={box.id} 
                        id={box.id}
                        position={box.position} 
                        color={box.color} 
                        type="dynamic"
                    />
                ))}
            </Physics>
            <ClickHandler setClickedId={setClickedId} />
        </Canvas>
    )
}

export default CanvasBox