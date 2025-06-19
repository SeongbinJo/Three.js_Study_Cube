import { useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"

function MobileTouchControl() {
  const { camera, gl } = useThree()
  const isTouching = useRef(false)
  const lastTouch = useRef({ x: 0, y: 0 })
  const activeTouchId = useRef(null)

  const yaw = useRef(0)   // 좌우 회전
  const pitch = useRef(0) // 상하 회전

  useEffect(() => {
    const canvas = gl.domElement

    const handleTouchStart = (e) => {
      const canvasRect = canvas.getBoundingClientRect()
      const touch = Array.from(e.changedTouches).find(t => t.clientX > canvasRect.width / 2)
      if (touch) {
        activeTouchId.current = touch.identifier
        isTouching.current = true
        lastTouch.current = { x: touch.clientX, y: touch.clientY }
      }
    }

    const handleTouchMove = (e) => {
      const touch = Array.from(e.touches).find(t => t.identifier === activeTouchId.current)
      if (!isTouching.current || !touch) return

      const dx = touch.clientX - lastTouch.current.x
      const dy = touch.clientY - lastTouch.current.y
      lastTouch.current = { x: touch.clientX, y: touch.clientY }

      const sensitivity = 0.003
      yaw.current += dx * sensitivity
      pitch.current -= dy * sensitivity

      // 수직 회전 제한 (상하 90도)
      const maxPitch = Math.PI / 2 - 0.01
      pitch.current = Math.max(-maxPitch, Math.min(maxPitch, pitch.current))

      // 방향 벡터 계산
      const direction = new THREE.Vector3(
        Math.cos(pitch.current) * Math.sin(yaw.current),
        Math.sin(pitch.current),
        Math.cos(pitch.current) * Math.cos(yaw.current)
      )

      const target = new THREE.Vector3().addVectors(camera.position, direction)
      camera.lookAt(target)
    }

    const handleTouchEnd = (e) => {
      const stillTouching = Array.from(e.touches).find(t => t.identifier === activeTouchId.current)
      if (!stillTouching) {
        isTouching.current = false
        activeTouchId.current = null
      }
    }

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false })
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("touchend", handleTouchEnd)
    canvas.addEventListener("touchcancel", handleTouchEnd)

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
      canvas.removeEventListener("touchcancel", handleTouchEnd)
    }
  }, [camera, gl])

  return null
}

export default MobileTouchControl
