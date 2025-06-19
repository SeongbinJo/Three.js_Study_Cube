import { useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber"

function MobileTouchControl() {
  const { camera, gl } = useThree()
  const isTouching = useRef(false)
  const lastTouch = useRef({ x: 0, y: 0 })
  const activeTouchId = useRef(null)

  useEffect(() => {
    const canvas = gl.domElement

    const handleTouchStart = (e) => {
      // 오른쪽 절반에서 발생한 첫 터치만 처리
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

      const sensitivity = 0.002
      // camera.rotation.y -= dx * sensitivity
      camera.rotation.x -= dy * sensitivity
      // camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x))
    }

    const handleTouchEnd = (e) => {
      const remainingTouch = Array.from(e.touches).find(t => t.identifier === activeTouchId.current)
      if (!remainingTouch) {
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
