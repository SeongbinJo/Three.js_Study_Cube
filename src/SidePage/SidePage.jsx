import ModelCanvas from "./ModelCanvas"

function SidePage() {
    return (
        <div className="model-box">
            <ModelCanvas></ModelCanvas>
            <div className='ver1-hovered-box' style={{ 
                position: 'absolute',   // absolute로 지정하여 캔버스 위에 띄움
                left: 30,               // 원하는 x 위치
                top: 90,                // 원하는 y 위치
                zIndex: 10             // 다른 요소들보다 위에 위치하도록 설정
            }}>
                [SidePage_투과] - 25.03.14<br />
                1. 투명화 기능 시도 1 <br />- 투명화 블럭을 마우스의 y축 위치에 따라다니게끔 추가.(뒷 두개의 면이 안 보임, 실패)<br />
                2. 투명화 기능 시도 2 <br />- 투명화 블럭의 윗면과 아랫면을 박스 모델의 색으로 지정(이론과 같이 적용되지 않음, 실패)<br />
                3. 투명화 기능 시도 3 <br />- 투명화 블럭이 아닌, 박스의 면의 일부분을 2d 로 투명화(뒷 두개의 면이 그대로 안 보임, 실패)
            </div>
        </div>
        
    )
}

export default SidePage