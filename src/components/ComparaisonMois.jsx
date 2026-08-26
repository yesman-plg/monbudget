import { useState } from 'react'
import Icon from './Icon'
import PeriodeSwitcher from './PeriodeSwitcher'
import {
  sommeMontants,
  sommeChargesFixesCeMois,
  montantCeMois,
  chargesVariablesDuMois,
  formatEuros,
} from '../utils/budget'

function moisPrecedentDe(periode) {
  return periode.mois === 1
    ? { mois: 12, annee: periode.annee - 1 }
    : { mois: periode.mois - 1, annee: periode.annee }
}

function calculerBilan(revenus, chargesFixes, chargesVariables, periode) {
  const dateReference = new Date(periode.annee, periode.mois - 1, 1)
  const totalRevenus = sommeMontants(revenus)
  const totalChargesFixes = sommeChargesFixesCeMois(chargesFixes, dateReference)
  const totalChargesVariables = sommeMontants(
    chargesVariablesDuMois(chargesVariables, dateReference)
  )
  const totalEpargne = chargesFixes
    .filter((c) => c.categorie === 'Épargne')
    .reduce((sum, c) => sum + montantCeMois(c, dateReference), 0)
  const resteAVivre = totalRevenus - totalChargesFixes - totalChargesVariables
  return { totalRevenus, totalChargesFixes, totalChargesVariables, totalEpargne, resteAVivre }
}

const LIGNES = [
  { cle: 'totalRevenus', label: 'Revenus', icon: 'payments', bonSiHausse: true },
  { cle: 'totalChargesFixes', label: 'Charges fixes', icon: 'push_pin', bonSiHausse: false },
  { cle: 'totalChargesVariables', label: 'Charges variables', icon: 'receipt_long', bonSiHausse: false },
  { cle: 'totalEpargne', label: 'Épargne', icon: 'trending_up', bonSiHausse: true },
  { cle: 'resteAVivre', label: 'Reste à vivre', icon: 'account_balance_wallet', bonSiHausse: true },
]

export default function ComparaisonMois({ revenus, chargesFixes, chargesVariables, periodeInitiale }) {
  const [periodeA, setPeriodeA] = useState(() => moisPrecedentDe(periodeInitiale))
  const [periodeB, setPeriodeB] = useState(periodeInitiale)

  const bilanA = calculerBilan(revenus, chargesFixes, chargesVariables, periodeA)
  const bilanB = calculerBilan(revenus, chargesFixes, chargesVariables, periodeB)

  return (
    <div className="analyse">
      <h3>
        <Icon name="compare_arrows" className="step-title-icon" />
        Comparer deux mois
      </h3>
      <p className="analyse-caption">Choisis les deux mois à comparer.</p>

      <div className="comparaison-periodes">
        <PeriodeSwitcher periode={periodeA} onChange={setPeriodeA} />
        <Icon name="arrow_forward" className="comparaison-vs-icon" />
        <PeriodeSwitcher periode={periodeB} onChange={setPeriodeB} />
      </div>

      <div className="analyse-rows">
        {LIGNES.map((ligne) => {
          const a = bilanA[ligne.cle]
          const b = bilanB[ligne.cle]
          const delta = b - a
          const deltaPct = a !== 0 ? (delta / Math.abs(a)) * 100 : null
          const hausse = delta > 0
          const bonneDirection = delta === 0 ? null : ligne.bonSiHausse ? hausse : !hausse
          const couleur = bonneDirection === null ? 'neutre' : bonneDirection ? 'bon' : 'mauvais'
          const icone = delta === 0 ? 'trending_flat' : hausse ? 'trending_up' : 'trending_down'

          return (
            <div className="analyse-row" key={ligne.cle}>
              <Icon name={ligne.icon} className="analyse-row-icon" />
              <div className="analyse-row-body">
                <div className="analyse-row-top">
                  <span className="analyse-row-label">{ligne.label}</span>
                  <span className={`comparaison-delta comparaison-delta-${couleur}`}>
                    <Icon name={icone} />
                    {delta > 0 ? '+' : ''}
                    {formatEuros(delta)}
                    {deltaPct !== null && ` (${deltaPct > 0 ? '+' : ''}${deltaPct.toFixed(0)}%)`}
                  </span>
                </div>
                <span className="analyse-row-sub">
                  {formatEuros(a)} → {formatEuros(b)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
