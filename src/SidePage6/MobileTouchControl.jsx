import { useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber"

function MobileTouchControl() {
  const { camera, gl } = useThree()
  const isTouching = useRef(false)
  const lastTouch = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = gl.domElement

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isTouching.current = true
        lastTouch.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        }
        e.preventDefault()
      }
    }

    const handleTouchMove = (e) => {
      if (!isTouching.current || e.touches.length !== 1) return

      const dx = e.touches[0].clientX - lastTouch.current.x
      const dy = e.touches[0].clientY - lastTouch.current.y

      lastTouch.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }

      const sensitivity = 0.002
      camera.rotation.y -= dx * sensitivity
      camera.rotation.x -= dy * sensitivity
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x))

      e.preventDefault()
    }

    const handleTouchEnd = () => {
      isTouching.current = false
    }

    canvas.addEventListener("touchstart", handleTouchStart, { passive: false })
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
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
