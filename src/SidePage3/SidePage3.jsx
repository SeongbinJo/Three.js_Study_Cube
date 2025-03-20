import SidePageModel3 from "./SidePageModel3"

function SidePage3() {
    return (
        <div className="model-box">
            <SidePageModel3></SidePageModel3>
            <div className='ver1-hovered-box' style={{ 
                position: 'absolute',   // absolute로 지정하여 캔버스 위에 띄움
                left: 30,               // 원하는 x 위치
                top: 90,                // 원하는 y 위치
                zIndex: 10             // 다른 요소들보다 위에 위치하도록 설정
            }}>
                [SidePage3_물리법칙] - ing<br />
                1. 물리법칙(가동범위의 물리법칙 실패로 기본적인 물리법칙에 대한 이해를 높이고자 만듦)<br />
                - 여러가지 실험 중입니다.<br />
            </div>
        </div>
    )
}

export default SidePage3