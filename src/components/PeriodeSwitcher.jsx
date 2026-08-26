import Icon from './Icon'
import { MOIS } from '../utils/budget'

/**
 * Sélecteur de mois/année en tête de page : c'est la période de référence
 * pour tous les calculs "dû ce mois-ci" (charges trimestrielles/annuelles).
 */
export default function PeriodeSwitcher({ periode, onChange }) {
  function moisPrecedent() {
    onChange(
      periode.mois === 1
        ? { mois: 12, annee: periode.annee - 1 }
        : { mois: periode.mois - 1, annee: periode.annee }
    )
  }

  function moisSuivant() {
    onChange(
      periode.mois === 12
        ? { mois: 1, annee: periode.annee + 1 }
        : { mois: periode.mois + 1, annee: periode.annee }
    )
  }

  return (
    <div className="periode-switcher">
      <button type="button" className="periode-nav" onClick={moisPrecedent} aria-label="Mois précédent">
        <Icon name="chevron_left" />
      </button>
      <span className="periode-label">
        {MOIS[periode.mois - 1]} {periode.annee}
      </span>
      <button type="button" className="periode-nav" onClick={moisSuivant} aria-label="Mois suivant">
        <Icon name="chevron_right" />
      </button>
    </div>
  )
}
