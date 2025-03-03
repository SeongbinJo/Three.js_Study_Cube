import { useState } from 'react'
import './Ver6NavBar.css'

function Ver6NavBar({ searchedModel }) {
    const [searcehdId, setSearchedId] = useState("")

    const searchBarHandler = () => {
        if (searcehdId.trim()) {
          searchedModel(searcehdId)
        }
      }

    return (
        <div className='navbar'>
            <div className='navbar-left'>
                <button className='nav-button'>메뉴 1</button>
                <button className='nav-button'>메뉴 2</button>
                <button className='nav-button'>메뉴 3</button>
            </div>
            <div className='navbar-right'>
                <input 
                type='text' 
                placeholder='검색...' 
                className='nav-search' 
                value={searcehdId}
                onChange={(e) => setSearchedId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchBarHandler}
                />
                <button className='nav-button' onClick={searchBarHandler}>찾기</button>
            </div>
        </div>
    )
}

export default Ver6NavBar