import { useState } from 'react'

export default function RecoveryCodeScreen({ code, onContinuer }) {
  const [copie, setCopie] = useState(false)

  async function copier() {
    try {
      await navigator.clipboard.writeText(code)
      setCopie(true)
    } catch {
      setCopie(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card recovery-card">
        <img
          className="login-logo"
          src={`${import.meta.env.BASE_URL}logo-budget-2026.png`}
          alt="My Budget"
        />
        <h1>Note ton code de secours</h1>
        <p className="login-hint">
          Il est affiché une seule fois. Il permet de changer ton PIN si tu l’oublies.
        </p>
        <p className="recovery-code-value">{code}</p>
        <button type="button" className="btn-secondary-login" onClick={copier}>
          {copie ? 'Copié !' : 'Copier le code'}
        </button>
        <button type="button" className="btn-pin" onClick={onContinuer}>
          J’ai noté ce code
        </button>
      </div>
    </div>
  )
}
