import { useState, useEffect, useRef, Suspense } from "react"
import '../App.css'
import CanvasBox from './CanvasBox'
import './Crosshair.css'
import { SketchPicker } from "react-color"
import { Canvas, useThree } from "@react-three/fiber"
import * as THREE from "three"
import SidePage6Model from "./SidePage6Model"
import { Physics } from "@react-three/rapier"
import { OrbitControls } from "@react-three/drei"
import { getAllDocuments, signUp, signIn, logOut, setBlockStatus } from "./firebase"
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function SidePage6() {


    const [viewDirection, setViewDirection] = useState("front")

    // 로그인 관련 ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 창 나올 조건:
    // 가입 안 하거나(isAuthenticated), 처음 들어온 사람(isAnonymity)이거나.

    // 1. 가입 안 하고 '로그인 없이 플레이' 누르면 다시 false로 바꿀 수 없게 만들면(로컬 스토리지에 저장)
    // 새로고침하거나 다시 들어와도 로컬로 플레이 가능                                                  :: 완
    // 2. 이 사람들은 설정이나 저장 창에 추가할 로그인하기를 눌렀을때 회원가입 가능

    // 3. 가입하면 firestore 계정 저장, 로그인하면 isLogin = true로 firestore 저장
    // 4. 새로고침하거나 다시 들어올 경우 isLogin 필드 참조해서 자동 로그인

    const auth = getAuth()
    const [userUID, setUserUID] = useState(`null`)



    const [isAnonymity, setIsAnonymity] = useState(() => {
        const getIsAnonymity = localStorage.getItem(`isAnonymity`)

        if (getIsAnonymity) {
            return JSON.parse(getIsAnonymity)
        }

        return false
    })
    const [isLogin, setIsLogin] = useState(false)
    const [isClickedSignUp, setIsClickedSignUp] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const saveIsAnonymityStatus = (isAnonymity) => {
        const savedStatus = localStorage.setItem(`isAnonymity`, JSON.stringify(isAnonymity))
    }

    onAuthStateChanged(auth, (user) => {
        // 로그인 상태가 바뀔 때 마다 콜백
        if (user) {

            setUserUID(`${user.uid}`)
            setIsLogin(true)
            console.log(`현재 로그인 된 유저: `, userUID)
        } else {
            setIsLogin(false)
            console.log(`로그인 안되어 있음`)
        }
    })
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [isBoxesLoaded, setIsBoxesLoaded] = useState(false)
    const bottomCount = 20
    const [boxes, setBoxes] = useState()

    async function loadFirestoreBoxes(uid) {
        console.log(uid)
        const savedBoxes = await getAllDocuments(uid, 0)
        if (savedBoxes) {
            console.log(`loadFirestoreBoxes 내부, 가져온 savedBoxes: `, savedBoxes)
            setBoxes(savedBoxes)
            setIsBoxesLoaded(true)
        }
    }

    // isLogin, isAnonymity에 따라 나중에 조건을 달아줘야함함
    useEffect(() => {

        if (isLogin) {
            console.log(`islogin 내부`)
            loadFirestoreBoxes(userUID)
        } else if (isAnonymity) {
            console.log(`isAnonymity 내부`)
            const localSavedBoxes = localStorage.getItem("boxes0")
            if (localSavedBoxes) {
                console.log('firestore에 로그인 되어있지 않고, 로컬 스토리지에 존재함. 가져옴')
                setBoxes(JSON.parse(localSavedBoxes))
                setIsBoxesLoaded(true)
            }
        } else {
            console.log(`나머지 내부`)
            const boxModels = []
            const centerOffset = (bottomCount - 1) / 2

            for (let i = 0; i < bottomCount; i++) {
                for (let j = 0; j < bottomCount; j++) {
                    const x = i - centerOffset
                    const z = j - centerOffset
                    boxModels.push({
                        id: `${i}-${j}`,
                        position: [x, 0, z],
                        color: "white"
                    })
                }
            }

            if (
                localStorage.getItem('boxes0') === null &&
                localStorage.getItem('boxes1') === null &&
                localStorage.getItem('boxes2') === null
            ) {
                for (let i = 0; i < 3; i++) {
                    // localStorage 저장
                    localStorage.setItem(`boxes${i}`, JSON.stringify(boxModels))
                }
            }

            setBoxes(boxModels)
            setIsBoxesLoaded(true)
        }


    }, [isLogin, isAnonymity])


    const [createBoxBtn, setCreateBoxBtn] = useState(false)

    const [color, setColor] = useState("#ffffff")

    const [showInventory, setShowInventory] = useState(false)

    const [showMenu, setShowMenu] = useState(false)

    const [savedSlots, setSavedSlots] = useState(() => {
        if (isLogin) {
            const savedBox0 = getAllDocuments(0)
            const savedBox1 = getAllDocuments(1)
            const savedBox2 = getAllDocuments(2)

            return [savedBox0, savedBox1, savedBox2]
        } else if (isAnonymity) {
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
                const [data0, data1, data2] = await Promise.all([
                    getAllDocuments(userUID, 0),
                    getAllDocuments(userUID, 1),
                    getAllDocuments(userUID, 2)
                ])
                setAllBoxData({
                    boxes0: data0,
                    boxes1: data1,
                    boxes2: data2
                })
            }
            fetchAllBoxes()
        }
    }, [isLogin])


    useEffect(() => {
        if (isLogin) {
            const key = `boxes${currentSlot}`
            if (allBoxData[key]) {
                setBoxes(allBoxData[key])
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

            setAllBoxData(prev => ({
                ...prev,
                [`boxes${currentSlot}`]: boxes, // 현재 상태의 boxes를 해당 슬롯에 덮어쓰기
            }))
        }

        if (isAnonymity) {
            // 해당 슬롯의 boxes 상태를 로컬스토리지에 저장
            localStorage.setItem(`boxes${slotIndex}`, JSON.stringify(boxes))
        }

        // savedSlots 배열도 업데이트
        // const newSavedSlots = [...savedSlots]
        // newSavedSlots[slotIndex] = boxes
        // setSavedSlots(newSavedSlots)
    }

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
                    4. Q - 로컬 저장 및 저장 슬롯 변경경

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
                        maxWidth: "40%",
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
                                marginTop: "20px",
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
                        <button
                            style={{
                                marginTop: "20px",
                                padding: "10px",
                                width: "100%",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                if (isLogin) {
                                    setShowMenu(prev => !prev)
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ marginBottom: '10px', padding: '8px' }}
                        /><br />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ marginBottom: '10px', padding: '8px' }}
                        /><br />
                        {isClickedSignUp ? (
                            <>
                                <button onClick={() => {
                                    signUp(email, password, boxes)
                                    setIsClickedSignUp(false)
                                }}>
                                    회원가입 하기
                                </button><br />
                                <button onClick={() => setIsClickedSignUp(false)}>뒤로가기</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => {
                                    signIn(email, password)
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
                        }}>로그인 없이 플레이하기</button>
                    </div>
                </div>}
            </div>
        </>
    )
}

export default SidePage6
