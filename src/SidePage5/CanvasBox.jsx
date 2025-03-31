import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import SidePage5Model from "./SidePage5Model"
import { OrbitControls } from "@react-three/drei"
import { AxesHelper } from "three"

function CanvasBox({ bottomCount }) {
    const [bottomBoxCount, setbottomBoxCount] = useState(bottomCount)

    const setBottom = () => {
        const boxModels = []
        const centerOffset = (bottomBoxCount - 1) / 2  // 중심 좌표 보정
    
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
        <Canvas camera={{ position: [0, 20, 30], fov: 30}}>
            <directionalLight position={[10, 15, -30]} />
            <directionalLight position={[10, 30, -30]} />
            <directionalLight position={[20, -20, 30]} />
            <directionalLight position={[-10, 0, 0]} />
            <OrbitControls />
            {setBottom()}
            <axesHelper args={[10]}></axesHelper>
        </Canvas>
    )
}

export default CanvasBox