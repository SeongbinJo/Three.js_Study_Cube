import './Ver4HelpButton.css'

function Ver4HelpButton() {

    const clickHelpButton = () => {
        console.log(`Help button clicked.`)
    }

    return (
        <button className='help-button' onClick={clickHelpButton}>?</button>
    )
}

export default Ver4HelpButton