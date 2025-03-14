import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import Dummy3DModel from "./Dummy3DModel"
import { OrbitControls } from "@react-three/drei"
import { useEffect } from "react"

function CanvasBox({ yModelCount, xModelCount, spacing, setHoveredData }) {
    // 박스 모델의 Y, X별 모델 개수 useState
    const [numYModel, setNumYModel] = useState(yModelCount)
    const [numXModel, setNumXModel] = useState(xModelCount)

    // 세로 부분 배치
    const createLeadingYModel = () => {
        const yModels = []
        for (let i = 1; i <= numYModel; i++) {
            const z = (-i) * (spacing)
            yModels.push(
                <Dummy3DModel key={`yModel - ${i}`} position={[0, 0, z]} color="blue" onHover={setHoveredData} />
            )
        }
        return yModels
    }

    const createTrailingYModel = () => {
        const yModels = []
        for (let i = 1; i <= numYModel; i++) {
            const z = (-i) * (spacing)
            yModels.push(
                <Dummy3DModel key={`yModel - ${i}`} position={[(numXModel - 1) * (spacing), 0, z]} color="yellow" onHover={setHoveredData} />
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
                <Dummy3DModel key={`xModel - ${i}`} position={[x, 0, 0]} color="green" onHover={setHoveredData} />
            )
        }
        return xModels
    }

    return (
        <Canvas>
            <OrbitControls />
            {createLeadingYModel()}
            {createXModel()}
            {createTrailingYModel()}
        </Canvas>
    )
}

export default CanvasBox