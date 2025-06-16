import { useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber"

function MobileTouchControl() {
  const { camera, gl } = useThree()
  const isTouching = useRef(false)
  const lastTouch = useRef({ x: 0, y: 0 })
  const activeTouchId = useRef(null) // 현재 조작 중인 터치 ID 저장

  useEffect(() => {
    const canvas = gl.domElement

    const handleTouchStart = (e) => {
      if (activeTouchId.current === null) {
        const touch = e.touches[0] // 첫 번째 손가락만 회전용으로 사용
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

      const sensitivity = 0.002
      camera.rotation.y -= dx * sensitivity
      camera.rotation.x -= dy * sensitivity
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x))
    }

    const handleTouchEnd = (e) => {
      // 사용하던 손가락이 떨어졌는지 확인
      const stillActive = Array.from(e.touches).some(t => t.identifier === activeTouchId.current)
      if (!stillActive) {
        isTouching.current = false
        activeTouchId.current = null
      }
    }

    canvas.addEventListener("touchstart", handleTouchStart, { passive: true })
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true })
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
