import { useState } from "react"
import * as THREE from "three"

function Ver2Model({ id, position, color, onHover }) {
    const [hovered, setHovered] = useState(false)

    return (
        <>
            <mesh position={position} onPointerOver={(event) => {
                event.stopPropagation()
                setHovered(true)
                onHover(true, event.clientX, event.clientY, id)
            }
            }
            onPointerMove={(event) => {
                if (hovered) {
                    onHover(true, event.clientX, event.clientY, id)
                }
            }}
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

export default Ver2Model