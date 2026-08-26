import { useState } from 'react'
import Icon from './Icon'
import StepIndicator from './StepIndicator'
import PeriodeSwitcher from './PeriodeSwitcher'
import StepRevenus from './StepRevenus'
import StepChargesFixes from './StepChargesFixes'
import StepChargesVariables from './StepChargesVariables'
import StepResume from './StepResume'
import { useCloudBudget } from '../hooks/useCloudBudget'
import { estDansLaPeriode } from '../utils/budget'

const NB_ETAPES = 4

function periodeParDefaut() {
  const d = new Date()
  return { mois: d.getMonth() + 1, annee: d.getFullYear() }
}

export default function BudgetApp({ user, onDeconnecter }) {
  const { data, creerSetter } = useCloudBudget(user.uid)
  const [etape, setEtape] = useState(0)

  const setRevenus = creerSetter('revenus')
  const setChargesFixes = creerSetter('chargesFixes')
  const setChargesVariables = creerSetter('chargesVariables')
  const setPeriode = creerSetter('periode')

  if (!data) {
    return (
      <div className="app">
        <p className="chargement">Chargement de ton budget…</p>
      </div>
    )
  }

  const { revenus, chargesFixes, chargesVariables } = data
  const periode = data.periode ?? periodeParDefaut()
  const dateReference = new Date(periode.annee, periode.mois - 1, 1)

  function suivant() {
    setEtape((e) => Math.min(e + 1, NB_ETAPES - 1))
  }

  function precedent() {
    setEtape((e) => Math.max(e - 1, 0))
  }

  function allerA(index) {
    setEtape(index)
  }

  function reinitialiserMois() {
    const confirme = window.confirm(
      'Réinitialiser ce mois ?\n\n' +
        '• Les dépenses variables de ce mois-ci seront supprimées (les autres mois ne sont pas touchés)\n' +
        '• Les charges fixes repassent à "À venir"\n\n' +
        'Cette action est irréversible.'
    )
    if (!confirme) return

    setChargesVariables((items) => items.filter((i) => !estDansLaPeriode(i, dateReference)))
    setChargesFixes((fixes) => fixes.map((c) => ({ ...c, preleve: false })))
  }

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-mark">
          <Icon name="account_balance_wallet" />
        </span>
        <h1>Mon budget mensuel</h1>
        <PeriodeSwitcher periode={periode} onChange={setPeriode} />
        <button
          type="button"
          className="btn-compte"
          onClick={onDeconnecter}
          aria-label="Se déconnecter"
          title={user.email ?? 'Se déconnecter'}
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="avatar" referrerPolicy="no-referrer" />
          ) : (
            <Icon name="account_circle" />
          )}
        </button>
      </header>

      <StepIndicator etapeActuelle={etape} onGoTo={allerA} />

      <main className="app-content">
        {etape === 0 && <StepRevenus revenus={revenus} setRevenus={setRevenus} />}
        {etape === 1 && (
          <StepChargesFixes
            chargesFixes={chargesFixes}
            setChargesFixes={setChargesFixes}
            dateReference={dateReference}
          />
        )}
        {etape === 2 && (
          <StepChargesVariables
            chargesVariables={chargesVariables}
            setChargesVariables={setChargesVariables}
            dateReference={dateReference}
          />
        )}
        {etape === 3 && (
          <StepResume
            revenus={revenus}
            chargesFixes={chargesFixes}
            chargesVariables={chargesVariables}
            onReinitialiserMois={reinitialiserMois}
            periode={periode}
            dateReference={dateReference}
          />
        )}
      </main>

      <footer className="app-nav">
        <button
          type="button"
          className="btn-secondary"
          onClick={precedent}
          disabled={etape === 0}
        >
          <Icon name="arrow_back" />
          Précédent
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={suivant}
          disabled={etape === NB_ETAPES - 1}
        >
          Suivant
          <Icon name="arrow_forward" />
        </button>
      </footer>
    </div>
  )
}
