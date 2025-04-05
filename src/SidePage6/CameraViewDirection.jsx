import { Canvas, useThree } from "@react-three/fiber"
import { useState, useEffect, useRef, Suspense } from "react"
import * as THREE from "three"
import gsap from "gsap"

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

export default CameraViewDirection