import { useState } from 'react'
import Icon from './Icon'
import {
  CATEGORIES_CHARGES_VARIABLES,
  categorieInfoVariable,
  estDansLaPeriode,
  dateParDefaut,
  nouvelId,
  formatEuros,
} from '../utils/budget'

/**
 * Journal des dépenses variables : à remplir au fur et à mesure du mois.
 * Chaque entrée reste rattachée au mois de sa propre date — on ne voit et
 * ne compte ici que celles du mois actuellement affiché (dateReference).
 * On choisit une catégorie (puce colorée), puis un preset (ou "Autre").
 */
export default function JournalDepenses({ items, onChange, dateReference = new Date() }) {
  const [categorieOuverte, setCategorieOuverte] = useState(null)

  function ajouter(categorie, label = '') {
    onChange([
      ...items,
      {
        id: nouvelId(),
        label,
        montant: '',
        date: dateParDefaut(dateReference),
        paye: false,
        categorie,
      },
    ])
  }

  function modifier(id, champ, valeur) {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [champ]: valeur } : item))
    )
  }

  function supprimer(id) {
    onChange(items.filter((item) => item.id !== id))
  }

  const itemsDuMois = items.filter((i) => estDansLaPeriode(i, dateReference))

  const total = itemsDuMois.reduce((sum, i) => sum + (Number(i.montant) || 0), 0)
  const totalPaye = itemsDuMois
    .filter((i) => i.paye)
    .reduce((sum, i) => sum + (Number(i.montant) || 0), 0)
  const totalEnAttente = total - totalPaye
  const nbPaye = itemsDuMois.filter((i) => i.paye).length
  const pourcentPaye = total > 0 ? (totalPaye / total) * 100 : 0

  const catOuverte = CATEGORIES_CHARGES_VARIABLES.find((c) => c.id === categorieOuverte)
  const labelsPresents = new Set(
    itemsDuMois.filter((i) => i.categorie === categorieOuverte).map((i) => i.label)
  )

  const itemsTries = [...itemsDuMois].sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  return (
    <div className="item-list">
      {itemsDuMois.length > 0 && (
        <div className="charges-overview">
          <div className="charges-overview-row">
            <span>
              <strong>{nbPaye}</strong>/{itemsDuMois.length} passées sur le compte
            </span>
            <span className="charges-overview-amounts">
              <span className="text-good">{formatEuros(totalPaye)} passées</span>
              {' · '}
              <span className="text-muted">{formatEuros(totalEnAttente)} en attente</span>
            </span>
          </div>
          <div className="charges-overview-track">
            <div
              className="charges-overview-fill"
              style={{ width: `${pourcentPaye}%` }}
            />
          </div>
        </div>
      )}

      <div className="category-chips">
        {CATEGORIES_CHARGES_VARIABLES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`category-chip ${categorieOuverte === cat.id ? 'open' : ''}`}
            style={{ '--chip-color': cat.color, '--chip-color-dark': cat.colorDark }}
            onClick={() =>
              setCategorieOuverte(categorieOuverte === cat.id ? null : cat.id)
            }
          >
            <Icon name={cat.icon} className="category-chip-icon" />
            {cat.id}
          </button>
        ))}
      </div>

      {catOuverte && (
        <div className="preset-chips">
          {catOuverte.presets.map((preset) => (
            <button
              key={preset}
              type="button"
              className="preset-chip"
              disabled={labelsPresents.has(preset)}
              style={{ '--chip-color': catOuverte.color, '--chip-color-dark': catOuverte.colorDark }}
              onClick={() => ajouter(catOuverte.id, preset)}
            >
              <Icon name={labelsPresents.has(preset) ? 'check' : 'add'} />
              {preset}
            </button>
          ))}
          <button
            type="button"
            className="preset-chip preset-chip-autre"
            onClick={() => ajouter(catOuverte.id)}
          >
            <Icon name="add" />
            Autre
          </button>
        </div>
      )}

      <div className="charges-grid">
        {itemsTries.map((item) => {
          const cat = categorieInfoVariable(item.categorie)
          return (
            <div
              className={`journal-row ${item.paye ? 'paye' : ''}`}
              key={item.id}
              style={{ '--chip-color': cat.color, '--chip-color-dark': cat.colorDark }}
            >
              <div className="journal-row-main">
                <span className="icon-badge">
                  <Icon name={cat.icon} />
                </span>
                <input
                  type="text"
                  placeholder="Libellé"
                  value={item.label}
                  onChange={(e) => modifier(item.id, 'label', e.target.value)}
                />
                <button
                  type="button"
                  className="btn-icon"
                  aria-label="Supprimer"
                  onClick={() => supprimer(item.id)}
                >
                  <Icon name="close" />
                </button>
              </div>

              <div className="journal-row-details">
                <input
                  type="date"
                  className="journal-date"
                  value={item.date || ''}
                  onChange={(e) => modifier(item.id, 'date', e.target.value)}
                />
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={item.montant}
                  onChange={(e) => modifier(item.id, 'montant', e.target.value)}
                />
                <span className="unit">€</span>
                <button
                  type="button"
                  className={`toggle-preleve ${item.paye ? 'on' : ''}`}
                  onClick={() => modifier(item.id, 'paye', !item.paye)}
                  aria-label={item.paye ? 'Marquer comme non passée' : 'Marquer comme passée'}
                >
                  <Icon name={item.paye ? 'check_circle' : 'radio_button_unchecked'} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
