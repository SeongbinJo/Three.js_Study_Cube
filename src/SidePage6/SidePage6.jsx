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
import { getAllDocuments, setBlockStatus } from "./firebase"

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

    const [isAnonymity, setIsAnonymity] = useState(() => {
        const getIsAnonymity = localStorage.getItem(`isAnonymity`)

        if (getIsAnonymity) {
            return JSON.parse(getIsAnonymity)
        }

        return false
    })
    const [isLogin, setIsLogin] = useState(() => {
        // firestore에서 isLogin 가져와서 초기 값 저장
    })
    const [isClickedSignUp, setIsClickedSignUp] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const saveIsAnonymityStatus = (isAnonymity) => {
        const savedStatus = localStorage.setItem(`isAnonymity`, JSON.stringify(isAnonymity))
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [isBoxesLoaded, setIsBoxesLoaded] = useState(false)
    const bottomCount = 20
    const [boxes, setBoxes] = useState()

    useEffect(() => {
        async function loadBoxes() {
            const savedBoxes = await getAllDocuments(0)
            if (savedBoxes) {
                // console.log('저장된 boxes가 firestore에 있음 :', savedBoxes)
                setBoxes(savedBoxes)
                setIsBoxesLoaded(true)
            } else {
                const localSavedBoxes = localStorage.getItem("boxes0")
                if (localSavedBoxes) {
                    console.log('firestore에 저장파일이 없고(로그인 문제), 로컬 스토리지에 존재함. 가져옴')
                    setBoxes(JSON.parse(localSavedBoxes))
                } else {
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

                    setBoxes(boxModels)
                }
            }
        }

        loadBoxes()
    }, [])

    useEffect(() => {
        if (
            localStorage.getItem('boxes0') === null &&
            localStorage.getItem('boxes1') === null &&
            localStorage.getItem('boxes2') === null
        ) {
            for (let i = 0; i < 3; i++) {
                // localStorage 저장
                localStorage.setItem(`boxes${i}`, JSON.stringify(boxes))

                // firestore 저장
                setBlockStatus(boxes, i)
            }
        }
    }, [])

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
        }

        const savedBox0 = localStorage.getItem(`boxes0`)
        const savedBox1 = localStorage.getItem(`boxes1`)
        const savedBox2 = localStorage.getItem(`boxes2`)

        return [JSON.parse(savedBox0), JSON.parse(savedBox1), JSON.parse(savedBox2)]
    })
    const [currentSlot, setCurrentSlot] = useState(0)

    const [isGrid, setIsGrid] = useState(false)

    const [swatches, setSwatches] = useState(Array(5).fill("#ffffff"))
    const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(null)

    const [backgroundColor, setBackgroundColor] = useState("#ffffff")

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "e" || e.key === "E") {
                setShowInventory(prev => !prev)
            }

            if (e.key === "q" || e.key === "Q") {
                setShowMenu(prev => !prev)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    const handleColorChange = (newColor) => {
        setColor(newColor.hex)
        if (selectedSwatchIndex !== null) {
            const newSwatches = [...swatches]
            newSwatches[selectedSwatchIndex] = newColor.hex
            setSwatches(newSwatches)
        }
    }


    const saveSlot = (slotIndex) => {
        if (isAnonymity) { // '로그인 없이 플레이' 인 경우
            // 해당 슬롯의 boxes 상태를 로컬스토리지에 저장
            localStorage.setItem(`boxes${slotIndex}`, JSON.stringify(boxes))

            // firestore에도 저장
            // if (isLogin) {
                setBlockStatus(boxes, slotIndex)
            // }

            // savedSlots 배열도 업데이트
            const newSavedSlots = [...savedSlots]
            newSavedSlots[slotIndex] = boxes
            setSavedSlots(newSavedSlots)



            // firestore 테스트
            setBlockStatus(boxes, currentSlot)
        }
    }

    useEffect(() => {
        // 현재 슬롯에 해당하는 boxes 데이터를 로컬스토리지에서 불러오기, firestore에 있다면 그것 우선으로
        async function loadBoxes() {
            const savedBoxes = await getAllDocuments(currentSlot)
            if (savedBoxes) {
                // console.log('저장된 boxes가 firestore에 있음 :', savedBoxes)
                setBoxes(savedBoxes)
                setIsBoxesLoaded(true)
            } else {
                const localSavedBoxes = localStorage.getItem(`boxes${currentSlot}`)
                if (localSavedBoxes) {
                    console.log('firestore에 저장파일이 없고(로그인 문제), 로컬 스토리지에 존재함. 가져옴')
                    setBoxes(JSON.parse(localSavedBoxes))
                } else {
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

                    setBoxes(boxModels)
                }
            }
        }

        loadBoxes()
    }, [currentSlot])  // currentSlot이 변경될 때마다 실행




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
                            onClick={() => saveSlot(currentSlot)}
                        >
                            현재 상태 저장
                        </button>
                    </div>
                </div>}
                {!isAnonymity && <div>
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
                                    setIsClickedSignUp(false)
                                }}>
                                    회원가입 하기
                                </button><br />
                                <button onClick={() => setIsClickedSignUp(false)}>뒤로가기</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => {
                                    setIsClickedSignUp(false)
                                    setIsAuthenticated(true)
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
