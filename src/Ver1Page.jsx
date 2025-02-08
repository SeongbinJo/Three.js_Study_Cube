import './App.css'
import Ver13DModel from './CanvasBox/Ver13DModel'

function Ver1Page() {
    return (
        <>
        <div className='model-box'>
            <Ver13DModel yModelCount={3} xModelCount={4} spacing={1.5}></Ver13DModel>
        </div>
        </>
    )
}