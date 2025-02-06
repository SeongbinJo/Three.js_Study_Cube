import { Canvas } from "@react-three/fiber"
import Dummy3DModel from "./Dummy3DModel"

function CanvasBox() {
    return (
        <Canvas>
            <Dummy3DModel></Dummy3DModel>
        </Canvas>
    )
}

export default CanvasBox