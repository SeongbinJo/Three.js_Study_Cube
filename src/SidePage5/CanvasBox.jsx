import { Canvas } from "@react-three/fiber"
import { useState, useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"
import gsap from "gsap"
import SidePage5Model from "./SidePage5Model"

function CameraViewDirection({ view }) {
    const { camera } = useThree()
    const prevView = useRef(view)  // 이전 view 값을 저장하는 ref

    useEffect(() => {
        console.log("Previous View:", prevView.current)
        console.log("Current View:", view)

        const distance = 40
        let position

        switch (view) {
            case "front":
                position = [0, 20, distance]
                break
            case "back":
                position = [0, 20, -distance]
                break
            case "left":
                position = [-distance, 20, 0]
                break
            case "right":
                position = [distance, 20, 0]
                break
            default:
                position = [0, 20, distance]
                break
        }

        const 돌아감 = (prevView.current === "front" && view === "back") || (prevView.current === "back" && view === "front")
        const 돌아감Pos = [distance, 20, 0]
        const 돌아감2 = (prevView.current === "left" && view === "right") || (prevView.current === "right" && view === "left")
        const 돌아감2Pos = [0, 20, distance]

        if (돌아감 || 돌아감2) {
            // 첫 번째 애니메이션
            gsap.to(camera.position, {
                x: 돌아감 ? 돌아감Pos[0] : 돌아감2Pos[0],
                y: 돌아감 ? 돌아감Pos[1] : 돌아감2Pos[1],
                z: 돌아감 ? 돌아감Pos[2] : 돌아감2Pos[2],
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
    }, [view, camera]) 

    return null
}

function CanvasBox({ bottomCount, viewDirection }) {
    const [bottomBoxCount, setbottomBoxCount] = useState(bottomCount)

    const setBottom = () => {
        const boxModels = []
        const centerOffset = (bottomBoxCount - 1) / 2  // 중심 좌표

        for (let i = 0; i < bottomBoxCount; i++) {
            for (let j = 0; j < bottomBoxCount; j++) {
                const x = i - centerOffset
                const z = j - centerOffset
                boxModels.push(
                    <SidePage5Model key={`${i}-${j}`} position={[x, 0, z]} color="white" />
                )
            }
        }

        return boxModels
    }

    return (
        <Canvas camera={{ position: [0, 20, 40], fov: 30 }}>
            <CameraViewDirection view={viewDirection} />
            <directionalLight position={[10, 15, -30]} />
            <directionalLight position={[10, 30, -30]} />
            <directionalLight position={[20, -20, 30]} />
            <directionalLight position={[-10, 0, 0]} />
            {/* <OrbitControls /> */}
            {setBottom()}
            <axesHelper args={[10]}></axesHelper>
        </Canvas>
    )
}

export default CanvasBox