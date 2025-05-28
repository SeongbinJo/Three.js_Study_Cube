import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { useRef, useEffect } from "react"

function PlayControl({ socketRef, roomID, userEmail }) {
    const { camera } = useThree()
    const velocity = useRef(new THREE.Vector3())
    const direction = new THREE.Vector3()

    const keys = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false,
    })

    const moveSpeed = 0.3
    const sprintSpeed = 0.6
    const currentSpeed = useRef(moveSpeed)

    const handleKeyDown = (e) => {
        if (e.code === "ShiftLeft") currentSpeed.current = sprintSpeed

        switch (e.code) {
            case "KeyW":
                keys.current.forward = true
                break
            case "KeyS":
                keys.current.backward = true
                break
            case "KeyA":
                keys.current.left = true
                break
            case "KeyD":
                keys.current.right = true
                break
            case "Space":
                keys.current.up = true
                break
            case "KeyC":
                keys.current.down = true
                break
        }
    }

    const handleKeyUp = (e) => {
        if (e.code === "ShiftLeft") currentSpeed.current = moveSpeed

        switch (e.code) {
            case "KeyW":
                keys.current.forward = false
                break
            case "KeyS":
                keys.current.backward = false
                break
            case "KeyA":
                keys.current.left = false
                break
            case "KeyD":
                keys.current.right = false
                break
            case "Space":
                keys.current.up = false
                break
            case "KeyC":
                keys.current.down = false
                break
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("keyup", handleKeyUp)
        }
    }, [])

    const lastCameraPos = useRef(camera.position.toArray())

    useFrame(() => {
        direction.set(0, 0, 0)

        if (keys.current.forward) direction.z += 1
        if (keys.current.backward) direction.z -= 1
        if (keys.current.left) direction.x += 1
        if (keys.current.right) direction.x -= 1
        if (keys.current.up) direction.y += 1
        if (keys.current.down) direction.y -= 1

        direction.normalize()

        // 카메라 방향 기준으로 이동 방향 회전
        const moveDirection = new THREE.Vector3()
        camera.getWorldDirection(moveDirection)
        // moveDirection.y = 0
        moveDirection.normalize()

        const strafe = new THREE.Vector3().crossVectors(camera.up, moveDirection).normalize()

        const moveZ = moveDirection.clone().multiplyScalar(direction.z * currentSpeed.current)
        const moveX = strafe.multiplyScalar(direction.x * currentSpeed.current)
        const moveY = new THREE.Vector3(0, direction.y * currentSpeed.current, 0)

        camera.position.add(moveX)
        camera.position.add(moveZ)
        camera.position.add(moveY)

        // 카메라 위치, 방향 로그 /////////////////////////////////////////////////////////////////
        const currentCameraPos = camera.position.toArray()
        const changed = currentCameraPos.some((v, i) => Math.abs(v - lastCameraPos.current[i]) >= 1)

        if (changed && roomID && userEmail) {
            lastCameraPos.current = currentCameraPos

            socketRef.current.emit(`send_camera_position`, {
                roomId: roomID,
                userEmail: userEmail,
                cameraPos: camera.position.toArray()
            })
        }

        // console.log("카메라 회전 (XYZ):", camera.rotation.x, camera.rotation.y, camera.rotation.z)
        // 카메라 위치, 방향 로그 /////////////////////////////////////////////////////////////////

    })

    useEffect(() => {
        socketRef.current.on(`user_moved_position`, ({ roomId, userEmail, cameraPos}) => {
            console.log(`방(${roomId}), 다른 유저(${userEmail})의 움직임이 감지됨.`)
        })
    }, [])

    return null
}

export default PlayControl