import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useState, useEffect, useRef } from "react"
import * as THREE from "three"
import SidePage6Model from "./SidePage6Model"
import CameraViewDirection from "./CameraViewDirection"
import { PointerLockControls, Text } from "@react-three/drei"
import PlayControlR3F from "./PlayControlR3F"
import PlayControlUI from "./PlayControlUI"
import SmoothUserMarker from "./SmoothUserMarker"
import { v4 as uuidv4 } from "uuid"
import MobileTouchControl from "./MobileTouchControl"
import { useMediaQuery } from "react-responsive"
import "../App.css"



function ClickHandler({ clickedInfo, setClickedInfo, setBoxes, setHeldBox, heldBox, showInventory, showMenu, roomID, socketRef, isMobile, onTapRef, onLongPressRef }) {
    const { scene, camera } = useThree()

    const [history, setHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(0)

    function pushHistory(boxInfo) {
        setHistory(prev => {
            const newHistory = [...prev]

            if (historyIndex !== 0) {
                const cutIndex = newHistory.length + historyIndex
                newHistory.splice(cutIndex)
            }

            newHistory.push(boxInfo)

            return newHistory
        })

        setHistoryIndex(0)
    }

    // <
    function undoAction(target) {
        setBoxes(prev => {
            let newBoxes = [...prev]
            switch (target.type) {
                case "create":
                    // create를 undo -> 해당 박스 삭제
                    return newBoxes.filter(box => box.id !== target.box.id)
                case "delete":
                    // delete를 undo -> 해당 박스 추가
                    newBoxes = newBoxes.filter(box => box.id !== target.box.id)
                    return [...newBoxes, target.box]
                default:
                    return newBoxes
            }
        })
    }


    // >
    function redoAction(target) {
        setBoxes(prev => {
            let newBoxes = [...prev]
            switch (target.type) {
                case "create":
                    // create를 redo -> 해당 박스 다시 추가
                    return [...newBoxes, target.box]
                case "delete":
                    // delete를 redo -> 해당 박스 다시 삭제
                    return newBoxes.filter(box => box.id !== target.box.id)
                default:
                    return newBoxes
            }
        })
    }

    useEffect(() => {
        if (roomID) return

        // 키 이벤트 안에서 index 변경 전에 바로 실행
        const handleKeyDown = (e) => {
            if (e.key === "<" || e.key === ",") {
                const nextIndex = historyIndex - 1
                const target = history[history.length + nextIndex]
                if (target) {
                    undoAction(target)
                    setHistoryIndex(nextIndex)
                }
            }
            if (e.key === ">" || e.key === ".") {
                const target = history[history.length + historyIndex]
                if (target) {
                    redoAction(target)
                    setHistoryIndex(historyIndex + 1)
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [history, historyIndex, roomID])



    const handleLeftClick = () => {
        if (showInventory || showMenu) return // 왼쪽 클릭만 처리


        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2(0, 0) // 항상 화면 중심
        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObjects(scene.children, true).filter(i => !i.object.userData.ignoreRaycast)

        if (intersects.length > 0) {
            const intersection = intersects[0]
            const clickedObject = intersection.object
            const { id, position } = clickedObject.userData

            // 클릭한 면 방향 구하기
            const faceNormal = intersection.face?.normal.clone()
            faceNormal?.applyMatrix3(new THREE.Matrix3().getNormalMatrix(clickedObject.matrixWorld)).normalize()


            // 만약 블럭을 들고 있는 상태라면 놓기 처리
            if (heldBox && faceNormal && position) {
                const offset = new THREE.Vector3(0, 0, 0)
                const [x, y, z] = [faceNormal.x, faceNormal.y, faceNormal.z].map((v) => Math.round(v))
                if (x === 1) offset.set(1, 0, 0)
                else if (x === -1) offset.set(-1, 0, 0)
                else if (y === 1) offset.set(0, 1, 0)
                else if (y === -1) offset.set(0, -1, 0)
                else if (z === 1) offset.set(0, 0, 1)
                else if (z === -1) offset.set(0, 0, -1)

                const targetPos = new THREE.Vector3(...position).add(offset)

                // 창작 모드가 아닌 존재하는 블럭을 집어 좌클릭 한 경우
                if (!heldBox.persistent) {
                    setHeldBox(null)
                    setClickedInfo(null)

                    console.log(`targetPos : `, targetPos.toArray())

                    const createdBox = {
                        id: heldBox.id,
                        position: [targetPos.x, targetPos.y, targetPos.z],
                        color: heldBox.color,
                    }

                    pushHistory({
                        type: "create",
                        box: createdBox
                    })

                    setBoxes(prev => [
                        ...prev,
                        createdBox
                    ])

                    if (roomID) {
                        socketRef.current.emit(`created_block`, {
                            roomId: roomID,
                            createdBoxInfo: createdBox
                        })
                    }

                } else { // 창작 모드로 생성
                    const newBox = {
                        id: uuidv4(),
                        position: [targetPos.x, targetPos.y, targetPos.z],
                        color: heldBox.color,
                    }

                    pushHistory({
                        type: "create",
                        box: newBox
                    })

                    setBoxes(prev => [
                        ...prev,
                        newBox
                    ])

                    if (roomID) {
                        socketRef.current.emit(`created_block`, {
                            roomId: roomID,
                            createdBoxInfo: newBox
                        })
                    }

                    console.log('창작 모드:: 생성함. boxes: ', roomID)
                }

                console.log(`블럭을 ${[x, y, z]} 방향으로 놓았음. 옮긴 위치:`, targetPos.toArray())


                return
            }

            // 손에 쥔 블럭이 없는데 좌클릭할 경우
            if (!heldBox) {
                setClickedInfo({ id, position })

                const deletedBox = {
                    id: id,
                    position: position,
                    color: clickedObject.material.color.getStyle()
                }

                // 블럭 제거
                setBoxes((prev) => prev.filter((box) => box.id !== id))

                pushHistory({
                    type: `delete`,
                    box: deletedBox
                })

                setHeldBox({
                    id,
                    color: clickedObject.material.color.getStyle(),
                    prevPos: [...position],
                })

                if (roomID) {
                    socketRef.current.emit(`deleted_block`, {
                        roomId: roomID,
                        deletedBoxInfo: deletedBox
                    })
                }
            }

        }
    }

    const handleRightClick = () => {
        if (showInventory || showMenu) return

        const raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2(0, 0)

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(scene.children, true).filter(i => !i.object.userData.ignoreRaycast)

        if (intersects.length === 0) return

        const intersection = intersects[0]
        const clickedObject = intersection.object
        const { id } = clickedObject.userData

        if (heldBox) {
            if (heldBox.persistent) {
                setHeldBox(null)
            } else if (clickedInfo && !roomID) {
                setBoxes(prev => [...prev, {
                    id: heldBox.id,
                    position: clickedInfo.position,
                    color: heldBox.color
                }])
                setHeldBox(null)
                setClickedInfo(null)
            }
        } else if (id) {
            const deletedBox = {
                id,
                position: clickedObject.position.clone(),
                color: clickedObject.material.color.getStyle()
            }

            setBoxes(prev => prev.filter(box => box.id !== id))
            pushHistory({ type: "delete", box: deletedBox })

            if (roomID) {
                socketRef.current.emit("deleted_block", {
                    roomId: roomID,
                    deletedBoxInfo: deletedBox
                })
            }
        }
    }

    useEffect(() => {
        if (isMobile) {
            if (onTapRef) onTapRef.current = handleLeftClick
            if (onLongPressRef) onLongPressRef.current = handleRightClick
            return
        }

        const handleMouseClick = (e) => {
            if (e.button === 0) handleLeftClick()
            if (e.button === 2) handleRightClick()
        }

        window.addEventListener("mousedown", handleMouseClick)
        return () => window.removeEventListener("mousedown", handleMouseClick)
    }, [isMobile, heldBox, clickedInfo, roomID, showMenu, showInventory])

    return null
}

function HeldBox({ box }) {
    const { camera } = useThree()
    const ref = useRef()

    useFrame(() => {
        if (ref.current) {
            const direction = new THREE.Vector3()
            const right = new THREE.Vector3()
            const up = new THREE.Vector3()

            camera.getWorldDirection(direction)
            direction.normalize()

            // 오른쪽 방향 벡터 구하기
            right.crossVectors(direction, camera.up).normalize()

            // 위쪽 방향 벡터
            up.copy(camera.up).normalize()

            // 블럭 위치 = 카메라 앞 + 오른쪽으로 약간 + 아래로 약간
            const newPosition = camera.position.clone()
                .add(direction.multiplyScalar(2))     // 카메라 앞쪽으로
                .add(right.multiplyScalar(0.9))       // 오른쪽으로
                .add(up.multiplyScalar(-0.5))         // 아래로

            ref.current.position.copy(newPosition)
        }
    })

    return (
        <mesh ref={ref}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={box.color} />
        </mesh>
    )
}


function CanvasBox({
    bottomCount, viewDirection, boxes,
    setBoxes, createBoxBtn, setCreateBoxBtn,
    boxColor, showInventory, showMenu,
    isGrid, backgroundColor, isLogin,
    isAnonymity, socketRef, roomID,
    userEmail, usersInRoom, setUsersInRoom }) {
    const [clickedInfo, setClickedInfo] = useState(null)
    const [heldBox, setHeldBox] = useState(null)

    const firstCameraPos = [0, 20, 40]

    const [userMarkers, setUserMarkers] = useState([])

    const keys = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false
    })
    const currentSpeed = useRef(0.3)
    const mobileDirection = useRef({ x: 0, y: 0 })

    const onTapRef = useRef()
    const onLongPressRef = useRef()

    useEffect(() => {
        if (createBoxBtn) {
            // 새 블럭을 손에 쥐도록 heldBox 상태를 설정
            setHeldBox({
                id: `hand-${Date.now()}`,
                color: boxColor,
                persistent: true, // 창작 모드 블럭인지?
            })
            setCreateBoxBtn(false) // 한 번만 생성되도록 false로 리셋
            console.log('사용하기 눌렸고 useEffect 작동함')
        }
    }, [createBoxBtn])

    useEffect(() => {
        if (showInventory || showMenu) {
            document.exitPointerLock?.()
        }
    }, [showInventory, showMenu])

    useEffect(() => {
        const updatedMarkers = Object.entries(usersInRoom)
            .filter(([email]) => email !== userEmail)
            .map(([email, pos]) => ({
                id: email,
                targetPosition: pos,
                color: "orange",
                email,
            }))
        setUserMarkers(updatedMarkers)
    }, [usersInRoom])

    useEffect(() => {
        console.log("🔍 boxes.length: ", boxes.length)
    }, [boxes])

    const isMobile = useMediaQuery({ maxWidth: 768 })

    return (
        <div
            id="canvas-container"
            style={{ position: "relative", width: "100vw", height: "100vh", touchAction: "none" }}
        >
            <Canvas
                camera={{ position: firstCameraPos, fov: 40 }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: backgroundColor
                }}
            >
                {(isLogin || isAnonymity) && !(showInventory || showMenu) && (
                    isMobile ? <MobileTouchControl /> : <PointerLockControls />
                )}
                {(isLogin || isAnonymity) && (
                    <PlayControlR3F
                        socketRef={socketRef}
                        roomID={roomID}
                        userEmail={userEmail}
                        setUsersInRoom={setUsersInRoom}
                        keys={keys}
                        currentSpeed={currentSpeed}
                        mobileDirection={mobileDirection}
                    />
                )}
                <CameraViewDirection view={viewDirection} />
                <directionalLight position={[10, 15, -30]} />
                <directionalLight position={[10, 30, -30]} />
                <directionalLight position={[20, -20, 30]} />
                <directionalLight position={[-10, 0, 0]} />
                {boxes.map((box, idx) => (
                    <SidePage6Model
                        key={`${box.id}-${idx}`}
                        id={box.id}
                        position={box.position}
                        color={box.color}
                        isGrid={isGrid}
                    />
                ))}
                {heldBox && <HeldBox box={heldBox} />}
                {userMarkers.map(marker => (
                    <SmoothUserMarker
                        key={marker.id}
                        id={marker.id}
                        email={marker.email}
                        targetPosition={marker.targetPosition}
                        color={marker.color}
                    />
                ))}
                <ClickHandler
                    clickedInfo={clickedInfo}
                    setClickedInfo={setClickedInfo}
                    setBoxes={setBoxes}
                    setHeldBox={setHeldBox}
                    heldBox={heldBox}
                    showInventory={showInventory}
                    showMenu={showMenu}
                    roomID={roomID}
                    socketRef={socketRef}
                    isMobile={isMobile}
                    onTapRef={onTapRef}
                    onLongPressRef={onLongPressRef}
                />
            </Canvas>

            <div
                className="joystick-wrapper"
                style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    zIndex: 10,
                    touchAction: "none", // 터치 제어 위해 꼭 필요
                    pointerEvents: "auto"
                }}
            >
                <PlayControlUI
                    keys={keys}
                    mobileDirection={mobileDirection}
                    currentSpeed={currentSpeed}
                    onTap={() => onTapRef.current?.()}
                    onLongPress={() => onLongPressRef.current?.()}
                />
            </div>
        </div>
    )

}

export default CanvasBox
