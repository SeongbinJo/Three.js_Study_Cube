import { useFrame } from "@react-three/fiber"
import { useState } from "react"
import { useRef } from "react"

function Dummy3DModel({position, color}) {
    const [hovered, setHovered] = useState(false)

    return (
        <>
            <directionalLight position={[1,1,1]} />
            
            <mesh position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
                <boxGeometry args={[1,1,1]} />
                <meshStandardMaterial color={hovered ? "gray" : color} />
            </mesh>
        </>
    )
}

export default Dummy3DModel