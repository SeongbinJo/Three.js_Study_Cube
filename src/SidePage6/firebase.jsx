import { getDocs, doc, collection, setDoc, getDoc } from 'firebase/firestore/lite'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { db } from '../../firebase'

export async function getAllDocuments(uid, index) {
  try {
    const colRef = collection(db, 'Users', 'UserID', `${uid}`, 'BlockStatus', `boxes${index}`)
    const snapshot = await getDocs(colRef)

    if (snapshot.empty) {
      console.log('Users 컬렉션에 문서가 없습니다')
      return []
    }

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // console.log('모든 Users 문서:', users[0].boxes)
    return users[0].boxes
  } catch (error) {
    console.error('Users 문서 가져오기 실패:', error)
    return []
  }
}


export async function setBlockStatus(boxes, index, uid) {
  try {
    await setDoc(doc(db, `Users`, `UserID`, `${uid}`, `BlockStatus`, `boxes${index}`, `boxes${index}-0`), {
      boxes: boxes,
      updatedAt: new Date().toISOString(),
    })

    console.log(`Firestore - BlockStatus/testid 문서에 저장 완료`)
  } catch (error) {
    console.log(`Firestore 저장 실패 : `, error)
  }
}

// boxes는 기본 바닥을 넣어야함함
export async function signUp(email, password, boxes) {
  const auth = getAuth() // Firebase의 인증 객체를 가져옴옴

  try {
    // email, password 로 계정을 생성
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user // 생성된 유저 정보 가져옴
    console.log(`회원가입 성공`, user.uid)

    // Firestore에 유저 데이터 넣기
    for (let i = 0; i < 3; i++) {
      setBlockStatus(boxes, i, user.uid, email)
    }

    await setDoc(doc(db, `Users`, `UserID`, `${user.uid}`, `UserEmail`), {
      email: email,
      signUpTimestamp: new Date().toISOString(),
    })

    logOut()

    return { success: true, uid: user.uid }
  } catch (error) {
    console.error(`회원가입 실패: `, error.message)
    return { success: false, error: error.message }
  }
}

export async function signIn(email, password) {
  const auth = getAuth()

  try {
    // email, password로 로그인
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    console.log(`로그인 성공: `, user.uid)

    return { success: true, uid: user.uid, email: user.email }
  } catch (error) {
    console.error(`로그인 실패: `, error.message)

    return { success: false, error: error.message }
  }
}

export async function logOut() {
  const auth = getAuth()

  try {
    await signOut(auth)
    console.log(`로그아웃 성공`)
  } catch (error) {
    console.error(`로그아웃 실패: `, error.message)
  }
}


// 유저 email 가져오기
export async function fetchUserEmail(uid) {
  try {
    const emailDocRef = doc(db, `Users`, `UserID`, uid, `UserEmail`)
    const emailDocSnap = await getDoc(emailDocRef)

    if (emailDocSnap.exists()) {
      const data = emailDocSnap.data()
      console.log(`이메일 가져오기 성공: `, data.email)
      return data.email
    } else {
      console.warn(`해당 유저의 이메일 문서가 존재하지 않음.`)
    }
  } catch (error) {
    console.error(`이메일 가져오기 실패: `, error)
  }
}