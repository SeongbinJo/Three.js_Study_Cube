import '../App.css'
import './Ver2HoveredBox.css'
import Ver2CanvasBox from './Ver2CanvasBox';
import { useState } from 'react';

function Ver2Page() {
  const [hoveredData, setHoveredData] = useState({ hovered: false, x: 0, y: 0, id: ""})

  const hoverHandler = (hovered, x, y, id = "") => {
    setHoveredData({hovered, x, y, id})
  }

  return (
    <>
      <div className="model-box">
        <Ver2CanvasBox yModelCount={3} xModelCount={4} spacing={1.5} setHoveredData={hoverHandler} />
        {hoveredData.hovered && (
          <div className='ver2-hovered-box'
            style={{
              left: hoveredData.x + 30,
              top: hoveredData.y - 130,
            }}>
              {hoveredData.id}
            </div>
        )}
        <div className='ver1-hovered-box' style={{ 
                position: 'absolute',   // absolute로 지정하여 캔버스 위에 띄움
                left: 30,               // 원하는 x 위치
                top: 30,                // 원하는 y 위치
                zIndex: 10             // 다른 요소들보다 위에 위치하도록 설정
            }}>
                [Ver2] - 25.02.12<br />
                1. 마우스 hover할 경우 해당 모델의 id 팝업 및 투명도 조절<br />
                2. 팝업된 id 창 마우스 따라다님
            </div>
      </div>
    </>
  )
}

export default Ver2Page