import SidePageModel4 from "./SidePageModel4"

function SidePage4() {
    return (
        <div className="model-box">
            <SidePageModel4></SidePageModel4>
            <div className='ver1-hovered-box' style={{ 
                position: 'absolute',   // absolute로 지정하여 캔버스 위에 띄움
                left: 30,               // 원하는 x 위치
                top: 90,                // 원하는 y 위치
                zIndex: 10             // 다른 요소들보다 위에 위치하도록 설정
            }}>
                [SidePage4_축 제한 이동] - ing<br />
                1. 모델의 특정한 축으로 특정한 범위 내의 이동 구현<br />
            </div>
        </div>
    )
}

export default SidePage4