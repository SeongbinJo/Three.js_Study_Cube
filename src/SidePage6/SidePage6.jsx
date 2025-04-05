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

    return (
        <>
            <div className='sidePage5-box'>
                <CanvasBox bottomCount={20} viewDirection={viewDirection} createBoxBtn={createBoxBtn} setCreateBoxBtn={setCreateBoxBtn} boxColor={color} />
                <div className="dot"></div>
                <div className='ver1-hovered-box' style={{
                    position: 'absolute',
                    left: 30,
                    top: 30,
                    zIndex: 10
                }}>
                    [SidePage5_Minecraft] - ing<br />
                    1. 기본 바탕이 되는 바닥(수정O) 생성_ing<br />
                    2. 카메라 고정 및 동서남북 시점 변환_ing<br />

                    <div style={{ marginTop: '10px' }}>
                        <button style={{ marginRight: '10px' }} onClick={() => setViewDirection("front")}>앞</button>
                        <button style={{ marginRight: '10px' }} onClick={() => setViewDirection("back")}>뒤</button>
                        <button style={{ marginRight: '10px' }} onClick={() => setViewDirection("left")}>왼쪽</button>
                        <button style={{ marginRight: '10px' }} onClick={() => setViewDirection("right")}>오른쪽</button>
                        <button style={{ marginRight: '10px' }} onClick={() => setViewDirection("top")}>위</button>
                        <button style={{ marginRight: '10px' }} onClick={() => setViewDirection("bottom")}>아래</button>
                    </div>
                </div>
                {/* <div
                    style={{
                        position: "absolute",
                        top: 50,
                        right: 50,
                        zIndex: 10,
                        backgroundColor: "green",
                        padding: "10px",
                        borderRadius: "5px",
                        maxWidth: "15%"
                    }}
                >
                    <button
                        onClick={() => {
                            console.log("생성 버튼 클릭.")
                            setCreateBoxBtn(true)
                        }}
                    >
                        생성
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
                    <div style={{ marginTop: "20px" }}>
                        <SketchPicker color={color} disableAlpha={true} onChange={(color) => setColor(color.hex)} />
                    </div>
                </div> */}
            </div>
        </>
    )
}

export default SidePage6
