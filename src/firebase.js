import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBU9O0z4ZrtvXYJTiwBDh9dMElYJR2CyMU',
  authDomain: 'budget-dde21.firebaseapp.com',
  projectId: 'budget-dde21',
  storageBucket: 'budget-dde21.firebasestorage.app',
  messagingSenderId: '165232538547',
  appId: '1:165232538547:web:90818b7ed8b456f4dd51c6',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
