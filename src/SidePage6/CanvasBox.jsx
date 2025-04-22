import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useState, useEffect, useRef } from "react"
import { Physics } from "@react-three/rapier"
import * as THREE from "three"
import SidePage6Model from "./SidePage6Model"
import CameraViewDirection from "./CameraViewDirection"
import { PointerLockControls } from "@react-three/drei"
import PlayControl from "./PlayControl"

function ClickHandler({ clickedInfo, setClickedInfo, setBoxes, setHeldBox, heldBox, showInventory }) {
    const { scene, camera } = useThree()

    // 1. 히스토리 배열 생성
    //     a. 10개 까지만 들어가야함
    //     b. 10개 이후로는 처음에 들어왔던 것 부터 삭제 후 마지막에 추가
    //     c. 추가/삭제/위치변경 인지 구분해서 추가
    // 2. < 키 이벤트 생성
    //     a. 히스토리 배열의 마지막 요소가
    //         1. 추가일 경우
    //             a. 해당 요소의 박스 정보에 맞게 '삭제' 해줌
    //         2. 삭제일 경우
    //             a. 해당 요소의 박스 정보에 맞게 '추가' 해줌
    //         3. 위치변경일 경우
    //             a. 해당 요소의 박스 정보에 맞게 '삭제' 후 원래 위치에 '추가' 해줌\
    //     b. < 키를 눌러 이전으로 수정해도 배열의 요소는 삭제되면 안되고, 참조하는 배열 요소의 위치만 앞으로 당겨져야함
    //     c. 참조하는 배열 요소가 첫번째이고, < 키를 한 번 더 누르게되면 이벤트는 더이상 작동하지 않음
    // 3. > 키 이벤트 생성
    //     a. 참조하는 배열 요소가 마지막이면 더이상 이벤트 작동하지 않음

    const [history, setHistory] = useState([])

    function pushHistory(boxInfo) {
        setHistory(prev => {
            const newHistory = [...prev]

            if (newHistory.length >= 10) {
                newHistory.shift()
            }

            newHistory.push(boxInfo)
            console.log(`현재 History[] =`, newHistory)

            return newHistory
        })
    }




    const handleClick = (event) => {
        if (event.button !== 0 || showInventory) return // 왼쪽 클릭만 처리

        event.stopPropagation()

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

                const movedBox = {
                    id: `placed-${Date.now()}`,
                    position: [targetPos.x, targetPos.y, targetPos.z],
                    color: heldBox.color,
                }

                setBoxes(prev => [
                    ...prev,
                    movedBox
                ])

                // 창작 모드가 아닌 존재하는 블럭을 집어 좌클릭 한 경우
                if (!heldBox.persistent) {
                    setHeldBox(null)
                    setClickedInfo(null)

                    pushHistory({
                        type: "move",
                        prevBox: {
                            id: heldBox.id,
                            position: heldBox.prevPos,
                            color: heldBox.color
                        },
                        nextBox: {
                            id: heldBox.id,
                            position: targetPos.toArray(),
                            color: heldBox.color
                        }
                    })

                } else { // 창작 모드로 생성
                    pushHistory({
                        type: "create",
                        box: movedBox
                    })

                    console.log('창작 모드, 생성 함')
                }

                console.log(`블럭을 ${[x, y, z]} 방향으로 놓았음. 옮긴 위치:`, targetPos.toArray())
                return
            }

            // 들고 있는 블럭이 없고, 클릭한 것이 fixed 블럭이면 들기 처리
            if (!heldBox) {
                setClickedInfo({ id, position })

                // 박스 제거
                setBoxes((prev) => prev.filter((box) => box.id !== id))

                // 손에 들기
                setHeldBox({
                    id,
                    color: clickedObject.material.color.getStyle(),
                    prevPos: [...position], // 손에 집기 전 블럭 위치
                })

                console.log(`블럭 ${id}을 들었음`)
            } else {
                console.log("블럭을 들고 있는 상태라서 클릭만 처리함.")
            }
        }
    }

    useEffect(() => {
        const handleMouseDown = (event) => {
            if (event.button === 2 && !showInventory) { // 우클릭
                event.preventDefault()

                const raycaster = new THREE.Raycaster()
                const mouse = new THREE.Vector2(0, 0) // 중앙 고정
                raycaster.setFromCamera(mouse, camera)
                const intersects = raycaster.intersectObjects(scene.children, true).filter(i => !i.object.userData.ignoreRaycast)

                if (intersects.length > 0) {
                    const intersection = intersects[0]
                    const clickedObject = intersection.object
                    const userData = clickedObject.userData || {}
                    const id = userData.id

                    // 블럭을 들고 있을 경우
                    if (heldBox) {
                        if (heldBox.persistent) {
                            console.log("persistent 블럭 내려놓기")
                            setHeldBox(null)
                        } else if (clickedInfo) {
                            console.log("블럭을 가져온 상태에서 마우스 우클릭을 함. → 원래 자리로 돌려놓기")

                            setBoxes(prev => [
                                ...prev,
                                {
                                    id: heldBox.id,
                                    position: clickedInfo.position,
                                    color: heldBox.color,
                                }
                            ])
                            setHeldBox(null)
                            setClickedInfo(null)
                        }
                    }
                    // 아무것도 안 들고 있으면 삭제
                    else if (id) {
                        setBoxes((prev) => prev.filter((box) => box.id !== id))

                        const deletedBox = {
                            id: id,
                            position: clickedObject.position.clone(),
                            color: clickedObject.material.color.getStyle()
                        }
                        pushHistory({
                            type: "delete",
                            box: deletedBox
                        })

                        console.log(`손에 아무것도 없을 때 fixed 블럭 ${id} 우클릭 → 삭제함`)
                    }
                }
            }
        }

        window.addEventListener("click", handleClick)
        window.addEventListener("mousedown", handleMouseDown)

        return () => {
            window.removeEventListener("click", handleClick)
            window.removeEventListener("mousedown", handleMouseDown)
        }
    }, [heldBox, clickedInfo, showInventory])

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


function CanvasBox({ bottomCount, viewDirection, createBoxBtn, setCreateBoxBtn, boxColor, showInventory, isGrid, backgroundColor }) {
    const [boxes, setBoxes] = useState([])
    const [clickedInfo, setClickedInfo] = useState(null)
    const [heldBox, setHeldBox] = useState(null)


    useEffect(() => {
        const boxModels = []
        const centerOffset = (bottomCount - 1) / 2

        for (let i = 0; i < bottomCount; i++) {
            for (let j = 0; j < bottomCount; j++) {
                const x = i - centerOffset
                const z = j - centerOffset
                boxModels.push({
                    id: `fixed-${i}-${j}`,
                    position: [x, 0, z],
                    color: "white",
                })
            }
        }

        setBoxes(boxModels)
    }, [bottomCount])

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
        if (showInventory) {
            document.exitPointerLock?.()
        }
    }, [showInventory])

    return (
        <Canvas
            camera={{ position: [0, 20, 40], fov: 30 }}
            style={{ background: backgroundColor }}
        >
            {!showInventory && <PointerLockControls />}
            <PlayControl />
            <CameraViewDirection view={viewDirection} />
            <directionalLight position={[10, 15, -30]} />
            <directionalLight position={[10, 30, -30]} />
            <directionalLight position={[20, -20, 30]} />
            <directionalLight position={[-10, 0, 0]} />
            {boxes.map((box) => (
                <SidePage6Model
                    key={box.id}
                    id={box.id}
                    position={box.position}
                    color={box.color}
                    isGrid={isGrid}
                />
            ))}
            {heldBox && <HeldBox box={heldBox} />}
            <ClickHandler
                clickedInfo={clickedInfo}
                setClickedInfo={setClickedInfo}
                setBoxes={setBoxes}
                setHeldBox={setHeldBox}
                heldBox={heldBox}
                showInventory={showInventory}
            />
        </Canvas>
    )
}

export default CanvasBox