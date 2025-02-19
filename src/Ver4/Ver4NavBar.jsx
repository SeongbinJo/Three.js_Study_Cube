import './Ver4NavBar.css'

function Ver4NavBar() {
    return (
        <div className='navbar'>
            <div className='navbar-left'>
                <button className='nav-button'>메뉴 1</button>
                <button className='nav-button'>메뉴 2</button>
                <button className='nav-button'>메뉴 3</button>
            </div>
            <div className='navbar-right'>
                <input type='text' placeholder='검색...' className='nav-search' />
            </div>
        </div>
    )
}

export default Ver4NavBar