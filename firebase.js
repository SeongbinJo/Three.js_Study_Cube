import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'

const firebaseConfig = {
    // firebase 설정과 관련된 개인 정보
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITEP_FIREBASE_MEASUREMENT_ID,
  }

// firebaseConfig 정보로 firebase 시작
const app = initializeApp(firebaseConfig)

// firebase의 firestore 인스턴스를 변수에 저장
const db = getFirestore(app)

export { db }