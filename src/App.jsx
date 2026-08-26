import './App.css'
import { useAuth } from './hooks/useAuth'
import LoginScreen from './components/LoginScreen'
import BudgetApp from './components/BudgetApp'

export default function App() {
  const { user, connecter, deconnecter } = useAuth()

  if (user === undefined) {
    return (
      <div className="app">
        <p className="chargement">Chargement…</p>
      </div>
    )
  }

  if (user === null) {
    return <LoginScreen onConnecter={connecter} />
  }

  return <BudgetApp user={user} onDeconnecter={deconnecter} />
}
