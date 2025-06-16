import { useEffect } from "react"
import { useMediaQuery } from "react-responsive"
import { Joystick } from "react-joystick-component"

function PlayControlUI({ keys, mobileDirection, currentSpeed }) {
  const isMobile = useMediaQuery({ maxWidth: 768 })

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "ShiftLeft") currentSpeed.current = 0.6

      switch (e.code) {
        case "KeyW": keys.current.forward = true; break
        case "KeyS": keys.current.backward = true; break
        case "KeyA": keys.current.left = true; break
        case "KeyD": keys.current.right = true; break
        case "Space": keys.current.up = true; break
        case "KeyC": keys.current.down = true; break
      }
    }

    const handleKeyUp = (e) => {
      if (e.code === "ShiftLeft") currentSpeed.current = 0.3

      switch (e.code) {
        case "KeyW": keys.current.forward = false; break
        case "KeyS": keys.current.backward = false; break
        case "KeyA": keys.current.left = false; break
        case "KeyD": keys.current.right = false; break
        case "Space": keys.current.up = false; break
        case "KeyC": keys.current.down = false; break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  if (!isMobile) return null

  return (
    <>
      <div style={{ position: "fixed", bottom: 20, left: 20, zIndex: 1000, touchAction: "none", }}>
        <Joystick
          size={80}
          baseColor="gray"
          stickColor="white"
          move={e => mobileDirection.current = { x: e.x, y: e.y }}
          stop={() => mobileDirection.current = { x: 0, y: 0 }}
        />
      </div>
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onTouchStart={() => keys.current.up = true}
          onTouchEnd={() => keys.current.up = false}
          style={{ padding: 10 }}
        >상승</button>
        <button
          onTouchStart={() => keys.current.down = true}
          onTouchEnd={() => keys.current.down = false}
          style={{ padding: 10 }}
        >하강</button>
      </div>
    </>
  )
}

export default PlayControlUI
