import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import Ver7Model from "./Ver7Model"
import { OrbitControls } from "@react-three/drei"
import { AxesHelper } from "three"
import { useRef } from "react"
import { useEffect } from "react"
import Ver7ModelInfo from "./Ver7ModelInfo"
import './Ver7EventBox.css'

function Ver7CanvasBox({ yModelCount, xModelCount, spacing, setHoveredData, setClickedModel, clickedModel }) {
    const orbitRef = useRef()
    const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true)

    // 박스 모델의 Y, X별 모델 개수 useState
    const [numYModel, setNumYModel] = useState(yModelCount)
    const [numXModel, setNumXModel] = useState(xModelCount)
    const centerX = (numXModel / 2) + (spacing / 6)
    const centerY = ((numYModel + 1) / 2) + (spacing / 6)

    // 생성될 모델의 id를 배열에 담음 - localStorage 처음 세팅할때 사용
    const modelIds = []

    for (let i = 1; i <= numYModel; i++) {
        modelIds.push(`left yModel - ${i}`)
        modelIds.push(`right yModel - ${i}`)
    }
    for (let i = 0; i < numXModel; i++) {
        modelIds.push(`xModel - ${i}`)
    }

    // modelIds 사용하여 localStorage 세팅
    useEffect(() => {
        modelIds.forEach((id) => {
            if (!localStorage.getItem(id)) {
                const emptyData = new Ver6ModelInfo(id, [], "")
                localStorage.setItem(id, JSON.stringify(emptyData))
            }
        })
    }, [])

    // 세로 부분 배치
    const createLeadingYModel = () => {
        const yModels = []
        for (let i = 1; i <= numYModel; i++) {
            const z = (-i) * (spacing)
            yModels.push(
                <Ver7Model
                    key={`left yModel - ${i}`}
                    id={`left yModel - ${i}`}
                    position={[-centerX, 0, (z + centerY)]}
                    color="blue"
                    onHover={setHoveredData}
                    onClick={setClickedModel}
                    clickedModel={clickedModel}
                    setOrbitControlsEnabled={setOrbitControlsEnabled}
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
                <Ver7Model
                    key={`right yModel - ${i}`}
                    id={`right yModel - ${i}`}
                    position={[((numXModel - 1) * (spacing) - centerX), 0, (z + centerY)]}
                    color="yellow"
                    onHover={setHoveredData}
                    onClick={setClickedModel}
                    clickedModel={clickedModel}
                    setOrbitControlsEnabled={setOrbitControlsEnabled}
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
                <Ver7Model
                    key={`xModel - ${i}`}
                    id={`xModel - ${i}`}
                    position={[(x - centerX), 0, centerY]}
                    color="green"
                    onHover={setHoveredData}
                    onClick={setClickedModel}
                    clickedModel={clickedModel}
                    setOrbitControlsEnabled={setOrbitControlsEnabled}
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
        <div style={{position: "relative", width: "100%", height: "100%"}}>

            <Canvas camera={{ position: [-10, 10, 10], fov: 35 }} onMouseUp={wheelHandler}>
            <directionalLight position={[10, 15, -30]} />
            <directionalLight position={[10, 30, -30]} />
            <directionalLight position={[20, -20, 30]} />
            <directionalLight position={[-10, 0, 0]} />
            <OrbitControls ref={orbitRef} enabled={orbitControlsEnabled} />
            
            {createLeadingYModel()}
            {createXModel()}
            {createTrailingYModel()}

            <axesHelper args={[10]}></axesHelper>
            
        </Canvas>
        <div className="dot"></div>
        </div>
    )
}

export default Ver7CanvasBox