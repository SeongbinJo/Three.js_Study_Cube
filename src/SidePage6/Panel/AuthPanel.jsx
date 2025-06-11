import "../css/AuthPanel.css"

function AuthPanel({
  isClickedSignUp,
  setIsClickedSignUp,
  inputEmail,
  setInputEmail,
  inputPassword,
  setInputPassword,
  signUp,
  signIn,
  firstLogin,
  setIsAnonymity,
  saveIsAnonymityStatus,
  boxes
}) {
  return (
    <div className="auth-panel-wrapper">
      <div className="auth-panel">
        {/* 덩어리 A: 제목 + 입력 */}
        <div className="auth-section form">
          <h1>{isClickedSignUp ? "회원가입" : "로그인"}</h1>
          <input
            type="email"
            placeholder="이메일"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
          />
        </div>

        {/* 덩어리 B: 로그인/회원가입 버튼 */}
        <div className="auth-section buttons">
          {isClickedSignUp ? (
            <>
              <button onClick={() => {
                signUp(inputEmail, inputPassword, boxes)
                setIsClickedSignUp(false)
              }}>회원가입 하기</button>
              <button onClick={() => setIsClickedSignUp(false)}>뒤로가기</button>
            </>
          ) : (
            <>
              <button onClick={() => {
                signIn(inputEmail, inputPassword)
                firstLogin("true")
                setIsClickedSignUp(false)
              }}>로그인</button>
              <button onClick={() => setIsClickedSignUp(true)}>회원가입</button>
            </>
          )}
        </div>

        {/* 게스트 로그인 버튼 */}
        <button
          className="guest-button"
          onClick={() => {
            setIsAnonymity(true)
            saveIsAnonymityStatus(true)
            firstLogin("remove")
          }}
        >
          로그인 없이 플레이하기
        </button>
      </div>
    </div>
  );
}

export default AuthPanel