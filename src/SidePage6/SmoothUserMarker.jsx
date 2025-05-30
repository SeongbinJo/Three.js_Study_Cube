import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"

function SmoothUserMarker({ id, email, targetPosition, color }) {
    const groupRef = useRef()

    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.position.set(...targetPosition)
        }
    }, []) // 최초 위치 설정

    useFrame(() => {
        if (!groupRef.current) return
        const currentPos = groupRef.current.position
        const target = new THREE.Vector3(...targetPosition)
        currentPos.lerp(target, 0.1) // ← 보간 속도 조절 (0.1은 부드럽고 반응도 빠름)
    })

    return (
        <group ref={groupRef}>
            <mesh>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Text
                position={[0, 0.8, 0]}
                fontSize={0.3}
                color="black"
                anchorX="center"
                anchorY="bottom"
            >
                {email}
            </Text>
        </group>
    )
}

export default SmoothUserMarker