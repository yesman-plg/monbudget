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
  cleMois,
  estPreleveeCeMois,
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
        moisPreleves: [],
        dureeMois: '',
        echeancesPassees: 0,
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

  // Le statut "prélevée" est propre au mois affiché (voir estPreleveeCeMois).
  // Pour un crédit, valider "Prélevée" avance aussi le compteur d'échéances
  // (et le recule si on annule) — un seul update atomique.
  function basculerPreleve(item) {
    const cle = cleMois(dateReference)
    const dejaPreleve = (item.moisPreleves ?? []).includes(cle)
    const nouveauPreleve = !dejaPreleve
    onChange(
      items.map((i) => {
        if (i.id !== item.id) return i
        const moisPreleves = nouveauPreleve
          ? [...(i.moisPreleves ?? []), cle]
          : (i.moisPreleves ?? []).filter((m) => m !== cle)
        if (i.categorie !== 'Crédits') return { ...i, moisPreleves }
        const actuel = Number(i.echeancesPassees) || 0
        const duree = i.dureeMois ? Number(i.dureeMois) : null
        const suivant = nouveauPreleve
          ? duree
            ? Math.min(actuel + 1, duree)
            : actuel + 1
          : Math.max(actuel - 1, 0)
        return { ...i, moisPreleves, echeancesPassees: suivant }
      })
    )
  }

  const itemsDus = items.filter((i) => estDueCeMois(i, dateReference))
  const total = sommeChargesFixesCeMois(items, dateReference)
  const totalPreleve = itemsDus
    .filter((i) => estPreleveeCeMois(i, dateReference))
    .reduce((sum, i) => sum + montantCeMois(i, dateReference), 0)
  const totalAVenir = total - totalPreleve
  const nbPreleve = itemsDus.filter((i) => estPreleveeCeMois(i, dateReference)).length
  const pourcentPreleve = total > 0 ? (totalPreleve / total) * 100 : 0

  const catOuverte = CATEGORIES_CHARGES_FIXES.find((c) => c.id === categorieOuverte)
  const labelsPresents = new Set(
    items.filter((i) => i.categorie === categorieOuverte).map((i) => i.label)
  )

  // Les cartes de la même catégorie se retrouvent groupées ensemble
  // (tri stable : dans une même catégorie, l'ordre d'ajout est conservé).
  const ordreCategories = CATEGORIES_CHARGES_FIXES.map((c) => c.id)
  const itemsTries = [...items].sort(
    (a, b) => ordreCategories.indexOf(a.categorie) - ordreCategories.indexOf(b.categorie)
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
        {itemsTries.map((item) => {
          const cat = categorieInfo(item.categorie)
          const pasMensuelle = item.frequence !== 'mensuel'
          const due = estDueCeMois(item, dateReference)
          const preleveCeMois = estPreleveeCeMois(item, dateReference)
          return (
            <div
              className={`charge-fixe-row ${preleveCeMois ? 'preleve' : ''}`}
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
                  className={`toggle-preleve ${preleveCeMois ? 'on' : ''}`}
                  disabled={pasMensuelle && !due}
                  onClick={() => basculerPreleve(item)}
                >
                  <Icon name={preleveCeMois ? 'check_circle' : 'radio_button_unchecked'} />
                  {preleveCeMois ? 'Prélevée' : 'À venir'}
                </button>
              </div>

              {item.categorie === 'Crédits' && (
                <>
                  <div className="charge-fixe-row-details">
                    <label className="duree-credit">
                      Durée
                      <input
                        type="number"
                        min="1"
                        placeholder="—"
                        value={item.dureeMois ?? ''}
                        onChange={(e) => modifier(item.id, 'dureeMois', e.target.value)}
                      />
                      mois
                    </label>
                    <label className="duree-credit">
                      Échéances
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.echeancesPassees ?? ''}
                        onChange={(e) => modifier(item.id, 'echeancesPassees', e.target.value)}
                      />
                      {item.dureeMois ? `/ ${item.dureeMois}` : ''}
                    </label>
                  </div>
                  {item.dureeMois > 0 && (
                    <div className="credit-progress">
                      <div className="credit-progress-track">
                        <div
                          className="credit-progress-fill"
                          style={{
                            width: `${Math.min(100, ((Number(item.echeancesPassees) || 0) / Number(item.dureeMois)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="credit-progress-label">
                        {item.echeancesPassees || 0} / {item.dureeMois} échéances remboursées
                      </span>
                    </div>
                  )}
                </>
              )}

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
