import { getDocs, doc, collection} from 'firebase/firestore/lite'
import { db } from '../../firebase'

export async function getAllDocuments() {
    try {
      const colRef = collection(db, 'item') // 'item' 컬렉션
      const snapshot = await getDocs(colRef)
  
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
  
      console.log('Firestore 문서들:', documents)
      return documents
    } catch (error) {
      console.error('Firestore 문서 가져오기 실패:', error)
      return []
    }
  }