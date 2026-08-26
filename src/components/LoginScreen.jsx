import { useState } from 'react'
import Icon from './Icon'
import GoogleIcon from './GoogleIcon'

export default function LoginScreen({ onConnecter }) {
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)

  async function gererConnexion() {
    setErreur(null)
    setEnCours(true)
    try {
      await onConnecter()
    } catch {
      setErreur('La connexion a échoué. Réessaie.')
    } finally {
      setEnCours(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <span className="app-mark app-mark-lg">
          <Icon name="account_balance_wallet" />
        </span>
        <h1>Mon budget mensuel</h1>
        <p className="login-hint">
          Connecte-toi pour retrouver ton budget sur tous tes appareils.
        </p>
        <button
          type="button"
          className="btn-google"
          onClick={gererConnexion}
          disabled={enCours}
        >
          <GoogleIcon />
          Se connecter avec Google
        </button>
        {erreur && <p className="login-erreur">{erreur}</p>}
      </div>
    </div>
  )
}
