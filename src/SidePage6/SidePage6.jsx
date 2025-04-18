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

function SidePage6() {
    const [viewDirection, setViewDirection] = useState("front")

    const [createBoxBtn, setCreateBoxBtn] = useState(false)

    const [color, setColor] = useState("#ffffff")

    const [showInventory, setShowInventory] = useState(false)

    const [isGrid, setIsGrid] = useState(false)

    const [swatches, setSwatches] = useState(Array(5).fill("#ffffff"))
    const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(null)

    const [backgroundColor, setBackgroundColor] = useState("#ffffff")

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "e" || e.key === "E") {
                setShowInventory(prev => !prev)
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

    return (
        <>
            <div className='sidePage5-box'>
                <CanvasBox
                    bottomCount={20}
                    viewDirection={viewDirection}
                    createBoxBtn={createBoxBtn}
                    setCreateBoxBtn={setCreateBoxBtn}
                    boxColor={color}
                    showInventory={showInventory}
                    isGrid={isGrid}
                    backgroundColor={backgroundColor}
                />
                <div className="dot"></div>
                <div className='ver1-hovered-box' style={{
                    position: 'absolute',
                    left: 30,
                    top: 30,
                    zIndex: 10
                }}>
                    [SidePage6_Minecraft2] - ing<br />
                    1. 기본 바탕이 되는 바닥 생성<br />
                    2. 카메라 고정 및 동서남북 시점 변환<br />
                    3. w(전진), s(후진), a(왼쪽), d(오른쪽), LCtrl(하강), Space-bar(상승) :: 키보드 및 마우스로 카메라 조작

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
            </div>
        </>
    )
}

export default SidePage6
