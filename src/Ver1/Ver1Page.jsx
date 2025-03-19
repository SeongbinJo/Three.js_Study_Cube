import '../App.css'
import Ver1CanvasBox from './Ver1CanvasBox'

function Ver1Page() {
    return (
        <>
        <div className='model-box'>
            <Ver1CanvasBox yModelCount={3} xModelCount={4} spacing={1.5}></Ver1CanvasBox>
            <div className='ver1-hovered-box' style={{ 
                position: 'absolute',   // absolute로 지정하여 캔버스 위에 띄움
                left: 30,               // 원하는 x 위치
                top: 30,                // 원하는 y 위치
                zIndex: 10             // 다른 요소들보다 위에 위치하도록 설정
            }}>
                [Ver1] - 25.02.06<br />
                box 모델의 치아 배열과 같이 배치
            </div>
        </div>
        </>
    )
}

export default Ver1Page