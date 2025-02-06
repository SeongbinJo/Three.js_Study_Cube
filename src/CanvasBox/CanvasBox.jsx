import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import Dummy3DModel from "./Dummy3DModel"
import { OrbitControls } from "@react-three/drei"

function CanvasBox() {
    const [numYModel, setNumYModel] = useState(4)
    const [numXModel, setNumXModel] = useState(4)
    const [modelSpacing, setModelSpacing] = useState(1.5)
  
    // 세로 부분 배치
    const createLeadingYModel = () => {
      const yModels = []
      for (let i = 1; i <= numYModel; i++) {
        const z = (-i) * (modelSpacing)
        yModels.push(
          <Dummy3DModel key={`yModel - ${i}`} position={[0, 0, z]} color="blue" />
        )
      }
      return yModels
    }

    const createTrailingYModel = () => {
        const yModels = []
        for (let i = 1; i <= numYModel; i++) {
          // const x = (i % 2) * spacing
          const z = (-i) * (modelSpacing)
          yModels.push(
            <Dummy3DModel key={`yModel - ${i}`} position={[(numXModel - 1) * (modelSpacing) , 0, z]} color="yellow" />
          )
        }
        return yModels
      }
  
    // 가로 부분 배치
    const createXModel = () => {
      const xModels = []
      for (let i = 0; i < numXModel; i++) {
        const x = i * modelSpacing
        xModels.push(
          <Dummy3DModel key={`xModel - ${i}`} position={[x, 0, 0]} color="green" />
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