import { useState } from 'react'
import './Ver6NavBar.css'
import { useEffect } from 'react'
import { useRef } from 'react'

function Ver6NavBar({ searchedModel, eventBoxButtons }) {
    const [searcehdId, setSearchedId] = useState("")
    const [allKeys, setAllKeys] = useState([])
    const [filteredKeys, setFilteredKeys] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)

    const searchContainerRef = useRef(null)

    useEffect(() => {
        const keys = []
        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i))
        }
        setAllKeys(keys)
    }, [])

    useEffect(() => {
        if (searcehdId.trim() === "") {
            setFilteredKeys(allKeys)
        } else {
            const matchingKeys = allKeys.filter(key => key.includes(searcehdId))
            setFilteredKeys(matchingKeys)

            const storageKeys = allKeys.filter(key => {
                const storageValue = localStorage.getItem(key)
                if (storageValue) {
                    try {
                        const parsedValue = JSON.parse(storageValue)
                        return parsedValue.status && parsedValue.status.includes(searcehdId)
                    } catch (e) {
                        console.error("로컬스토리지 데이터 파싱 오류:", e)
                        return false
                    }
                }
                return false
            })

            if (storageKeys.length > 0) {
                console.log('hi')
                const formattedKeys = storageKeys.map(key => {
                    const storageValue = localStorage.getItem(key)
                    try {
                        const parsedValue = JSON.parse(storageValue)
                        const states = parsedValue.status ? parsedValue.status.join(", ") : "상태 없음"
                        return `${key} :: ${states}`
                    } catch (e) {
                        return `${key} :: 저장된 값 없음`
                    }
                })
                setFilteredKeys(formattedKeys)
            }
        }
    }, [searcehdId, allKeys])


    const searchBarHandler = () => {
        if (searcehdId.trim()) {
            searchedModel(searcehdId)
        }
    }

    const inputClickHandler = () => {
        setShowDropdown(true)
    }

    const listClickHandler = (key) => {
        const realKey = key.split(" :: ")[0]
        setSearchedId(realKey)
        setShowDropdown(false)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)
            ) {
                setShowDropdown(false)
            }
        }

        window.addEventListener('click', handleClickOutside)
        return () => window.removeEventListener('click', handleClickOutside)
    }, [])

    return (
        <div className='navbar'>
            <div className='navbar-left'>
                <button className='nav-button'>메뉴 1</button>
                <button className='nav-button'>메뉴 2</button>
                <button className='nav-button'>메뉴 3</button>
            </div>
            <div className='navbar-right' ref={searchContainerRef}>
                <input
                    type='text'
                    placeholder='검색...'
                    className='nav-search'
                    value={searcehdId}
                    onChange={(e) => setSearchedId(e.target.value)}
                    onClick={inputClickHandler}
                    onKeyDown={(e) => e.key === "Enter" && searchBarHandler}
                />
                {showDropdown && (
                    <div className="dropdown-list">
                        {filteredKeys.length > 0 ? (
                            filteredKeys.map((key, index) => (
                                <div
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => listClickHandler(key)}
                                >
                                    {key}
                                </div>
                            ))
                        ) : (
                            <div className="dropdown-item">결과 없음</div>
                        )}
                    </div>
                )}
                <button className='nav-button' onClick={searchBarHandler}>찾기</button>
            </div>
        </div>
    )
}

export default Ver6NavBar