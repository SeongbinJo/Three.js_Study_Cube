import ModelCanvas from "./ModelCanvas"

function SidePage3() {
    return (
        <div className="model-box">
            <ModelCanvas></ModelCanvas>
            <div className='ver1-hovered-box' style={{ 
                position: 'absolute',   // absolute로 지정하여 캔버스 위에 띄움
                left: 30,               // 원하는 x 위치
                top: 90,                // 원하는 y 위치
                zIndex: 10             // 다른 요소들보다 위에 위치하도록 설정
            }}>
                [SidePage3_Inverse Kinetic] - ing<br />
                1. Inverse Kinetic(가동범위의 물리법칙 실패로 로봇팔과 같이 관절의 기능을 구현하는 IK 시도 중)<br />
                - 여러가지 실험 중입니다.<br />
            </div>
        </div>
    )
}

export default SidePage3