// MobileTouchControl.js
import { useThree, useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import * as THREE from "three"

function MobileTouchControl() {
    const { camera } = useThree()
    const touchStartRef = useRef(null)
    const touchDeltaRef = useRef({ x: 0, y: 0 })
    const isTouchingRef = useRef(false)

    // 회전 각도 유지용
    const yaw = useRef(0)
    const pitch = useRef(0)

    // 카메라 기준 벡터
    const direction = new THREE.Vector3()
    const euler = new THREE.Euler(0, 0, 0, "YXZ")

    useEffect(() => {
        const handleTouchStart = (e) => {
            const touch = e.touches[0]
            const screenWidth = window.innerWidth

            if (touch.clientX > screenWidth / 2) {
                isTouchingRef.current = true
                touchStartRef.current = { x: touch.clientX, y: touch.clientY }
            }
        }

        const handleTouchMove = (e) => {
            if (!isTouchingRef.current) return

            const touch = e.touches[0]
            const dx = touch.clientX - touchStartRef.current.x
            const dy = touch.clientY - touchStartRef.current.y

            // 민감도 조절
            touchDeltaRef.current.x = dx * 0.002
            touchDeltaRef.current.y = dy * 0.002
        }

        const handleTouchEnd = () => {
            isTouchingRef.current = false
            touchDeltaRef.current = { x: 0, y: 0 }
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
        if (isTouchingRef.current) {
            yaw.current -= touchDeltaRef.current.x
            pitch.current -= touchDeltaRef.current.y

            // pitch 제한
            pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current))

            euler.set(pitch.current, yaw.current, 0)
            camera.quaternion.setFromEuler(euler)

            // 누적 방지
            touchStartRef.current.x += touchDeltaRef.current.x / 0.002
            touchStartRef.current.y += touchDeltaRef.current.y / 0.002
            touchDeltaRef.current = { x: 0, y: 0 }
        }
    })

    return null
}

export default MobileTouchControl
