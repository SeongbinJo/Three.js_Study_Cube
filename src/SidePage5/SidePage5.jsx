import { useState } from "react"
import '../App.css'
import CanvasBox from './CanvasBox'
import { SketchPicker } from "react-color"

function SidePage5() {
    const [viewDirection, setViewDirection] = useState("front")
    const [createBoxBtn, setCreateBoxBtn] = useState(false)
    const [color, setColor] = useState("#ffffff")

    return (
        <>
            <div className='model-box'>
                <CanvasBox bottomCount={20} viewDirection={viewDirection} createBoxBtn={createBoxBtn} setCreateBoxBtn={setCreateBoxBtn} />
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
                        <button onClick={() => setViewDirection("front")}>앞</button>
                        <button onClick={() => setViewDirection("back")}>뒤</button>
                        <button onClick={() => setViewDirection("left")}>왼쪽</button>
                        <button onClick={() => setViewDirection("right")}>오른쪽</button>
                    </div>
                </div>
                <div
                    style={{
                        position: "absolute",
                        top: 50,
                        right: 50,
                        zIndex: 10,
                        backgroundColor: "white",
                        padding: "10px",
                        borderRadius: "5px",
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
                    <div style={{ marginTop: "30px" }}>
                        <SketchPicker color={color} onChange={(color) => setColor(color.hex)} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SidePage5
