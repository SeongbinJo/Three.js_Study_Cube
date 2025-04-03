import { Canvas, useThree } from "@react-three/fiber"
import { useState, useEffect, useRef, Suspense } from "react"
import * as THREE from "three"
import gsap from "gsap"
import SidePage5Model from "./SidePage5Model"
import { Physics } from "@react-three/rapier"

function CameraViewDirection({ view }) {
    const { camera, size } = useThree() // size: 캔버스 크기 가져오기
    const prevView = useRef(view)
    const [distance, setDistance] = useState(50)
    const [cameraYPos, setCameraYPos] = useState(30)

    useEffect(() => {
        let newCameraYPos = cameraYPos // 기존 값 유지
        let newX = camera.position.x
        let newZ = camera.position.z
    
        if (view === "top") {
            newCameraYPos = 30
            if (prevView.current !== "top" && prevView.current !== "bottom") {
                newX = camera.position.x
                newZ = camera.position.z
            }
        } else if (view === "bottom") {
            newCameraYPos = -30
            if (prevView.current !== "top" && prevView.current !== "bottom") {
                newX = camera.position.x
                newZ = camera.position.z
            }
        }
    
        if (view === "top" || view === "bottom") {
            setCameraYPos(newCameraYPos)
        }
    
        let position = [newX, newCameraYPos, newZ]
    
        switch (view) {
            case "front":
                position = [0, newCameraYPos, distance]
                break
            case "back":
                position = [0, newCameraYPos, -distance]
                break
            case "left":
                position = [-distance, newCameraYPos, 0]
                break
            case "right":
                position = [distance, newCameraYPos, 0]
                break
        }
    
        const isFrontBack = (prevView.current === "front" && view === "back") || 
                            (prevView.current === "back" && view === "front")
    
        const isLeftRight = (prevView.current === "left" && view === "right") || 
                            (prevView.current === "right" && view === "left")
    
        const isBottomToSide = prevView.current === "bottom" && (view === "left" || view === "right")
        const isTopToSide = prevView.current === "top" && (view === "left" || view === "right")
    
        const frontBackPosition = [distance, cameraYPos, 0]
        const leftRightPosition = [0, cameraYPos, distance]
    
        // bottom → left/right도 top → left/right와 동일한 방식으로 처리
        if (isFrontBack || isLeftRight || isBottomToSide || isTopToSide) {
            gsap.to(camera.position, {
                x: isFrontBack ? frontBackPosition[0] : leftRightPosition[0],
                y: newCameraYPos,
                z: isFrontBack ? frontBackPosition[2] : leftRightPosition[2],
                duration: 0.5,
                ease: "power2.out",
                onUpdate: () => {
                    camera.lookAt(new THREE.Vector3(0, 0, 0))
                },
                onComplete: () => {
                    gsap.to(camera.position, {
                        x: position[0],
                        y: position[1],
                        z: position[2],
                        duration: 0.5,
                        ease: "power2.out",
                        onUpdate: () => {
                            camera.lookAt(new THREE.Vector3(0, 0, 0)) // 항상 중앙을 바라보게
                        }
                    })
                }
            })
        } else {
            gsap.to(camera.position, {
                x: position[0],
                y: position[1],
                z: position[2],
                duration: 0.7,
                ease: "power2.out",
                onUpdate: () => {
                    camera.lookAt(new THREE.Vector3(0, 0, 0))
                }
            })
        }
    
        prevView.current = view
    }, [view, distance, camera, cameraYPos])

    return null
}

function CanvasBox({ bottomCount, viewDirection, createBoxBtn, setCreateBoxBtn, boxColor }) {
    const [bottomBoxCount, setbottomBoxCount] = useState(bottomCount)
    const [createdBoxes, setCreatedBoxes] = useState([])

    // 바닥 세팅
    const setBottom = () => {
        const boxModels = []
        const centerOffset = (bottomBoxCount - 1) / 2  // 중심 좌표

        for (let i = 0; i < bottomBoxCount; i++) {
            for (let j = 0; j < bottomBoxCount; j++) {
                const x = i - centerOffset
                const z = j - centerOffset
                boxModels.push(
                    <SidePage5Model key={`${i}-${j}`} position={[x, 0, z]} color="white" type="fixed" />
                )
            }
        }

        return boxModels
    }

    useEffect(() => {
        if (createBoxBtn) {
            // 생성할 박스 id 와 생성할 위치 넣어서 배열에 추가
            setCreatedBoxes(prev => [...prev, { id: prev.length, position: [0, 10, 0], color: boxColor }])
            setCreateBoxBtn(false)
        }
    }, [createBoxBtn, setCreateBoxBtn])

    return (
        <Canvas camera={{ fov: 30 }}>
            <CameraViewDirection view={viewDirection} />
            <directionalLight position={[10, 15, -30]} />
            <directionalLight position={[10, 30, -30]} />
            <directionalLight position={[20, -20, 30]} />
            <directionalLight position={[-10, 0, 0]} />
            <Suspense>
                <Physics>
                    {setBottom()}
                    {createdBoxes.map(box => (
                        <SidePage5Model key={box.id} position={box.position} color={box.color} type="dynamic" />
                    ))}
                </Physics>
            </Suspense>
            <axesHelper args={[25]}></axesHelper>
        </Canvas>
    )
}

export default CanvasBox