import { useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import Ver5Model from "./Ver5Model"
import { OrbitControls } from "@react-three/drei"
import { useRef } from "react"

function Ver5CanvasBox({ yModelCount, xModelCount, spacing, setHoveredData, setClickedModel }) {
    const orbitRef = useRef()
    
    // 박스 모델의 Y, X별 모델 개수 useState
    const [numYModel, setNumYModel] = useState(yModelCount)
    const [numXModel, setNumXModel] = useState(xModelCount)

    // 세로 부분 배치
    const createLeadingYModel = () => {
        const yModels = []
        for (let i = 1; i <= numYModel; i++) {
            const z = (-i) * (spacing)
            yModels.push(
                <Ver5Model
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
                <Ver5Model
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
                <Ver5Model
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

    // 마우스 휠 클릭 핸들러
    const wheelHandler = (event) => {
        if (event.button === 1) {
            orbitRef.current.reset()
        }
    }

    return (
        <Canvas camera={{ position: [13, 10, -20], fov: 30 }} onMouseUp={wheelHandler}>
            <directionalLight position={[10, 15, -30]} />
            <directionalLight position={[10, 30, -30]} />
            <directionalLight position={[20, -20, 30]} />
            <directionalLight position={[-10, 0, 0]} />
            <OrbitControls ref={orbitRef} />
            {createLeadingYModel()}
            {createXModel()}
            {createTrailingYModel()}
        </Canvas>
    )
}

export default Ver5CanvasBox