import ModelCanvas from "./ModelCanvas"

function SidePage2() {
    return (
        <div className="model-box">
            <ModelCanvas></ModelCanvas>
            <div className='ver1-hovered-box' style={{ 
                position: 'absolute',   // absolute로 지정하여 캔버스 위에 띄움
                left: 30,               // 원하는 x 위치
                top: 90,                // 원하는 y 위치
                zIndex: 10             // 다른 요소들보다 위에 위치하도록 설정
            }}>
                [SidePage2_가동범위] - 25.03.19<br />
                1. 가동범위 기능<br />
                - 캡슐 형태의 모델을 회전시켜 회색의 박스 모델에 접촉시키면 충돌을 감지하는 문장이 나옴(개발자 모드)<br />
                - 충돌 감지 후, 물리법칙 적용하는 부분 실패(회전 컨트롤러의 회전각 제어, 물리법칙 적용. 실패)
            </div>
        </div>
    )
}

export default SidePage2