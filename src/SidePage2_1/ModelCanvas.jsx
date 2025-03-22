import { OrbitControls } from "@react-three/drei"
import SidePageModel2_1 from "./SidePageModel2_1.jsx"
import { Canvas } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"



function ModelCanvas() {
    const orbitRef = useRef()

    return (
        <Canvas>
            <directionalLight position={[10, 15, -30]} />
            <directionalLight position={[10, 30, -30]} />
            <directionalLight position={[20, -20, 30]} />
            <directionalLight position={[-10, 0, 0]} />
            <OrbitControls ref={orbitRef} />
            <SidePageModel2_1 orbitRef={orbitRef}></SidePageModel2_1>
        </Canvas>
    )
}

export default ModelCanvas