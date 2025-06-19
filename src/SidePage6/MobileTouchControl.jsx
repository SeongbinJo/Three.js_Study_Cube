import { useThree, useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"

function MobileTouchControl() {
    const { camera } = useThree()
    const activeTouchId = useRef(null)
    const lastTouch = useRef({ x: 0, y: 0 })
    const isTouching = useRef(false)

    const yaw = useRef(0)
    const pitch = useRef(0)
    const euler = new THREE.Euler(0, 0, 0, "YXZ")

    useEffect(() => {
        const handleTouchStart = (e) => {
            const touch = Array.from(e.touches).find(t => t.clientX > window.innerWidth / 2)
            if (touch) {
                activeTouchId.current = touch.identifier
                lastTouch.current = { x: touch.clientX, y: touch.clientY }
                isTouching.current = true
            }
        }

        const handleTouchMove = (e) => {
            const touch = Array.from(e.touches).find(t => t.identifier === activeTouchId.current)
            if (!isTouching.current || !touch) return

            const dx = touch.clientX - lastTouch.current.x
            const dy = touch.clientY - lastTouch.current.y
            lastTouch.current = { x: touch.clientX, y: touch.clientY }

            const sensitivity = 0.002
            yaw.current -= dx * sensitivity
            pitch.current -= dy * sensitivity

            // pitch 제한 (상하 각도)
            pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current))
        }

        const handleTouchEnd = () => {
            isTouching.current = false
            activeTouchId.current = null
        }

        window.addEventListener("touchstart", handleTouchStart)
        window.addEventListener("touchmove", handleTouchMove)
        window.addEventListener("touchend", handleTouchEnd)

        return () => {
            window.removeEventListener("touchstart", handleTouchStart)
            window.removeEventListener("touchmove", handleTouchMove)
            window.removeEventListener("touchend", handleTouchEnd)
        }
    }, [])

    useFrame(() => {
        euler.set(pitch.current, yaw.current, 0)
        camera.quaternion.setFromEuler(euler)
    })

    return null
}

export default MobileTouchControl
