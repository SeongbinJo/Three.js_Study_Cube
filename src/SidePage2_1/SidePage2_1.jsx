import ModelCanvas from "./ModelCanvas"

function SidePage2_1() {
    return (
        <div className="model-box">
            <ModelCanvas></ModelCanvas>
            <div className='ver1-hovered-box' style={{ 
                position: 'absolute',   // absolute로 지정하여 캔버스 위에 띄움
                left: 30,               // 원하는 x 위치
                top: 90,                // 원하는 y 위치
                zIndex: 10             // 다른 요소들보다 위에 위치하도록 설정
            }}>
                [SidePage2_1_가동범위2] - ing<br />
                1. 가동범위_2 기능<br />
                - 회전 컨트롤러의 회전 가능 축의 제한(하나만 나오도록)<br />
                - 각도 조절(ing)
            </div>
        </div>
    )
}

export default SidePage2_1