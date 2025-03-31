import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import Ver1Model from "./Ver1Model"
import { OrbitControls } from "@react-three/drei"

function CanvasBox({ yModelCount, xModelCount, spacing }) {
    const [numYModel, setNumYModel] = useState(yModelCount)
    const [numXModel, setNumXModel] = useState(xModelCount)

    // 세로 부분 배치
    const createLeadingYModel = () => {
        const yModels = []
        for (let i = 1; i <= numYModel; i++) {
            const z = (-i) * (spacing)
            yModels.push(
                <Ver1Model key={`yModel - ${i}`} position={[0, 0, z]} color="blue" />
            )
        }
        return yModels
    }

    const createTrailingYModel = () => {
        const yModels = []
        for (let i = 1; i <= numYModel; i++) {
            const z = (-i) * (spacing)
            yModels.push(
                <Ver1Model key={`yModel - ${i}`} position={[(numXModel - 1) * (spacing), 0, z]} color="yellow" />
            )
        }
        return yModels
    }

    // 가로 부분 배치
    const createXModel = () => {
        const xModels = []
        for (let i = 0; i < numXModel; i++) {
            const x = i * spacing
            xModels.push(
                <Ver1Model key={`xModel - ${i}`} position={[x, 0, 0]} color="green" />
            )
        }
        return xModels
    }

    return (
        <Canvas camera={{ position: [13, 10, -20], fov: 30}}>
            <directionalLight position={[10, 15, -30]} />
            <directionalLight position={[10, 30, -30]} />
            <directionalLight position={[20, -20, 30]} />
            <directionalLight position={[-10, 0, 0]} />
            <OrbitControls />
            {createLeadingYModel()}
            {createXModel()}
            {createTrailingYModel()}
        </Canvas>
    )
}

export default CanvasBox