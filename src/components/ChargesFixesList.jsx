import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import CategoryPicker from './CategoryPicker'
import {
  CATEGORIES_CHARGES_FIXES,
  FREQUENCES,
  MOIS,
  categorieInfo,
  montantMensualise,
  estDueCeMois,
  montantCeMois,
  sommeChargesFixesCeMois,
  nouvelId,
  formatEuros,
} from '../utils/budget'

/**
 * Liste éditable des charges fixes : on choisit d'abord une catégorie
 * (puce colorée), puis un preset dans cette catégorie (ou "Autre" pour
 * du texte libre) — le libellé + la catégorie sont préremplis.
 * Une charge trimestrielle/annuelle précise aussi son mois de prélèvement :
 * elle ne compte dans le total que le(s) mois où elle tombe réellement.
 */
export default function ChargesFixesList({ items, onChange, dateReference = new Date() }) {
  const [categorieOuverte, setCategorieOuverte] = useState(null)
  const [dernierAjoutId, setDernierAjoutId] = useState(null)
  const labelRefs = useRef({})
  const montantRefs = useRef({})

  function ajouter(categorie, label = '') {
    const id = nouvelId()
    onChange([
      ...items,
      {
        id,
        label,
        montant: '',
        frequence: 'mensuel',
        categorie,
        jourPrelevement: '',
        moisPrelevement: '',
        preleve: false,
      },
    ])
    setDernierAjoutId(id)
  }

  // Après ajout, on descend directement à la nouvelle carte et on pose le
  // focus sur le champ à remplir (le libellé si vide, sinon le montant).
  useEffect(() => {
    if (!dernierAjoutId) return
    const cible = labelRefs.current[dernierAjoutId]?.value
      ? montantRefs.current[dernierAjoutId]
      : labelRefs.current[dernierAjoutId]
    cible?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    cible?.focus()
    setDernierAjoutId(null)
  }, [dernierAjoutId])

  function modifier(id, champ, valeur) {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [champ]: valeur } : item))
    )
  }

  // Changement de fréquence + mois par défaut en un seul update atomique
  // (deux appels à modifier() à la suite se marcheraient dessus).
  function changerFrequence(id, nouvelleFrequence) {
    onChange(
      items.map((item) => {
        if (item.id !== id) return item
        const moisPrelevement =
          nouvelleFrequence !== 'mensuel' && !item.moisPrelevement
            ? String(dateReference.getMonth() + 1)
            : item.moisPrelevement
        return { ...item, frequence: nouvelleFrequence, moisPrelevement }
      })
    )
  }

  function supprimer(id) {
    onChange(items.filter((item) => item.id !== id))
  }

  const itemsDus = items.filter((i) => estDueCeMois(i, dateReference))
  const total = sommeChargesFixesCeMois(items, dateReference)
  const totalPreleve = itemsDus
    .filter((i) => i.preleve)
    .reduce((sum, i) => sum + montantCeMois(i, dateReference), 0)
  const totalAVenir = total - totalPreleve
  const nbPreleve = itemsDus.filter((i) => i.preleve).length
  const pourcentPreleve = total > 0 ? (totalPreleve / total) * 100 : 0

  const catOuverte = CATEGORIES_CHARGES_FIXES.find((c) => c.id === categorieOuverte)
  const labelsPresents = new Set(
    items.filter((i) => i.categorie === categorieOuverte).map((i) => i.label)
  )

  return (
    <div className="item-list">
      {items.length > 0 && (
        <div className="charges-overview">
          <div className="charges-overview-row">
            <span>
              <strong>{nbPreleve}</strong>/{itemsDus.length} prélevées ce mois-ci
            </span>
            <span className="charges-overview-amounts">
              <span className="text-good">{formatEuros(totalPreleve)} prélevées</span>
              {' · '}
              <span className="text-muted">{formatEuros(totalAVenir)} à venir</span>
            </span>
          </div>
          <div className="charges-overview-track">
            <div
              className="charges-overview-fill"
              style={{ width: `${pourcentPreleve}%` }}
            />
          </div>
        </div>
      )}

      <CategoryPicker
        categories={CATEGORIES_CHARGES_FIXES}
        selectionnee={categorieOuverte}
        onSelect={setCategorieOuverte}
      />

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
        {items.map((item) => {
          const cat = categorieInfo(item.categorie)
          const pasMensuelle = item.frequence !== 'mensuel'
          const due = estDueCeMois(item, dateReference)
          return (
            <div
              className={`charge-fixe-row ${item.preleve ? 'preleve' : ''}`}
              key={item.id}
              style={{ '--chip-color': cat.color, '--chip-color-dark': cat.colorDark }}
            >
              <div className="charge-fixe-row-main">
                <span className="icon-badge">
                  <Icon name={cat.icon} />
                </span>
                <input
                  type="text"
                  placeholder="Libellé"
                  value={item.label}
                  ref={(el) => { labelRefs.current[item.id] = el }}
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

              <div className="charge-fixe-row-details">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={item.montant}
                  ref={(el) => { montantRefs.current[item.id] = el }}
                  onChange={(e) => modifier(item.id, 'montant', e.target.value)}
                />
                <span className="unit">€</span>

                <select
                  value={item.frequence}
                  onChange={(e) => changerFrequence(item.id, e.target.value)}
                >
                  {FREQUENCES.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {pasMensuelle && (
                <div className="charge-fixe-row-details">
                  <label className="mois-prelevement">
                    Prélevée en
                    <select
                      value={item.moisPrelevement ?? ''}
                      onChange={(e) => modifier(item.id, 'moisPrelevement', e.target.value)}
                    >
                      <option value="" disabled>
                        —
                      </option>
                      {MOIS.map((mois, index) => (
                        <option key={mois} value={index + 1}>
                          {mois}
                        </option>
                      ))}
                    </select>
                  </label>
                  {item.frequence === 'trimestriel' && (
                    <span className="mois-prelevement-note">puis tous les 3 mois</span>
                  )}
                </div>
              )}

              <div className="charge-fixe-row-details">
                <label className="jour-prelevement">
                  Le
                  <input
                    type="number"
                    min="1"
                    max="31"
                    placeholder="jj"
                    value={item.jourPrelevement ?? ''}
                    onChange={(e) => modifier(item.id, 'jourPrelevement', e.target.value)}
                  />
                  du mois
                </label>

                <button
                  type="button"
                  className={`toggle-preleve ${item.preleve ? 'on' : ''}`}
                  disabled={pasMensuelle && !due}
                  onClick={() => modifier(item.id, 'preleve', !item.preleve)}
                >
                  <Icon name={item.preleve ? 'check_circle' : 'radio_button_unchecked'} />
                  {item.preleve ? 'Prélevée' : 'À venir'}
                </button>
              </div>

              {pasMensuelle && !due && (
                <div className="charge-fixe-prorata">Ne tombe pas ce mois-ci</div>
              )}

              {pasMensuelle && item.montant !== '' && (
                <div className="charge-fixe-prorata">
                  ≈ {formatEuros(montantMensualise(item.montant, item.frequence))} / mois en moyenne
                </div>
              )}
            </div>
          )
        })}
      </div>

      {items.length > 0 && (
        <div className="item-list-total">
          Total charges fixes ce mois-ci : {formatEuros(total)}
        </div>
      )}
    </div>
  )
}
