import { useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import Ver3Model from "./Ver3Model"
import { OrbitControls } from "@react-three/drei"

function Ver3CanvasBox({ yModelCount, xModelCount, spacing, setHoveredData, setClickedModel }) {
    // 박스 모델의 Y, X별 모델 개수 useState
    const [numYModel, setNumYModel] = useState(yModelCount)
    const [numXModel, setNumXModel] = useState(xModelCount)

    // 세로 부분 배치
    const createLeadingYModel = () => {
        const yModels = []
        for (let i = 1; i <= numYModel; i++) {
            const z = (-i) * (spacing)
            yModels.push(
                <Ver3Model
                    key={`yModel - ${i}`}
                    id={`left yModel - ${i}`}
                    position={[0, 0, z]}
                    color="blue"
                    onHover={setHoveredData} 
                    onClick={setClickedModel}
                    />
            )
        }
        return yModels
    }

    const createTrailingYModel = () => {
        const yModels = []
        for (let i = 1; i <= numYModel; i++) {
            const z = (-i) * (spacing)
            yModels.push(
                <Ver3Model
                    key={`yModel - ${i}`}
                    id={`right yModel - ${i}`}
                    position={[(numXModel - 1) * (spacing), 0, z]}
                    color="yellow"
                    onHover={setHoveredData} 
                    onClick={setClickedModel}
                    />
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
                <Ver3Model
                    key={`xModel - ${i}`}
                    id={`xModel - ${i}`}
                    position={[x, 0, 0]}
                    color="green"
                    onHover={setHoveredData} 
                    onClick={setClickedModel}
                    />
            )
        }
        return xModels
    }

    return (
        <Canvas camera={{ position: [13, 10, -20], fov: 30}}>
            <OrbitControls />
            {createLeadingYModel()}
            {createXModel()}
            {createTrailingYModel()}
        </Canvas>
    )
}

export default Ver3CanvasBox