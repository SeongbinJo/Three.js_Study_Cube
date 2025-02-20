import './Ver5HelpButton.css'

function Ver5HelpButton() {

    const clickHelpButton = () => {
        console.log(`Help button clicked.`)
    }

    return (
        <button className='help-button' onClick={clickHelpButton}>?</button>
    )
}

export default Ver5HelpButton