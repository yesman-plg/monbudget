import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

/**
 * État de connexion Firebase.
 * user === undefined -> chargement initial
 * user === null      -> déconnecté
 * user === {...}     -> connecté
 */
export function useAuth() {
  const [user, setUser] = useState(undefined)

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  function connecter() {
    return signInWithPopup(auth, googleProvider)
  }

  function deconnecter() {
    return signOut(auth)
  }

  return { user, connecter, deconnecter }
}
