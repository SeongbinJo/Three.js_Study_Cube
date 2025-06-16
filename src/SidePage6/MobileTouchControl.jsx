import { useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber"

function MobileTouchControl() {
  const { camera, gl } = useThree()
  const isTouching = useRef(false)
  const lastTouch = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = gl.domElement

    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      const isRightHalf = touch.clientX > window.innerWidth / 2
      if (!isRightHalf) return

      isTouching.current = true
      lastTouch.current = {
        x: touch.clientX,
        y: touch.clientY
      }
    }

    const handleTouchMove = (e) => {
      if (!isTouching.current || e.touches.length !== 1) return

      const touch = e.touches[0]
      const isRightHalf = touch.clientX > window.innerWidth / 2
      if (!isRightHalf) return

      const dx = touch.clientX - lastTouch.current.x
      const dy = touch.clientY - lastTouch.current.y

      lastTouch.current = {
        x: touch.clientX,
        y: touch.clientY
      }

      const sensitivity = 0.002
      camera.rotation.y -= dx * sensitivity
      camera.rotation.x -= dy * sensitivity
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x))
    }

    const handleTouchEnd = () => {
      isTouching.current = false
    }

    canvas.addEventListener("touchstart", handleTouchStart, { passive: true })
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true })
    canvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
    }
  }, [camera, gl])

  return null
}

export default MobileTouchControl
