import Icon from './Icon'
import ComparaisonMois from './ComparaisonMois'
import {
  CATEGORIES_CHARGES_FIXES,
  CATEGORIES_CHARGES_VARIABLES,
  MOIS,
  sommeMontants,
  sommeChargesFixesCeMois,
  montantCeMois,
  estPreleveeCeMois,
  chargesVariablesDuMois,
  moisPrecedent,
  joursRestants,
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
  const variablesDuMois = chargesVariablesDuMois(chargesVariables, dateReference)

  const totalRevenus = sommeMontants(revenus)
  const totalChargesFixes = sommeChargesFixesCeMois(chargesFixes, dateReference)
  const totalChargesVariables = sommeMontants(variablesDuMois)
  const resteAVivre = totalRevenus - totalChargesFixes - totalChargesVariables
  const partChargesFixes =
    totalRevenus > 0 ? (totalChargesFixes / totalRevenus) * 100 : 0

  let statutReste = 'good'
  if (resteAVivre < 0) statutReste = 'critical'
  else if (partChargesFixes > 60) statutReste = 'warning'

  const chargesFixesPrelevees = chargesFixes
    .filter((c) => estPreleveeCeMois(c, dateReference))
    .reduce((sum, c) => sum + montantCeMois(c, dateReference), 0)
  const chargesFixesAVenir = totalChargesFixes - chargesFixesPrelevees

  const variablesPayees = variablesDuMois
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
    montant: variablesDuMois
      .filter((c) => c.categorie === cat.id)
      .reduce((sum, c) => sum + (Number(c.montant) || 0), 0),
  }))
    .filter((c) => c.montant > 0)
    .sort((a, b) => b.montant - a.montant)

  const maxCategorieVariable = Math.max(...parCategorieVariable.map((c) => c.montant), 1)

  const statutTexte = {
    good: 'Équilibré',
    warning: 'Charges fixes élevées',
    critical: 'Budget négatif',
  }[statutReste]

  // --- Analyse ---

  const tauxEpargne = partEpargne
  const niveauEpargne = tauxEpargne >= 20 ? 'bon' : tauxEpargne >= 10 ? 'correct' : 'faible'
  const labelEpargne = { bon: 'Excellent', correct: 'Correct', faible: 'Faible' }[niveauEpargne]

  const montantLogement = chargesFixes
    .filter((c) => c.categorie === 'Logement')
    .reduce((sum, c) => sum + montantCeMois(c, dateReference), 0)
  const tauxEffortLogement = totalRevenus > 0 ? (montantLogement / totalRevenus) * 100 : 0
  // Le seuil bancaire strict (33 %) sert à l'octroi de crédit, pas à un budget
  // au quotidien — on ne signale "Élevé" qu'au-delà d'une marge plus tolérante.
  const logementDansLaNorme = tauxEffortLogement <= 38

  const pctEssentiel = totalRevenus > 0 ? ((totalChargesFixes - totalEpargne) / totalRevenus) * 100 : 0
  const pctPlaisirs = totalRevenus > 0 ? (totalChargesVariables / totalRevenus) * 100 : 0
  const pctEpargneRegle = tauxEpargne

  const resteParJour = resteAVivre / joursRestants(dateReference)

  const dateMoisPrecedent = moisPrecedent(dateReference)
  const totalVariablesMoisPrecedent = sommeMontants(
    chargesVariablesDuMois(chargesVariables, dateMoisPrecedent)
  )
  const evolutionVariables =
    totalVariablesMoisPrecedent > 0
      ? ((totalChargesVariables - totalVariablesMoisPrecedent) / totalVariablesMoisPrecedent) * 100
      : null

  return (
    <section className="step">
      <h2>
        <Icon name="bar_chart" className="step-title-icon" />
        Résumé {periode ? `— ${MOIS[periode.mois - 1]} ${periode.annee}` : 'du mois'}
      </h2>

      <div className="stat-tiles">
        <div className="stat-tile stat-tile-revenus">
          <span className="stat-tile-label">Revenus</span>
          <span className="stat-tile-value">{formatEuros(totalRevenus)}</span>
        </div>
        <div className="stat-tile stat-tile-fixes">
          <span className="stat-tile-label">Charges fixes</span>
          <span className="stat-tile-value">{formatEuros(totalChargesFixes)}</span>
          <span className="stat-tile-sub">
            {partChargesFixes.toFixed(0)}% des revenus · {formatEuros(chargesFixesAVenir)} à venir
          </span>
        </div>
        <div className="stat-tile stat-tile-variables">
          <span className="stat-tile-label">Charges variables</span>
          <span className="stat-tile-value">{formatEuros(totalChargesVariables)}</span>
          <span className="stat-tile-sub">{formatEuros(variablesPayees)} déjà passées</span>
        </div>
        <div className="stat-tile stat-tile-epargne">
          <span className="stat-tile-label">Épargne</span>
          <span className="stat-tile-value">{formatEuros(totalEpargne)}</span>
          <span className="stat-tile-sub">{partEpargne.toFixed(0)}% des revenus</span>
        </div>
        <div className={`stat-tile stat-tile-${statutReste}`}>
          <span className="stat-tile-label">Reste à vivre</span>
          <span className="stat-tile-value">{formatEuros(resteAVivre)}</span>
          <span className={`stat-tile-pill stat-tile-pill-${statutReste}`}>{statutTexte}</span>
        </div>
      </div>

      {parCategorie.length > 0 && (
        <div className="breakdown">
          <h3>Charges fixes par catégorie (ce mois-ci)</h3>
          <div className="analyse-card">
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
        </div>
      )}

      {parCategorieVariable.length > 0 && (
        <div className="breakdown">
          <h3>Dépenses variables par catégorie (ce mois-ci)</h3>
          <div className="analyse-card">
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
        </div>
      )}

      <div className="analyse">
        <h3>
          <Icon name="query_stats" className="step-title-icon" />
          Analyse
        </h3>
        <p className="analyse-caption">Quelques repères financiers usuels, à titre indicatif.</p>

        <div className="analyse-card">
          <div className="analyse-rows">
            <div className="analyse-row">
              <Icon name="trending_up" className="analyse-row-icon" />
              <div className="analyse-row-body">
                <div className="analyse-row-top">
                  <span className="analyse-row-label">Taux d'épargne</span>
                  <span className="analyse-row-top-right">
                    <span className="analyse-row-value">{tauxEpargne.toFixed(1)} %</span>
                    <span className={`analyse-tag analyse-tag-${niveauEpargne}`}>{labelEpargne}</span>
                  </span>
                </div>
                <div className="analyse-row-track">
                  <div
                    className={`analyse-row-fill analyse-row-fill-${niveauEpargne === 'bon' ? 'good' : niveauEpargne === 'correct' ? 'pending' : 'warning'}`}
                    style={{ width: `${Math.min(100, tauxEpargne)}%` }}
                  />
                  <div className="analyse-row-repere" style={{ left: '20%' }} />
                </div>
                <span className="analyse-row-sub">Repère courant : ≥ 20 % des revenus</span>
              </div>
            </div>

            <div className="analyse-row">
              <Icon name="home" className="analyse-row-icon" />
              <div className="analyse-row-body">
                <div className="analyse-row-top">
                  <span className="analyse-row-label">Taux d'effort logement</span>
                  <span className="analyse-row-top-right">
                    <span className="analyse-row-value">{tauxEffortLogement.toFixed(1)} %</span>
                    <span className={`analyse-tag analyse-tag-${logementDansLaNorme ? 'bon' : 'faible'}`}>
                      {logementDansLaNorme ? 'Dans la norme' : 'Élevé'}
                    </span>
                  </span>
                </div>
                <div className="analyse-row-track">
                  <div
                    className={`analyse-row-fill analyse-row-fill-${logementDansLaNorme ? 'good' : 'warning'}`}
                    style={{ width: `${Math.min(100, tauxEffortLogement)}%` }}
                  />
                  <div className="analyse-row-repere" style={{ left: '38%' }} />
                </div>
                <span className="analyse-row-sub">Repère confortable : ≤ 38 % des revenus (seuil bancaire strict : 33 %)</span>
              </div>
            </div>

            <div className="analyse-row analyse-row-regle">
              <Icon name="pie_chart" className="analyse-row-icon" />
              <div className="analyse-row-body">
                <div className="analyse-row-top">
                  <span className="analyse-row-label">Règle 50 / 30 / 20</span>
                </div>
                <div className="regle-bar">
                  <div className="regle-segment regle-essentiel" style={{ width: `${Math.max(0, pctEssentiel)}%` }} />
                  <div className="regle-segment regle-plaisirs" style={{ width: `${Math.max(0, pctPlaisirs)}%` }} />
                  <div className="regle-segment regle-epargne" style={{ width: `${Math.max(0, pctEpargneRegle)}%` }} />
                </div>
                <div className="regle-legende">
                  <span><i className="regle-puce regle-puce-essentiel" />Essentiel {pctEssentiel.toFixed(0)}%<em>(50%)</em></span>
                  <span><i className="regle-puce regle-puce-plaisirs" />Plaisirs {pctPlaisirs.toFixed(0)}%<em>(30%)</em></span>
                  <span><i className="regle-puce regle-puce-epargne" />Épargne {pctEpargneRegle.toFixed(0)}%<em>(20%)</em></span>
                </div>
              </div>
            </div>
          </div>

          <div className="analyse-footer">
            <div className="analyse-footer-item">
              <span className="analyse-footer-value">{formatEuros(resteParJour)}</span>
              <span className="analyse-footer-sub">
                reste à vivre / jour · {joursRestants(dateReference)} j restants
              </span>
            </div>
            <div className="analyse-footer-divider" />
            <div className="analyse-footer-item">
              <span className={`analyse-footer-value ${evolutionVariables !== null && evolutionVariables < 0 ? 'good' : ''}`}>
                {evolutionVariables === null
                  ? '—'
                  : `${evolutionVariables > 0 ? '+' : ''}${evolutionVariables.toFixed(0)} %`}
              </span>
              <span className="analyse-footer-sub">
                {evolutionVariables === null
                  ? 'dépenses variables — pas de données le mois précédent'
                  : `dépenses variables vs ${MOIS[dateMoisPrecedent.getMonth()]} (${formatEuros(totalVariablesMoisPrecedent)})`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ComparaisonMois
        revenus={revenus}
        chargesFixes={chargesFixes}
        chargesVariables={chargesVariables}
        periodeInitiale={periode ?? { mois: dateReference.getMonth() + 1, annee: dateReference.getFullYear() }}
      />

      <div className="reset-mois">
        <button type="button" className="btn-reset-mois" onClick={onReinitialiserMois}>
          <Icon name="restart_alt" />
          Réinitialiser ce mois
        </button>
        <p className="reset-mois-hint">
          Supprime les dépenses variables du mois affiché (les autres mois ne
          sont pas touchés) et repasse les charges fixes à "À venir".
        </p>
      </div>
    </section>
  )
}
