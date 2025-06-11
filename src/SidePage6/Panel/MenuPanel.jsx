import "../css/MenuPanel.css"

function MenuPanel({
    savedSlots,
    currentSlot,
    setCurrentSlot,
    saveSlot,
    userUID,
    isLogin,
    roomID,
    userRole,
    joinRoomClick,
    inputRoomId,
    setInputRoomId,
    joinRoom,
    quitRoom,
    createRoomId,
    removeRoom,
    usersInRoom,
    setUsersInRoom,
    setShowMenu,
    setBasicModelLocalStorage,
    firstLogin,
    socketRef,
    logOut,
    setIsLogin,
    saveIsAnonymityStatus,
    setIsAnonymity,
    exportBoxesToFile,
    boxes,
    joinRoomClickHandler
}) {
    return (
        <div className="menu-panel">
            {/* 덩어리 A: 저장 슬롯 및 저장 버튼 */}
            <div className="save-section">
                <h3 style={{
                    margin: "0px",
                    // fontSize: "15px"
                }}>저장</h3>
                {savedSlots.map((slot, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentSlot(index)}
                        className={`slot ${currentSlot === index ? "active" : ""}`}
                    >
                        Slot {index + 1}
                    </div>
                ))}
                <button className="menu-button save-button" onClick={() => saveSlot(currentSlot, userUID)}>
                    현재 상태 저장
                </button>
            </div>

            {/* 덩어리 B: 방 관련 UI */}
            <div className="room-section">
                {isLogin && (
                    <>
                        <div className="room-buttons">
                            <button className="menu-button create" onClick={createRoomId}>
                                방 만들기
                            </button>
                            <button className="menu-button join" onClick={() => !roomID && joinRoomClickHandler()}>
                                들어가기
                            </button>
                        </div>

                        {roomID && userRole.isHost && (
                            <div className="room-info">
                                <div className="room-id">{roomID}</div>
                                <button className="menu-button delete" onClick={removeRoom}>
                                    방 삭제
                                </button>
                            </div>
                        )}

                        {joinRoomClick && !userRole.isHost && (
                            <div className="room-join">
                                <input
                                    className="input-id"
                                    type="text"
                                    value={inputRoomId}
                                    onChange={(e) => setInputRoomId(e.target.value)}
                                    disabled={userRole.isParticipant}
                                    placeholder="방 ID 입력"
                                />
                                <button
                                    className="menu-button delete"
                                    onClick={() =>
                                        userRole.isParticipant ? (quitRoom(), setUsersInRoom({})) : joinRoom()
                                    }
                                    style={{
                                        backgroundColor: userRole.isParticipant ? "#dc3545" : "#007bff"
                                    }}
                                >
                                    {userRole.isParticipant ? "나가기" : "참가"}
                                </button>
                            </div>
                        )}

                        {Object.keys(usersInRoom).length > 0 && (
                            <div className="user-list">
                                {Object.entries(usersInRoom).map(([email]) => (
                                    <div key={email} className="user-item">{email}</div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 덩어리 C: 로그인/로그아웃, 추출 */}
            <div className="setting-section">
                <button
                    className="menu-button"
                    style={{ backgroundColor: isLogin ? "#FC3F3F" : "#7ED321" }}
                    onClick={() => {
                        if (isLogin) {
                            setShowMenu(prev => !prev)
                            setBasicModelLocalStorage()
                            firstLogin("remove")
                            socketRef.current.disconnect()
                            logOut()
                        } else {
                            setShowMenu(prev => !prev)
                            setIsLogin(false)
                            saveIsAnonymityStatus(false)
                            setIsAnonymity(false)
                        }
                    }}
                >
                    {isLogin ? "로그아웃" : "로그인"}
                </button>
                <button className="menu-button" onClick={() => exportBoxesToFile(boxes)}>
                    3D 파일 추출
                </button>
            </div>
        </div>
    )
}

export default MenuPanel



// function MenuPanel({
//     savedSlots,
//     currentSlot,
//     setCurrentSlot,
//     saveSlot,
//     userUID,
//     isLogin,
//     roomID,
//     userRole,
//     joinRoomClick,
//     inputRoomId,
//     setInputRoomId,
//     joinRoom,
//     quitRoom,
//     createRoomId,
//     removeRoom,
//     usersInRoom,
//     setUsersInRoom,
//     setShowMenu,
//     setBasicModelLocalStorage,
//     firstLogin,
//     socketRef,
//     logOut,
//     setIsLogin,
//     saveIsAnonymityStatus,
//     setIsAnonymity,
//     exportBoxesToFile,
//     boxes,
//     joinRoomClickHandler
// }) {
//     return (
//         <div style={{
//             position: "absolute",
//             top: "50%",
//             right: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: 10,
//             padding: "10px",
//             borderRadius: "5px",
//             maxWidth: "50%",
//             minWidth: "30%",
//             backgroundColor: "#eee"
//         }}>
//             <h3>저장 슬롯</h3>
//             {savedSlots.map((slot, index) => (
//                 <div
//                     key={index}
//                     onClick={() => setCurrentSlot(index)}
//                     style={{
//                         padding: "10px",
//                         marginBottom: "10px",
//                         border: currentSlot === index ? "2px solid blue" : "1px solid gray",
//                         cursor: "pointer",
//                         backgroundColor: slot ? "#cce5ff" : "#f8f9fa",
//                     }}
//                 >
//                     저장 슬롯 {index + 1}
//                 </div>
//             ))}
//             <button
//                 style={{ marginTop: "30px", padding: "10px", width: "100%", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}
//                 onClick={() => saveSlot(currentSlot, userUID)}
//             >
//                 현재 상태 저장
//             </button>


//             {isLogin && (
//                 <div
//                     style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         marginTop: "10px",
//                     }}
//                 >
//                     <button
//                         style={{
//                             padding: "10px",
//                             width: "48%",
//                             backgroundColor: "#28a745",
//                             color: "white",
//                             border: "none",
//                             cursor: "pointer",
//                         }}
//                         onClick={() => {
//                             createRoomId()
//                         }}
//                     >
//                         방 만들기
//                     </button>
//                     <button
//                         style={{
//                             padding: "10px",
//                             width: "48%",
//                             backgroundColor: "#17a2b8",
//                             color: "white",
//                             border: "none",
//                             cursor: "pointer",
//                         }}
//                         onClick={() => {
//                             if (!roomID) {
//                                 joinRoomClickHandler()
//                             }
//                         }}
//                     >
//                         들어가기
//                     </button>
//                 </div>
//             )}
//             {isLogin && roomID && userRole.isHost && (
//                 <div
//                     style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         marginTop: "10px",
//                         width: "100%",
//                     }}
//                 >
//                     <div
//                         style={{
//                             height: "40px",
//                             lineHeight: "40px",
//                             width: "60%",
//                             backgroundColor: "#6c757d",
//                             color: "white",
//                             textAlign: "center",
//                             padding: "0 10px", // 좌우 여백만 주고 상하는 제거
//                             boxSizing: "border-box",
//                         }}
//                     >
//                         {roomID}
//                     </div>
//                     <button
//                         style={{
//                             height: "40px",
//                             width: "30%",
//                             backgroundColor: "#dc3545",
//                             color: "white",
//                             border: "none",
//                             cursor: "pointer",
//                         }}
//                         onClick={() => {
//                             removeRoom()
//                         }}
//                     >
//                         방 삭제
//                     </button>
//                 </div>
//             )}
//             {isLogin && joinRoomClick && !userRole.isHost && (
//                 <div
//                     style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         marginTop: "10px",
//                         width: "100%",
//                     }}
//                 >
//                     <input
//                         type="text"
//                         placeholder="방 ID 입력"
//                         value={inputRoomId}
//                         onChange={(e) => setInputRoomId(e.target.value)}
//                         disabled={userRole.isParticipant}
//                         style={{
//                             height: "40px",
//                             lineHeight: "40px",
//                             width: "60%",
//                             padding: "0 10px",
//                             boxSizing: "border-box",
//                             border: "1px solid #ccc",
//                         }}
//                     />
//                     <button
//                         style={{
//                             height: "40px",
//                             width: "30%",
//                             backgroundColor: userRole.isParticipant ? `#dc3545` : `#007bff`,
//                             color: "white",
//                             border: "none",
//                             cursor: "pointer",
//                         }}
//                         onClick={() => {
//                             if (userRole.isParticipant) {
//                                 quitRoom()
//                                 setUsersInRoom({})
//                             } else {
//                                 joinRoom()
//                             }
//                         }}
//                     >
//                         {userRole.isParticipant ? `나가기` : `참가`}
//                     </button>
//                 </div>
//             )}
//             {isLogin && Object.keys(usersInRoom).length > 0 && (
//                 <div
//                     style={{
//                         width: "100%",
//                         marginTop: "10px",
//                         display: "grid",
//                         gridTemplateColumns: "1fr 1fr",
//                         gap: "10px",
//                     }}
//                 >
//                     {Object.entries(usersInRoom).map(([email, cameraPos]) => (
//                         <div
//                             key={email}
//                             style={{
//                                 backgroundColor: "#f1f1f1",
//                                 padding: "10px",
//                                 borderRadius: "4px",
//                                 textAlign: "center",
//                                 border: "1px solid #ccc",
//                             }}
//                         >
//                             {email}
//                         </div>
//                     ))}
//                 </div>
//             )}
//             <button
//                 style={{
//                     marginTop: "10px",
//                     padding: "10px",
//                     width: "100%",
//                     backgroundColor: isLogin ? "#FC3F3F" : "#7ED321",
//                     color: "white",
//                     border: "none",
//                     cursor: "pointer",
//                 }}
//                 onClick={() => {
//                     if (isLogin) {
//                         setShowMenu(prev => !prev)
//                         setBasicModelLocalStorage()
//                         firstLogin(`remove`)
//                         socketRef.current.disconnect()
//                         logOut()
//                     } else {
//                         setShowMenu(prev => !prev)
//                         setIsLogin(false)
//                         saveIsAnonymityStatus(false)
//                         setIsAnonymity(false)
//                     }
//                 }}
//             >
//                 {isLogin ? "로그아웃" : "로그인"}
//             </button>
//             <button
//                 style={{
//                     marginTop: "10px",
//                     padding: "10px",
//                     width: "100%",
//                     backgroundColor: "#007bff",
//                     color: "white",
//                     border: "none",
//                     cursor: "pointer",
//                 }}
//                 onClick={() => {
//                     exportBoxesToFile(boxes)
//                 }}
//             >
//                 3D 파일 추출
//             </button>
//         </div>
//     )
// }


// export default MenuPanel