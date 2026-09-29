import { useState } from 'react'

const MESSAGES_ERREUR = {
  invalid_pseudo: 'Le pseudo doit contenir 3 à 20 lettres, chiffres, _ ou -.',
  invalid_pin: 'Le code PIN doit contenir 4 à 6 chiffres.',
  wrong_pin: 'Pseudo ou code PIN incorrect.',
  pseudo_taken: 'Ce pseudo est déjà utilisé. Connecte-toi ou choisis-en un autre.',
  invalid_recovery: 'Le code de secours est incorrect.',
  locked: 'Trop de tentatives. Réessaie dans quelques minutes.',
  server_unavailable: 'Le serveur de connexion est indisponible. Réessaie.',
}

export default function LoginScreen({ onConnecter, onCreerCompte, onRecupererCompte }) {
  const [erreur, setErreur] = useState(null)
  const [enCours, setEnCours] = useState(false)
  const [pseudo, setPseudo] = useState('')
  const [pin, setPin] = useState('')
  const [codeSecours, setCodeSecours] = useState('')
  const [mode, setMode] = useState(null)

  function choisirMode(prochainMode) {
    setErreur(null)
    setMode(prochainMode)
  }

  async function soumettreConnexion(event) {
    event.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      const action = mode === 'creation' ? onCreerCompte : onConnecter
      await action({ pseudo, pin })
    } catch (err) {
      setErreur(MESSAGES_ERREUR[err?.code] ?? 'La connexion a échoué. Réessaie.')
    } finally {
      setEnCours(false)
    }
  }

  async function soumettreRecuperation(event) {
    event.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      await onRecupererCompte({ pseudo, recoveryCode: codeSecours, newPin: pin })
    } catch (err) {
      setErreur(MESSAGES_ERREUR[err?.code] ?? 'La récupération a échoué. Réessaie.')
    } finally {
      setEnCours(false)
    }
  }

  const titre = mode === 'creation' ? 'Créer un compte' : mode === 'recuperation' ? 'Récupérer le compte' : 'Se connecter'

  return (
    <div className="login-screen">
      <div className="login-card">
        <img
          className="login-logo"
          src={`${import.meta.env.BASE_URL}logo-budget-2026.png`}
          alt="My Budget"
        />
        <h1>Mon budget mensuel</h1>
        <p className="login-hint">
          Retrouve ton budget sur tous tes appareils avec ton pseudo et ton code PIN.
        </p>
        {mode === null ? (
          <div className="login-actions">
            <button type="button" className="btn-pin" onClick={() => choisirMode('connexion')}>
              Se connecter
            </button>
            <button type="button" className="btn-secondary-login" onClick={() => choisirMode('creation')}>
              Créer un compte
            </button>
          </div>
        ) : mode === 'recuperation' ? (
          <form className="login-form" onSubmit={soumettreRecuperation}>
            <p className="login-form-title">{titre}</p>
            <p className="login-form-description">Un nouveau code de secours sera généré.</p>
            <label htmlFor="pseudo">Pseudo</label>
            <input
              id="pseudo"
              name="pseudo"
              type="text"
              value={pseudo}
              onChange={(event) => setPseudo(event.target.value)}
              autoComplete="username"
              minLength="3"
              maxLength="20"
              pattern="[a-zA-Z0-9_-]+"
              required
            />
            <label htmlFor="code-secours">Code de secours</label>
            <input
              id="code-secours"
              name="code-secours"
              type="text"
              value={codeSecours}
              onChange={(event) => setCodeSecours(event.target.value)}
              autoComplete="off"
              required
            />
            <label htmlFor="pin">Nouveau code PIN</label>
            <input
              id="pin"
              name="pin"
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              autoComplete="new-password"
              inputMode="numeric"
              minLength="4"
              maxLength="6"
              pattern="[0-9]{4,6}"
              required
            />
            <button type="submit" className="btn-pin" disabled={enCours}>
              {enCours ? 'Patiente…' : 'Réinitialiser mon PIN'}
            </button>
            <button type="button" className="login-back" onClick={() => choisirMode('connexion')} disabled={enCours}>
              Retour
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={soumettreConnexion}>
            <p className="login-form-title">{titre}</p>
            <label htmlFor="pseudo">Pseudo</label>
            <input
              id="pseudo"
              name="pseudo"
              type="text"
              value={pseudo}
              onChange={(event) => setPseudo(event.target.value)}
              autoComplete="username"
              minLength="3"
              maxLength="20"
              pattern="[a-zA-Z0-9_-]+"
              required
            />
            <label htmlFor="pin">Code PIN</label>
            <input
              id="pin"
              name="pin"
              type="password"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              autoComplete={mode === 'creation' ? 'new-password' : 'current-password'}
              inputMode="numeric"
              minLength="4"
              maxLength="6"
              pattern="[0-9]{4,6}"
              required
            />
            <button type="submit" className="btn-pin" disabled={enCours}>
              {enCours ? 'Patiente…' : mode === 'creation' ? 'Créer mon compte' : 'Se connecter'}
            </button>
            {mode === 'connexion' && (
              <button type="button" className="login-link" onClick={() => choisirMode('recuperation')}>
                PIN oublié ?
              </button>
            )}
            <button type="button" className="login-back" onClick={() => choisirMode(null)} disabled={enCours}>
              Retour
            </button>
          </form>
        )}
        {erreur && <p className="login-erreur">{erreur}</p>}
      </div>
    </div>
  )
}
