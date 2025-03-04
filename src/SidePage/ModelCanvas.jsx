import { OrbitControls } from "@react-three/drei"
import SidePageModel from "./SidePageModel.jsx"
import { Canvas } from "@react-three/fiber"

function ModelCanvas() {
    return (
        <Canvas>
            <directionalLight position={[10, 15, -30]} />
            <directionalLight position={[10, 30, -30]} />
            <directionalLight position={[20, -20, 30]} />
            <directionalLight position={[-10, 0, 0]} />
            <OrbitControls />
            <SidePageModel></SidePageModel>
        </Canvas>
    )
}

export default ModelCanvas