import './Ver7HelpButton.css'

function Ver7HelpButton() {

    const clickHelpButton = () => {
        console.log(`Help button clicked.`)
    }

    return (
        <button className='help-button' onClick={clickHelpButton}>?</button>
    )
}

export default Ver7HelpButton