import './App.css'
import CanvasBox from './CanvasBox/CanvasBox'

function Ver1Page() {
    return (
        <>
        <div className='model-box'>
            <CanvasBox yModelCount={3} xModelCount={4} spacing={1.5}></CanvasBox>
        </div>
        </>
    )
}

export default Ver1Page