import Icon from './Icon'
import {
  CATEGORIES_CHARGES_FIXES,
  CATEGORIES_CHARGES_VARIABLES,
  MOIS,
  sommeMontants,
  sommeChargesFixesCeMois,
  montantCeMois,
  formatEuros,
} from '../utils/budget'

export default function StepResume({
  revenus,
  chargesFixes,
  chargesVariables,
  onReinitialiserMois,
  periode,
  dateReference = new Date(),
}) {
  const totalRevenus = sommeMontants(revenus)
  const totalChargesFixes = sommeChargesFixesCeMois(chargesFixes, dateReference)
  const totalChargesVariables = sommeMontants(chargesVariables)
  const resteAVivre = totalRevenus - totalChargesFixes - totalChargesVariables
  const partChargesFixes =
    totalRevenus > 0 ? (totalChargesFixes / totalRevenus) * 100 : 0

  let statutReste = 'good'
  if (resteAVivre < 0) statutReste = 'critical'
  else if (partChargesFixes > 60) statutReste = 'warning'

  const chargesFixesPrelevees = chargesFixes
    .filter((c) => c.preleve)
    .reduce((sum, c) => sum + montantCeMois(c, dateReference), 0)
  const chargesFixesAVenir = totalChargesFixes - chargesFixesPrelevees

  const variablesPayees = chargesVariables
    .filter((c) => c.paye)
    .reduce((sum, c) => sum + (Number(c.montant) || 0), 0)

  const totalEpargne = chargesFixes
    .filter((c) => c.categorie === 'Épargne')
    .reduce((sum, c) => sum + montantCeMois(c, dateReference), 0)
  const partEpargne = totalRevenus > 0 ? (totalEpargne / totalRevenus) * 100 : 0

  const parCategorie = CATEGORIES_CHARGES_FIXES.map((cat) => ({
    categorie: cat.id,
    icon: cat.icon,
    color: cat.color,
    colorDark: cat.colorDark,
    montant: chargesFixes
      .filter((c) => c.categorie === cat.id)
      .reduce((sum, c) => sum + montantCeMois(c, dateReference), 0),
  }))
    .filter((c) => c.montant > 0)
    .sort((a, b) => b.montant - a.montant)

  const maxCategorie = Math.max(...parCategorie.map((c) => c.montant), 1)

  const parCategorieVariable = CATEGORIES_CHARGES_VARIABLES.map((cat) => ({
    categorie: cat.id,
    icon: cat.icon,
    color: cat.color,
    colorDark: cat.colorDark,
    montant: chargesVariables
      .filter((c) => c.categorie === cat.id)
      .reduce((sum, c) => sum + (Number(c.montant) || 0), 0),
  }))
    .filter((c) => c.montant > 0)
    .sort((a, b) => b.montant - a.montant)

  const maxCategorieVariable = Math.max(...parCategorieVariable.map((c) => c.montant), 1)

  const statutIcone = { good: 'check_circle', warning: 'warning', critical: 'error' }[statutReste]
  const statutTexte = {
    good: 'Équilibré',
    warning: 'Charges fixes élevées',
    critical: 'Budget négatif',
  }[statutReste]

  return (
    <section className="step">
      <h2>
        <Icon name="bar_chart" className="step-title-icon" />
        Résumé {periode ? `— ${MOIS[periode.mois - 1]} ${periode.annee}` : 'du mois'}
      </h2>

      <div className="stat-tiles">
        <div className="stat-tile stat-tile-revenus">
          <Icon name="payments" className="stat-tile-icon" />
          <span className="stat-tile-label">Revenus</span>
          <span className="stat-tile-value">{formatEuros(totalRevenus)}</span>
        </div>
        <div className="stat-tile stat-tile-fixes">
          <Icon name="push_pin" className="stat-tile-icon" />
          <span className="stat-tile-label">Charges fixes</span>
          <span className="stat-tile-value">{formatEuros(totalChargesFixes)}</span>
          <span className="stat-tile-sub">
            {partChargesFixes.toFixed(0)}% des revenus · {formatEuros(chargesFixesAVenir)} à venir
          </span>
        </div>
        <div className="stat-tile stat-tile-variables">
          <Icon name="receipt_long" className="stat-tile-icon" />
          <span className="stat-tile-label">Charges variables</span>
          <span className="stat-tile-value">{formatEuros(totalChargesVariables)}</span>
          <span className="stat-tile-sub">{formatEuros(variablesPayees)} déjà passées</span>
        </div>
        <div className="stat-tile stat-tile-epargne">
          <Icon name="trending_up" className="stat-tile-icon" />
          <span className="stat-tile-label">Épargne</span>
          <span className="stat-tile-value">{formatEuros(totalEpargne)}</span>
          <span className="stat-tile-sub">{partEpargne.toFixed(0)}% des revenus</span>
        </div>
        <div className={`stat-tile stat-tile-${statutReste}`}>
          <Icon name={statutIcone} className="stat-tile-icon" />
          <span className="stat-tile-label">Reste à vivre</span>
          <span className="stat-tile-value">{formatEuros(resteAVivre)}</span>
          <span className="stat-tile-sub">{statutTexte}</span>
        </div>
      </div>

      {parCategorie.length > 0 && (
        <div className="breakdown">
          <h3>Charges fixes par catégorie (ce mois-ci)</h3>
          <div className="breakdown-bars" role="table" aria-label="Charges fixes par catégorie">
            {parCategorie.map((c) => (
              <div
                className="breakdown-row"
                key={c.categorie}
                role="row"
                style={{ '--chip-color': c.color, '--chip-color-dark': c.colorDark }}
              >
                <span className="breakdown-label" role="cell">
                  <Icon name={c.icon} />
                  {c.categorie}
                </span>
                <div className="breakdown-bar-track" role="cell">
                  <div
                    className="breakdown-bar-fill"
                    style={{ width: `${(c.montant / maxCategorie) * 100}%` }}
                  />
                </div>
                <span className="breakdown-value" role="cell">{formatEuros(c.montant)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {parCategorieVariable.length > 0 && (
        <div className="breakdown">
          <h3>Dépenses variables par catégorie</h3>
          <div className="breakdown-bars" role="table" aria-label="Dépenses variables par catégorie">
            {parCategorieVariable.map((c) => (
              <div
                className="breakdown-row"
                key={c.categorie}
                role="row"
                style={{ '--chip-color': c.color, '--chip-color-dark': c.colorDark }}
              >
                <span className="breakdown-label" role="cell">
                  <Icon name={c.icon} />
                  {c.categorie}
                </span>
                <div className="breakdown-bar-track" role="cell">
                  <div
                    className="breakdown-bar-fill"
                    style={{ width: `${(c.montant / maxCategorieVariable) * 100}%` }}
                  />
                </div>
                <span className="breakdown-value" role="cell">{formatEuros(c.montant)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="reset-mois">
        <button type="button" className="btn-reset-mois" onClick={onReinitialiserMois}>
          <Icon name="restart_alt" />
          Réinitialiser le mois
        </button>
        <p className="reset-mois-hint">
          Vide le journal des charges variables et repasse les charges fixes à
          "À venir". Les charges fixes elles-mêmes ne sont pas supprimées.
        </p>
      </div>
    </section>
  )
}
