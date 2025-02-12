import { useRef } from "react"
import { useState } from "react"
import * as THREE from "three"

function Ver3Model({ id, position, color, onHover }) {
    const [hovered, setHovered] = useState(false)

    const mouseOverHandler = (event) => {
        event.stopPropagation()
        setHovered(true)
        onHover(true, event.clientX, event.clientY)
    }

    const mouseOutHandler = () => {
        setHovered(false)
        onHover(false)
    }

    const mouseClickHandler = () => {
        console.log(id)
    }

    return (
        <>
            <directionalLight position={[1, 1, 1]} />

            <mesh
                position={position}
                onPointerOver={
                    mouseOverHandler
                }
                onPointerMove={(event) => {
                    if (hovered) {
                        onHover(true, event.clientX, event.clientY, id)
                    }
                }}
                onPointerOut={
                    mouseOutHandler
                }
                onClick={mouseClickHandler}
            >
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

export default Ver3Model