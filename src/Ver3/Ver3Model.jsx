import { useThree } from "@react-three/fiber"
import { useRef } from "react"
import { useState } from "react"
import * as THREE from "three"

function Ver3Model({ id, position, color, onHover, onClick }) {
    const [hovered, setHovered] = useState(false)
    const meshRef = useRef(null)
    const { camera } = useThree()

    const mouseOverHandler = (event) => {
        event.stopPropagation()
        setHovered(true)
        onHover(true, event.clientX, event.clientY)
    }

    const mouseOutHandler = () => {
        setHovered(false)
        onHover(false)
    }

    const mouseClickHandler = (event) => {
        event.stopPropagation()

        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObject(meshRef.current, true)

        if (intersects.length > 0) {
            console.log(id)
            onClick(id)
        }
    }

    return (
        <>
            <directionalLight position={[1, 1, 1]} />

            <mesh
                ref={meshRef}
                position={position}
                onPointerOver={mouseOverHandler}
                onPointerMove={(event) => {
                    if (hovered) {
                        onHover(true, event.clientX, event.clientY, id)
                    }
                }}
                onPointerOut={mouseOutHandler}
                onPointerDown={mouseClickHandler}
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