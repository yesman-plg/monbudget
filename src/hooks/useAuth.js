import { useEffect, useState } from 'react'
import { pb, usersCollection } from '../pocketbaseConfig'

/**
 * État de connexion PocketBase.
 * user === undefined -> chargement initial
 * user === null      -> déconnecté
 * user === {...}     -> connecté
 */
export function useAuth() {
  const [user, setUser] = useState(pb.authStore.record ?? null)

  useEffect(() => {
    // pb.authStore est déjà réhydraté de façon synchrone en mémoire (via
    // localStorage) dès la création du client — l'état initial du useState
    // ci-dessus est donc déjà correct, pas besoin de le resynchroniser ici.
    return pb.authStore.onChange((_token, record) => {
      setUser(record ?? null)
    })
  }, [])

  function connecter() {
    return pb.collection(usersCollection).authWithOAuth2({ provider: 'google' })
  }

  function deconnecter() {
    pb.authStore.clear()
    return Promise.resolve()
  }

  return { user, connecter, deconnecter }
}
