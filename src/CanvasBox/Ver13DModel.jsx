import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

function Ver13DModel({position, color}) {

    return (
        <>
            <directionalLight position={[1,1,1]} />
            
            <mesh position={position}>
                <boxGeometry args={[1,1,1]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </>
    )
}

export default Ver13DModel