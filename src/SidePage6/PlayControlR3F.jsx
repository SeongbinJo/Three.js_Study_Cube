import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useRef, useEffect, useState } from "react"

function PlayControlR3F({ socketRef, roomID, userEmail, setUsersInRoom, keys, mobileDirection, currentSpeed }) {
  const { camera } = useThree()
  const direction = new THREE.Vector3()
  const lastCameraPos = useRef(camera.position.toArray())

  useFrame(() => {
    direction.set(0, 0, 0)

    if (keys.current.forward || mobileDirection.current.y > 0.1) direction.z += 1
    if (keys.current.backward || mobileDirection.current.y < -0.1) direction.z -= 1
    if (keys.current.left || mobileDirection.current.x < -0.1) direction.x += 1
    if (keys.current.right || mobileDirection.current.x > 0.1) direction.x -= 1
    if (keys.current.up) direction.y += 1
    if (keys.current.down) direction.y -= 1


    direction.normalize()

    const moveDirection = new THREE.Vector3()
    camera.getWorldDirection(moveDirection).normalize()

    const strafe = new THREE.Vector3().crossVectors(camera.up, moveDirection).normalize()

    const moveZ = moveDirection.clone().multiplyScalar(direction.z * currentSpeed.current)
    const moveX = strafe.multiplyScalar(direction.x * currentSpeed.current)
    const moveY = new THREE.Vector3(0, direction.y * currentSpeed.current, 0)

    camera.position.add(moveX).add(moveZ).add(moveY)

    const currentCameraPos = camera.position.toArray()
    const changed = currentCameraPos.some((v, i) => Math.abs(v - lastCameraPos.current[i]) >= 1)

    if (changed && roomID && userEmail) {
      lastCameraPos.current = currentCameraPos
      socketRef.current.emit("send_camera_position", {
        roomId: roomID,
        userEmail: userEmail,
        cameraPos: camera.position.toArray()
      })
    }
  })

  useEffect(() => {
    socketRef.current.on("user_moved_position", ({ roomId, userEmail, cameraPos }) => {
      setUsersInRoom(prev => ({
        ...prev,
        [userEmail]: cameraPos
      }))
    })
  }, [])

  return null
}

export default PlayControlR3F
