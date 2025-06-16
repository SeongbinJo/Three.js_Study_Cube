import { useEffect, useRef } from "react"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"

function MobileTouchControl() {
  const { camera, gl } = useThree()
  const yawObject = useRef(new THREE.Object3D()) // 좌우
  const pitchObject = useRef(new THREE.Object3D()) // 상하
  const activeTouchId = useRef(null)
  const lastTouch = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // setup: 카메라를 pitch -> yaw 에 붙이기
    pitchObject.current.add(camera)
    yawObject.current.add(pitchObject.current)

    const canvas = gl.domElement

    const handleTouchStart = (e) => {
      const canvasRect = canvas.getBoundingClientRect()
      const touch = Array.from(e.changedTouches).find(t => t.clientX > canvasRect.width / 2)

      if (touch) {
        activeTouchId.current = touch.identifier
        lastTouch.current = { x: touch.clientX, y: touch.clientY }
      }
    }

    const handleTouchMove = (e) => {
      const touch = Array.from(e.touches).find(t => t.identifier === activeTouchId.current)
      if (!touch) return

      const dx = touch.clientX - lastTouch.current.x
      const dy = touch.clientY - lastTouch.current.y

      lastTouch.current = { x: touch.clientX, y: touch.clientY }

      const sensitivity = 0.002
      yawObject.current.rotation.y -= dx * sensitivity
      pitchObject.current.rotation.x -= dy * sensitivity
      pitchObject.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitchObject.current.rotation.x))
    }

    const handleTouchEnd = (e) => {
      const stillTouching = Array.from(e.touches).find(t => t.identifier === activeTouchId.current)
      if (!stillTouching) {
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
