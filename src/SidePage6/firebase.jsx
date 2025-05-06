import { getDocs, doc, collection, setDoc, getDoc} from 'firebase/firestore/lite'
import { db } from '../../firebase'

export async function getAllDocuments(index) {
  try {
    const colRef = collection(db, 'Users', 'UserID', 'Test-User-ID', 'BlockStatus', `boxes${index}`)
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


  export async function setBlockStatus(boxes, index) {
    try {
        await setDoc(doc(db, `Users`, `UserID`, `Test-User-ID` ,`BlockStatus` ,`boxes${index}`, `boxes${index}-0`), {
            boxes: boxes,
            updatedAt: new Date().toISOString(),
        })
        console.log(`Firestore - BlockStatus/testid 문서에 저장 완료`)
    } catch (error) {
        console.log(`Firestore 저장 실패 : `, error)
    }
  }

  // TODO:
  // 회원가입 시 Users/UserID/유저의 ID/BlockStatus/boxes0 ~ 2 를 생성하는 함수 만들어야 함.(파이어스토어 불러와 렌더링 테스트 완료 후)