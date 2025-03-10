import { useThree } from "@react-three/fiber"
import { useRef, useState } from "react"
import * as THREE from "three"

function Ver7Model({ id, position, color, onHover, onClick, clickedModel, setOrbitControlsEnabled }) {
    const [hovered, setHovered] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [currentPosition, setCurrentPosition] = useState(position)

    const meshRef = useRef()
    const { camera } = useThree()
    const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
    const raycaster = useRef(new THREE.Raycaster())
    const mouse = new THREE.Vector2()

    const handlePointerDown = (event) => {
        event.stopPropagation()
        setIsDragging(true)
        setHovered(false) // 드래그 시작 시 hovered를 false로 설정
        onHover(false, event.clientX, event.clientY, id) // onHover 호출 시 false로 설정
        setOrbitControlsEnabled(false)
    }

    const handlePointerUp = (event) => {
        event.stopPropagation()
        setIsDragging(false)
        onClick(id)
        setOrbitControlsEnabled(true)
    }

    const handlePointerMove = (event) => {
        if (!isDragging) {
            if (hovered) {
                onHover(true, event.clientX, event.clientY, id)
            }
            return
        }

        event.stopPropagation()

        setHovered(false)
        onHover(false, event.clientX, event.clientY, id)

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.current.setFromCamera(mouse, camera)

        const intersectionPoint = new THREE.Vector3()
        raycaster.current.ray.intersectPlane(planeRef.current, intersectionPoint)

        setCurrentPosition([intersectionPoint.x, intersectionPoint.y, intersectionPoint.z])
    }

    const mouseOverHandler = (event) => {
        event.stopPropagation()
        // 드래그 중이 아니면 hovered 상태를 true로 설정
        if (!isDragging) {
            setHovered(true)
            onHover(true, event.clientX, event.clientY, id)
        }
    }

    const mouseOutHandler = (event) => {
        event.stopPropagation()
        // 드래그 중이 아니면 hovered 상태를 false로 설정
        if (!isDragging) {
            setHovered(false)
            onHover(false)
        }
    }

    return (
        <mesh
            ref={meshRef}
            position={currentPosition}
            onPointerOver={mouseOverHandler}
            onPointerOut={mouseOutHandler}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color={clickedModel.visible && id === clickedModel.id ? "#000000" : color}
                transparent={true}
                opacity={hovered ? 0.7 : 1}
                blending={THREE.NormalBlending}
            />
        </mesh>
    )
}

export default Ver7Model