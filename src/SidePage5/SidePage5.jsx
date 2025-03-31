import '../App.css'
import CanvasBox from './CanvasBox'

function SidePage5() {
    return (
        <>
        <div className='model-box'>
            <CanvasBox bottomCount={10}></CanvasBox>
            <div className='ver1-hovered-box' style={{ 
                position: 'absolute',   // absolute로 지정하여 캔버스 위에 띄움
                left: 30,               // 원하는 x 위치
                top: 30,                // 원하는 y 위치
                zIndex: 10             // 다른 요소들보다 위에 위치하도록 설정
            }}>
                [SidePage5_Minecraft] - ing<br />
                1. 기본 바탕이 되는 바닥(수정O) 생성_ing<br />
                2. 카메라 고정 및 동서남북 시점 변환_ing
            </div>
        </div>
        </>
    )
}

export default SidePage5