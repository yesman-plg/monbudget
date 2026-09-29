import './App.css'
import { useAuth } from './hooks/useAuth'
import LoginScreen from './components/LoginScreen'
import BudgetApp from './components/BudgetApp'
import RecoveryCodeScreen from './components/RecoveryCodeScreen'

export default function App() {
  const {
    user,
    recoveryCode,
    connecter,
    creerCompte,
    recupererCompte,
    deconnecter,
    confirmerCodeSecours,
  } = useAuth()

  if (user === undefined) {
    return (
      <div className="app">
        <p className="chargement">Chargement…</p>
      </div>
    )
  }

  if (user === null) {
    return (
      <LoginScreen
        onConnecter={connecter}
        onCreerCompte={creerCompte}
        onRecupererCompte={recupererCompte}
      />
    )
  }

  if (recoveryCode) {
    return <RecoveryCodeScreen code={recoveryCode} onContinuer={confirmerCodeSecours} />
  }

  return <BudgetApp user={user} onDeconnecter={deconnecter} />
}
