import { useState, useEffect, useRef } from "react"
import '../App.css'
import CanvasBox from './CanvasBox'
import './Crosshair.css'
import { SketchPicker } from "react-color"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"
import { OrbitControls } from "@react-three/drei"
import { getAllDocuments, signUp, signIn, logOut, setBlockStatus, fetchUserEmail } from "./firebase"
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter"
import { io } from "socket.io-client"
import { v4 as uuidv4 } from "uuid"

function SidePage6() {
    const [viewDirection, setViewDirection] = useState("front")

    const auth = getAuth()
    const [userUID, setUserUID] = useState()
    const [userEmail, setUserEmail] = useState()

    const [isAnonymity, setIsAnonymity] = useState(() => {
        const getIsAnonymity = localStorage.getItem(`isAnonymity`)

        if (getIsAnonymity) {
            return JSON.parse(getIsAnonymity)
        }

        return false
    })

    const [isLogin, setIsLogin] = useState(false)
    const [isClickedSignUp, setIsClickedSignUp] = useState(false)
    const [inputEmail, setInputEmail] = useState("")
    const [inputPassword, setInputPassword] = useState("")

    const saveIsAnonymityStatus = (isAnonymity) => {
        localStorage.setItem(`isAnonymity`, JSON.stringify(isAnonymity))
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserUID(user.uid)
                setUserEmail(user.email)
                setIsLogin(true)
                console.log(`현재 로그인 된 유저: `, user.email)
            } else {
                setIsLogin(false)
                setUserUID(null)
                setUserEmail(null)
                console.log(`로그인 안되어 있음`)
            }
        })

        return () => unsubscribe()
    }, [])


    const [isBoxesLoaded, setIsBoxesLoaded] = useState(false)
    const bottomCount = 20
    const [boxes, setBoxes] = useState([])
    const boxesRef = useRef(boxes)

    useEffect(() => {
        boxesRef.current = boxes
    }, [boxes])

    // 기본 바닥
    const basicBoxModel = Array.from({ length: bottomCount }, (_, i) =>
        Array.from({ length: bottomCount }, (_, j) => {
            const centerOffset = (bottomCount - 1) / 2
            const x = i - centerOffset
            const z = j - centerOffset
            return {
                id: uuidv4(),
                position: [x, 0, z],
                color: "white"
            }
        })
    ).flat()

    // isLogin, isAnonymity에 따라 나중에 조건을 달아줘야함함
    useEffect(() => {
        if (isAnonymity) {
            const localSavedBoxes = localStorage.getItem("boxes0")
            if (localSavedBoxes) {
                setBoxes(JSON.parse(localSavedBoxes))
                setIsBoxesLoaded(true)
            }
        } else {
            if (
                localStorage.getItem('boxes0') === null &&
                localStorage.getItem('boxes1') === null &&
                localStorage.getItem('boxes2') === null
            ) {
                for (let i = 0; i < 3; i++) {
                    // localStorage 저장
                    localStorage.setItem(`boxes${i}`, JSON.stringify(basicBoxModel))
                }
            }

            setBoxes(basicBoxModel)
            setIsBoxesLoaded(true)
        }


    }, [isLogin, isAnonymity])


    const [createBoxBtn, setCreateBoxBtn] = useState(false)

    const [color, setColor] = useState("#ffffff")

    const [showInventory, setShowInventory] = useState(false)

    const [showMenu, setShowMenu] = useState(false)

    const [savedSlots, setSavedSlots] = useState(() => {
        if (isAnonymity) {
            const savedBox0 = localStorage.getItem(`boxes0`)
            const savedBox1 = localStorage.getItem(`boxes1`)
            const savedBox2 = localStorage.getItem(`boxes2`)

            return [JSON.parse(savedBox0), JSON.parse(savedBox1), JSON.parse(savedBox2)]
        } else {
            const savedBox0 = localStorage.getItem(`boxes0`)
            const savedBox1 = localStorage.getItem(`boxes1`)
            const savedBox2 = localStorage.getItem(`boxes2`)

            return [JSON.parse(savedBox0), JSON.parse(savedBox1), JSON.parse(savedBox2)]
        }
    })
    const [currentSlot, setCurrentSlot] = useState(0)

    const [isGrid, setIsGrid] = useState(false)

    const [swatches, setSwatches] = useState(Array(5).fill("#ffffff"))
    const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(null)

    const [backgroundColor, setBackgroundColor] = useState("#ffffff")

    useEffect(() => {
        const handleKeyDown = (e) => {

            if (isLogin || isAnonymity) {
                if (e.key === "e" || e.key === "E") {
                    setShowInventory(prev => !prev)
                }

                if (e.key === "q" || e.key === "Q") {
                    setShowMenu(prev => !prev)
                }
            }

        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isLogin, isAnonymity])

    const handleColorChange = (newColor) => {
        setColor(newColor.hex)
        if (selectedSwatchIndex !== null) {
            const newSwatches = [...swatches]
            newSwatches[selectedSwatchIndex] = newColor.hex
            setSwatches(newSwatches)
        }
    }


    const [allBoxData, setAllBoxData] = useState({
        boxes0: [],
        boxes1: [],
        boxes2: [],
    })

    useEffect(() => {
        if (isLogin) {
            const fetchAllBoxes = async () => {
                const fetchBoxes = await Promise.all([
                    getAllDocuments(userUID, 0),
                    getAllDocuments(userUID, 1),
                    getAllDocuments(userUID, 2)
                ])
                setAllBoxData({
                    boxes0: fetchBoxes[0],
                    boxes1: fetchBoxes[1],
                    boxes2: fetchBoxes[2]
                })
                for (let i = 0; i < 3; i++) {
                    localStorage.setItem(`boxes${i}`, JSON.stringify(fetchBoxes[i]))
                }
            }

            const isFirstLogin = localStorage.getItem(`firstLogin`)
            if (JSON.parse(isFirstLogin) === true) {
                // 익명 => 로그인 인 경우
                console.log(`첫 로그인`)
                fetchAllBoxes()
            } else if (JSON.parse(isFirstLogin) === false) {
                // 로그인 후 새로고침 또는 재 접속 시
                console.log(`재접속`)
                const getLocalBox = localStorage.getItem(`boxes${currentSlot}`)
                setAllBoxData(prev => ({
                    ...prev,
                    [`boxes${currentSlot}`]: JSON.parse(getLocalBox),
                }))
            }
        }
    }, [isLogin])


    useEffect(() => {
        if (isLogin) {
            const localBox = localStorage.getItem(`boxes${currentSlot}`)
            if (localBox) {
                setBoxes(JSON.parse(localBox))
            } else {
                const key = `boxes${currentSlot}`
                if (allBoxData[key]) {
                    setBoxes(allBoxData[key])
                    setIsBoxesLoaded(true)
                }
            }
        } else if (isAnonymity) {
            const savedBoxes = localStorage.getItem(`boxes${currentSlot}`)
            if (savedBoxes) {
                setBoxes(JSON.parse(savedBoxes))
            }
        }
    }, [currentSlot, allBoxData])


    const saveSlot = (slotIndex, uid) => {
        if (isLogin) {
            // firestore에도 저장
            setBlockStatus(boxes, slotIndex, uid)

            localStorage.setItem(`boxes${slotIndex}`, JSON.stringify(boxes))
        }

        if (isAnonymity) {
            // 해당 슬롯의 boxes 상태를 로컬스토리지에 저장
            localStorage.setItem(`boxes${slotIndex}`, JSON.stringify(boxes))
        }
    }

    // 로컬 저장소의 boxes들을 기본으로 만들기기
    const setBasicModelLocalStorage = () => {
        setBoxes(basicBoxModel)
        for (let i = 0; i < 3; i++) {
            localStorage.setItem(`boxes${i}`, JSON.stringify(basicBoxModel))
        }
    }

    // 해당 클라이언트로 최로 로그인인지 아닌지 저장
    const firstLogin = (solution) => {
        switch (solution) {
            case `true`:
                localStorage.setItem(`firstLogin`, true)
                break
            case `false`:
                localStorage.setItem(`firstLogin`, false)
                break
            case `remove`:
                const isExistFirstLogin = localStorage.getItem(`firstLogin`)
                if (isExistFirstLogin) {
                    localStorage.removeItem(`firstLogin`)
                    break
                } else {
                    break
                }
            default:
                console.log(`firstLogin solution error`)
        }
    }

    // 임시 저장 /////////////////////////////////////////////////////////////////////////
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

    useEffect(() => {
        if (!autoSaveEnabled) return

        const interval = setInterval(() => {
            localStorage.setItem(`boxes${currentSlot}`, JSON.stringify(boxes))
            firstLogin(`false`)
            console.log(`autosave 작동, `, new Date().toLocaleTimeString())
        }, 600_000)

        return () => clearInterval(interval)
    })
    // 임시 저장 /////////////////////////////////////////////////////////////////////////

    // export file ///////////////////////////////////////////////////////////////////////////
    function exportBoxesToFile(boxes) {
        const scene = new THREE.Scene()

        boxes.forEach(box => {
            console.log(`추출하는 대상의 박스 색 : `, box.color)
            const geometry = new THREE.BoxGeometry(1, 1, 1)
            const material = new THREE.MeshStandardMaterial({ color: box.color })
            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(...box.position)
            scene.add(mesh)
        })

        const exporter = new GLTFExporter()

        exporter.parse(
            scene,
            (gltf) => {
                const blob = new Blob([JSON.stringify(gltf)], { type: `application/json` })
                const url = URL.createObjectURL(blob)

                const link = document.createElement(`a`)
                link.href = url
                link.download = `Digitmix_boxes_3DFile.gltf`
                link.click()
            },
            { binary: false } // true => .glb, false => .gltfd
        )
    }
    // export file ///////////////////////////////////////////////////////////////////////////


    // multi play ////////////////////////////////////////////////////////////////////////////
    const socketRef = useRef(null)

    useEffect(() => {
        socketRef.current = io("http://localhost:3001")
        console.log("✅ 소켓 최초 연결")
    }, [])

    useEffect(() => {
        if (isLogin) {
            // 로그인 직후 소켓 재연결
            if (!socketRef.current?.connected) {
                socketRef.current = io(`http://localhost:3001`)
                console.log("소켓 연결됨")
            }
        }
    }, [isLogin])



    const [roomID, setRoomID] = useState("")

    const [userRole, setUserRole] = useState({
        isHost: false,
        isParticipant: false
    })
    const userRoleRef = useRef(userRole)
    useEffect(() => {
        userRoleRef.current = userRole
    }, [userRole])

    const [joinRoomClick, setJoinRoomClick] = useState(false)
    const [inputRoomId, setInputRoomId] = useState("")
    const [usersInRoom, setUsersInRoom] = useState({}) // 방 만들었을때의 유저 리스트 보여주기, 실시간 위치에 이용

    // room ID 생성
    const generateRoomId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghqijklmnopqrstuvwxyz0123456789'
        let id = ''
        for (let i = 0; i < 8; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return id
    }

    // room 생성
    const createRoomId = async () => {
        try {
            console.log(`craetRoomId 호출됨, 현재 소켓상태: ${socketRef.current.connected}`)
            if (!userEmail) {
                console.warn(`userEmail이 없음. 소켓 emit 생략함.`)
                return
            }

            if (roomID) {
                console.log(`이미 roomID가 존재합니다.`)
                return
            }

            const newRoomID = generateRoomId()
            setRoomID(newRoomID)
            setUserRole({ isHost: true, isParticipant: false })
            socketRef.current.emit(`create_room`, {
                roomId: newRoomID,
                userEmail: getAuth().currentUser.email,
                boxes: boxes
            })
        } catch (error) {
            console.error(`createRoomId(create_room) 실행 중 오류 발생 : `, error)
        }

    }

    // 들어가기 클릭
    const joinRoomClickHandler = () => {
        setJoinRoomClick(true)
    }

    // 참가
    const joinRoom = async () => {
        try {
            const userEmail = await fetchUserEmail(userUID)
            if (!userEmail) {
                console.warn(`userEmail이 없음. 소켓 emit 생략함.`)
                return
            }

            socketRef.current.emit(`join_room`, {
                roomId: inputRoomId,
                userEmail: userEmail
            })

            setRoomID(inputRoomId)

        } catch (error) {
            console.error(`joinRoom(join_room) 실행 중 오류 발생 : `, error)
        }
    }

    const quitRoom = async () => {
        try {
            const userEmail = await fetchUserEmail(userUID)
            if (!userEmail) {
                console.warn(`userEmail이 없음. 소켓 emit 생략함.`)
                return
            }

            socketRef.current.emit(`quit_room`, {
                roomId: inputRoomId,
                userEmail: userEmail
            })

            setRoomID(null)
            setInputRoomId("")
            setUserRole({ isHost: false, isParticipant: false })
            setUsersInRoom({})
            alert(`방을 나옵니다.`)
            setBoxes(savedSlots[currentSlot])
        } catch (error) {
            console.error(`quit_room 실행 중 오류 발생 : `, error)
        }

    }

    const removeRoom = async () => {
        try {
            const userEmail = await fetchUserEmail(userUID)
            if (!userEmail) {
                console.warn(`userEmail이 없음. 소켓 emit 생략함.`)
                return
            }

            socketRef.current.emit(`remove_room`, {
                roomId: roomID,
                userEmail: userEmail
            })

            setRoomID(null)
            setUsersInRoom({})
        } catch (error) {
            console.error(`remove_room 실행 중 오류 발생 : `, error)
        }
    }

    useEffect(() => {
        // 방 생성시 유저 리스트
        socketRef.current.on(`room_user_list_createRoom`, (users) => {
            const userEmailList = users.map(user => user.email)

            if (userEmailList) {
                const emailObject = {}
                userEmailList.forEach(email => {
                    emailObject[email] = null
                })

                setUsersInRoom(emailObject)
            }
        })

        // 유저가 방에 들어왔을때
        socketRef.current.on(`room_user_list_joinRoom`, ({ users, boxes }) => {
            const userEmailList = users.map(user => user.email)

            if (userEmailList) {
                setUsersInRoom(prev => {
                    const prevUsers = { ...prev }

                    userEmailList.forEach(email => {
                        if (!prevUsers[email]) { // 새로운 유저일 경우 이메일과 기본 카메라 위치 값을 넣어줌
                            prevUsers[email] = [0, 20, 40]
                        }
                    })

                    return prevUsers
                })
                console.log(`유저 참가: ${userEmailList}`)
            }
        })

        // 다른 유저가 방에서서 나갔을때
        socketRef.current.on(`other_user_quitRoom`, (userEmail) => {
            if (userEmail) {
                setUsersInRoom(prev => {
                    const newUsersInRoom = { ...prev }
                    delete newUsersInRoom[userEmail]
                    return newUsersInRoom
                })
            }
        })

        // 입장해있던 방의 방장이 방을 삭제했을때
        socketRef.current.on("room_user_list_removeRoom", () => {
            const role = userRoleRef.current
            alert(role.isParticipant ? `방장이 방을 삭제했습니다.` : `방을 삭제합니다.`)

            setRoomID(null)
            setInputRoomId("")
            setUsersInRoom({})
            setUserRole({ isHost: false, isParticipant: false })
            setBoxes(savedSlots[currentSlot])
        })

        // 방에 들어가있는 유저가 연결이 끊겼을때
        socketRef.current.on(`room_user_list_disconnect`, (users) => {
            const updated = { ...prev }
            console.log(`ahsdfa`)

            Object.keys(updated).forEach((key) => {
                if (!users.includes(key)) {
                    delete updated[key]
                }
            })

            return updated
        })

        // 방에 입장 성공했을때
        socketRef.current.on(`join_room_success`, ({ roomId, userEmail, boxes }) => {
            console.log(`입장 성공`)
            setBoxes(boxes)
            console.log(`boxes!!!!!!: `, boxes)
            setUserRole({ isHost: false, isParticipant: true })
        })

        // 방을 찾지 못했을때
        socketRef.current.on(`room_not_found`, (roomId) => {
            alert(`해당 방(${roomId})이 존재하지 않습니다.`)
        })

        // 유저가 블럭을 생성했을 때
        socketRef.current.on(`users_created_block`, ({ createdBoxInfo }) => {
            console.log(`boxes상태: `, boxesRef.current)
            console.log(`새로 생성된 박스 상태: `, createdBoxInfo)
            setBoxes(prev => [...prev, createdBoxInfo])
        })
    }, [])
    // multi play ////////////////////////////////////////////////////////////////////////////

    return (
        <>
            <div className='sidePage5-box'>
                {!isBoxesLoaded ? (
                    <div style={{ color: 'white', padding: '20px', zIndex: 10 }}>
                        🔄 박스를 불러오는 중 🔄
                    </div>
                ) : (
                    <CanvasBox
                        bottomCount={bottomCount}
                        viewDirection={viewDirection}
                        boxes={boxes}
                        setBoxes={setBoxes}
                        createBoxBtn={createBoxBtn}
                        setCreateBoxBtn={setCreateBoxBtn}
                        boxColor={color}
                        showInventory={showInventory}
                        showMenu={showMenu}
                        isGrid={isGrid}
                        backgroundColor={backgroundColor}
                        isLogin={isLogin}
                        isAnonymity={isAnonymity}
                        socketRef={socketRef}
                        roomID={roomID}
                        userEmail={userEmail}
                        usersInRoom={usersInRoom}
                        setUsersInRoom={setUsersInRoom}
                    />
                )}
                <div className="dot"></div>
                <div className='ver1-hovered-box' style={{
                    position: 'absolute',
                    left: 30,
                    top: 30,
                    zIndex: 10
                }}>
                    [SidePage6_Minecraft2] - ing<br />
                    [조작법]<br />
                    1. 움직임 - W, A, S, D<br />
                    2. C(하강), Spacebar(상승)<br />
                    3. E - 블럭 및 배경 색상 설정<br />
                    4. Q - 로컬 저장 및 저장 슬롯 변경, 로그인/로그아웃

                    <div style={{ marginTop: '10px' }}>
                        <button style={{ marginRight: '10px' }} onClick={() => setViewDirection("front")}>앞</button>
                        <button style={{ marginRight: '10px' }} onClick={() => setViewDirection("back")}>뒤</button>
                        <button style={{ marginRight: '10px' }} onClick={() => setViewDirection("left")}>왼쪽</button>
                        <button style={{ marginRight: '10px' }} onClick={() => setViewDirection("right")}>오른쪽</button>
                        <button style={{ marginRight: '10px' }} onClick={() => setViewDirection("top")}>위</button>
                        <button style={{ marginRight: '10px' }} onClick={() => setViewDirection("bottom")}>아래</button>
                    </div>
                </div>
                {showInventory && <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        right: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                        backgroundColor: "green",
                        padding: "10px",
                        borderRadius: "5px",
                        maxWidth: "40%"
                    }}
                >
                    <button
                        onClick={() => {
                            setCreateBoxBtn(true)
                            setShowInventory(prev => !prev)
                        }}
                    >
                        블럭 사용하기
                    </button>
                    <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '6px', marginLeft: '10px', marginRight: '10px' }}>
                        <input
                            type="checkbox"
                            checked={isGrid}
                            onChange={(e) => {
                                setIsGrid(prev => !prev)
                            }}
                        />
                        <span>Grid 적용</span>
                    </label>
                    <button
                        onClick={() => {
                            setBackgroundColor(color)
                        }}
                    >
                        배경색 적용하기
                    </button>
                    <div style={{
                        marginTop: "20px",
                        backgroundColor: "lightgray",
                        borderRadius: "5px",
                        width: "100%"
                    }}>
                        <Canvas camera={{ position: [1, 1, 5], fov: 30 }}>
                            <OrbitControls autoRotate={true} enablePan={false} enableZoom={false} />
                            <directionalLight position={[10, 15, -30]} />
                            <directionalLight position={[10, 30, -30]} />
                            <directionalLight position={[20, -20, 30]} />
                            <directionalLight position={[-10, 0, 0]} />
                            <mesh>
                                <boxGeometry args={[1, 1, 1]} />
                                <meshStandardMaterial color={color} />
                            </mesh>
                        </Canvas>
                    </div>
                    <div style={{ display: "flex", marginTop: "20px", gap: "20px", alignItems: "flex-start" }}>
                        <SketchPicker color={color} disableAlpha={true} onChange={handleColorChange} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "50px" }}>
                            {swatches.map((swatchColor, index) => (
                                <div key={index} style={{ textAlign: "center" }}>
                                    <div
                                        onClick={() => {
                                            if (selectedSwatchIndex === index) {
                                                setSelectedSwatchIndex(null)
                                            } else {
                                                setSelectedSwatchIndex(index)
                                                setColor(swatchColor)
                                            }
                                        }}
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "8px",
                                            backgroundColor: swatchColor,
                                            border: selectedSwatchIndex === index ? "3px solid pink" : "1px solid pink",
                                            cursor: "pointer"
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>}
                {showMenu && <div>
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        right: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                        padding: "10px",
                        borderRadius: "5px",
                        maxWidth: "50%",
                        minWidth: "30%",
                        backgroundColor: "#eee"
                    }}>
                        <h3>저장 슬롯</h3>
                        {savedSlots.map((slot, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrentSlot(index)}
                                style={{
                                    padding: "10px",
                                    marginBottom: "10px",
                                    border: currentSlot === index ? "2px solid blue" : "1px solid gray",
                                    cursor: "pointer",
                                    backgroundColor: slot ? "#cce5ff" : "#f8f9fa",
                                }}
                            >
                                {slot ? `저장 슬롯 ${index + 1}` : `저장 슬롯 ${index + 1}`}
                            </div>
                        ))}
                        <button
                            style={{
                                marginTop: "30px",
                                padding: "10px",
                                width: "100%",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                            onClick={() => saveSlot(currentSlot, userUID)}
                        >
                            현재 상태 저장
                        </button>
                        {isLogin && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginTop: "10px",
                                }}
                            >
                                <button
                                    style={{
                                        padding: "10px",
                                        width: "48%",
                                        backgroundColor: "#28a745",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        createRoomId()
                                    }}
                                >
                                    방 만들기
                                </button>
                                <button
                                    style={{
                                        padding: "10px",
                                        width: "48%",
                                        backgroundColor: "#17a2b8",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        if (!roomID) {
                                            joinRoomClickHandler()
                                        }
                                    }}
                                >
                                    들어가기
                                </button>
                            </div>
                        )}
                        {isLogin && roomID && userRole.isHost && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: "10px",
                                    width: "100%",
                                }}
                            >
                                <div
                                    style={{
                                        height: "40px",
                                        lineHeight: "40px",
                                        width: "60%",
                                        backgroundColor: "#6c757d",
                                        color: "white",
                                        textAlign: "center",
                                        padding: "0 10px", // 좌우 여백만 주고 상하는 제거
                                        boxSizing: "border-box",
                                    }}
                                >
                                    {roomID}
                                </div>
                                <button
                                    style={{
                                        height: "40px",
                                        width: "30%",
                                        backgroundColor: "#dc3545",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        removeRoom()
                                    }}
                                >
                                    방 삭제
                                </button>
                            </div>
                        )}
                        {isLogin && joinRoomClick && !userRole.isHost && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: "10px",
                                    width: "100%",
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="방 ID 입력"
                                    value={inputRoomId}
                                    onChange={(e) => setInputRoomId(e.target.value)}
                                    disabled={userRole.isParticipant}
                                    style={{
                                        height: "40px",
                                        lineHeight: "40px",
                                        width: "60%",
                                        padding: "0 10px",
                                        boxSizing: "border-box",
                                        border: "1px solid #ccc",
                                    }}
                                />
                                <button
                                    style={{
                                        height: "40px",
                                        width: "30%",
                                        backgroundColor: userRole.isParticipant ? `#dc3545` : `#007bff`,
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        if (userRole.isParticipant) {
                                            quitRoom()
                                            setUsersInRoom({})
                                        } else {
                                            joinRoom()
                                        }
                                    }}
                                >
                                    {userRole.isParticipant ? `나가기` : `참가`}
                                </button>
                            </div>
                        )}
                        {isLogin && Object.keys(usersInRoom).length > 0 && (
                            <div
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "10px",
                                }}
                            >
                                {Object.entries(usersInRoom).map(([email, cameraPos]) => (
                                    <div
                                        key={email}
                                        style={{
                                            backgroundColor: "#f1f1f1",
                                            padding: "10px",
                                            borderRadius: "4px",
                                            textAlign: "center",
                                            border: "1px solid #ccc",
                                        }}
                                    >
                                        {email}
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            style={{
                                marginTop: "10px",
                                padding: "10px",
                                width: "100%",
                                backgroundColor: isLogin ? "#FC3F3F" : "#7ED321",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                if (isLogin) {
                                    setShowMenu(prev => !prev)
                                    setBasicModelLocalStorage()
                                    firstLogin(`remove`)
                                    socketRef.current.disconnect()
                                    logOut()
                                } else {
                                    setShowMenu(prev => !prev)
                                    setIsLogin(false)
                                    saveIsAnonymityStatus(false)
                                    setIsAnonymity(false)
                                }
                            }}
                        >
                            {isLogin ? "로그아웃" : "로그인"}
                        </button>
                        <button
                            style={{
                                marginTop: "10px",
                                padding: "10px",
                                width: "100%",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                exportBoxesToFile(boxes)
                            }}
                        >
                            3D 파일 추출
                        </button>
                    </div>
                </div>}
                {!(isLogin || isAnonymity) && <div>
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        right: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                        padding: "10px",
                        borderRadius: "5px",
                        maxWidth: "40%",
                        backgroundColor: "#eee"
                    }}>
                        <h1>{isClickedSignUp ? "회원가입" : "로그인"}</h1>
                        <input
                            type="email"
                            placeholder="이메일"
                            value={inputEmail}
                            onChange={(e) => setInputEmail(e.target.value)}
                            style={{ marginBottom: '10px', padding: '8px' }}
                        /><br />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                            style={{ marginBottom: '10px', padding: '8px' }}
                        /><br />
                        {isClickedSignUp ? (
                            <>
                                <button onClick={() => {
                                    signUp(inputEmail, inputPassword, boxes)
                                    setIsClickedSignUp(false)
                                }}>
                                    회원가입 하기
                                </button><br />
                                <button onClick={() => setIsClickedSignUp(false)}>뒤로가기</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => {
                                    signIn(inputEmail, inputPassword)
                                    firstLogin(`true`)
                                    setIsClickedSignUp(false)
                                }}>
                                    로그인
                                </button><br />
                                <button onClick={() => setIsClickedSignUp(true)}>회원가입</button>
                            </>
                        )}
                        <br /><br />
                        <button onClick={() => {
                            setIsAnonymity(true)
                            saveIsAnonymityStatus(true)
                            firstLogin(`remove`)
                        }}>로그인 없이 플레이하기</button>
                    </div>
                </div>}
            </div>
        </>
    )
}

export default SidePage6
