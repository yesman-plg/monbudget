import { useEffect, useState } from 'react'
import { appelerApi } from '../api'

/**
 * État de connexion de l'API homelab par pseudo et PIN.
 * user === undefined -> chargement initial
 * user === null      -> déconnecté
 * user === {...}     -> connecté
 */
export function useAuth() {
  const [user, setUser] = useState(undefined)
  const [recoveryCode, setRecoveryCode] = useState(null)

  useEffect(() => {
    let annule = false
    appelerApi('/me')
      .then((compte) => {
        if (!annule) setUser(compte)
      })
      .catch(() => {
        if (!annule) setUser(null)
      })
    return () => {
      annule = true
    }
  }, [])

  async function connecter(identifiants) {
    const compte = await appelerApi('/budget/auth/login', {
      method: 'POST',
      body: JSON.stringify(identifiants),
    })
    setUser(compte)
    return compte
  }

  async function creerCompte(identifiants) {
    const compte = await appelerApi('/budget/auth/register', {
      method: 'POST',
      body: JSON.stringify(identifiants),
    })
    setUser(compte)
    setRecoveryCode(compte.recoveryCode)
    return compte
  }

  async function recupererCompte(identifiants) {
    const compte = await appelerApi('/recover', {
      method: 'POST',
      body: JSON.stringify(identifiants),
    })
    setUser(compte)
    setRecoveryCode(compte.recoveryCode)
    return compte
  }

  async function deconnecter() {
    try {
      await appelerApi('/logout', { method: 'POST' })
    } finally {
      setRecoveryCode(null)
      setUser(null)
    }
  }

  return {
    user,
    recoveryCode,
    connecter,
    creerCompte,
    recupererCompte,
    deconnecter,
    confirmerCodeSecours: () => setRecoveryCode(null),
  }
}
