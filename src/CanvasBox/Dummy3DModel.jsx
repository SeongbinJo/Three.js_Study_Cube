import { useState } from "react"
import * as THREE from "three"

function Dummy3DModel({ position, color, onHover }) {
    const [hovered, setHovered] = useState(false)

    return (
        <>
            <directionalLight position={[1, 1, 1]} />

            <mesh position={position} onPointerOver={(event) => {
                event.stopPropagation()
                setHovered(true)
                onHover(true, event.clientX, event.clientY)
            }
            }
                onPointerOut={() => {
                    setHovered(false)
                    onHover(false)
                }
                }>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={color}
                transparent={true}
                opacity={hovered ? 0.7 : 1}
                blending={THREE.NormalBlending}
                />
            </mesh>
        </>
    )
}

export default Dummy3DModel