import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useRef } from "react"

function HeldBlock({ id, color }) {
    const meshRef = useRef()
    const { camera } = useThree()
    const targetPos = new THREE.Vector3()

    useFrame(() => {
        const offset = new THREE.Vector3(0.5, -0.5, -1) // 오른쪽 아래
        offset.applyQuaternion(camera.quaternion)
        targetPos.copy(camera.position).add(offset)

        meshRef.current.position.lerp(targetPos, 0.2)
        meshRef.current.quaternion.slerp(camera.quaternion, 0.2)
    })

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}

export default HeldBlock