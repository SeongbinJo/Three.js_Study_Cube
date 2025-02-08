import { useState } from "react"

function Ver2Model({ position, color }) {
    const [hovered, setHovered] = useState(false)

    return (
        <>
            <directionalLight position={[1, 1, 1]} />

            <mesh position={position} onPointerOver={(event) => {
                event.stopPropagation()
                setHovered(true)
            }
            }
                onPointerOut={() => setHovered(false)}>
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