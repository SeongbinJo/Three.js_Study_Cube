import './App.css'
import Ver1CanvasBox from './CanvasBox/Ver1CanvasBox'

function Ver1Page() {
    return (
        <>
        <div className='model-box'>
            <Ver1CanvasBox yModelCount={3} xModelCount={4} spacing={1.5}></Ver1CanvasBox>
        </div>
        </>
    )
}

export default Ver1Page