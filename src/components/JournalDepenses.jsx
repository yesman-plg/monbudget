import { useEffect, useState } from 'react'
import Icon from './Icon'
import CategoryPicker from './CategoryPicker'
import {
  CATEGORIES_CHARGES_VARIABLES,
  categorieInfoVariable,
  estDansLaPeriode,
  dateParDefaut,
  formatDateCourte,
  nouvelId,
  formatEuros,
} from '../utils/budget'

function formulaireVide(dateReference) {
  return { label: '', date: dateParDefaut(dateReference), montant: '' }
}

/**
 * Journal des dépenses variables : chaque ligne est un rappel compact
 * (icône, libellé, catégorie · date, statut, montant) — un tap dessus ouvre
 * le tiroir en édition. Le statut (payée / en attente) se bascule
 * directement sur la ligne. L'ajout se fait dans le même tiroir : on
 * choisit une catégorie, éventuellement un intitulé courant, on complète,
 * puis "Ajouter la dépense" valide — rien n'est créé avant ce clic.
 * Chaque entrée reste rattachée au mois de sa propre date — on ne voit et
 * ne compte ici que celles du mois actuellement affiché (dateReference).
 */
export default function JournalDepenses({ items, onChange, dateReference = new Date() }) {
  const [categorieOuverte, setCategorieOuverte] = useState(null)
  const [drawerOuvert, setDrawerOuvert] = useState(false)
  const [editionId, setEditionId] = useState(null)
  const [formulaire, setFormulaire] = useState(() => formulaireVide(dateReference))

  function ouvrirAjout() {
    setEditionId(null)
    setCategorieOuverte(null)
    setFormulaire(formulaireVide(dateReference))
    setDrawerOuvert(true)
  }

  function ouvrirEdition(item) {
    setEditionId(item.id)
    setCategorieOuverte(item.categorie)
    setFormulaire({ label: item.label, date: item.date ?? '', montant: item.montant })
    setDrawerOuvert(true)
  }

  function choisirPreset(preset) {
    setFormulaire((f) => ({ ...f, label: preset }))
  }

  function majFormulaire(champ, valeur) {
    setFormulaire((f) => ({ ...f, [champ]: valeur }))
  }

  function confirmer() {
    if (!categorieOuverte) return
    const champs = {
      label: formulaire.label,
      date: formulaire.date,
      montant: formulaire.montant,
      categorie: categorieOuverte,
    }
    if (editionId) {
      onChange(items.map((i) => (i.id === editionId ? { ...i, ...champs } : i)))
    } else {
      onChange([...items, { id: nouvelId(), paye: false, ...champs }])
    }
    setDrawerOuvert(false)
  }

  function supprimerDepuisTiroir() {
    if (!editionId) return
    onChange(items.filter((i) => i.id !== editionId))
    setDrawerOuvert(false)
  }

  function basculerPaye(item) {
    onChange(items.map((i) => (i.id === item.id ? { ...i, paye: !i.paye } : i)))
  }

  useEffect(() => {
    if (!drawerOuvert) return
    function surEchap(e) {
      if (e.key === 'Escape') setDrawerOuvert(false)
    }
    document.addEventListener('keydown', surEchap)
    return () => document.removeEventListener('keydown', surEchap)
  }, [drawerOuvert])

  const itemsDuMois = items.filter((i) => estDansLaPeriode(i, dateReference))

  const total = itemsDuMois.reduce((sum, i) => sum + (Number(i.montant) || 0), 0)
  const totalPaye = itemsDuMois
    .filter((i) => i.paye)
    .reduce((sum, i) => sum + (Number(i.montant) || 0), 0)
  const totalEnAttente = total - totalPaye
  const nbPaye = itemsDuMois.filter((i) => i.paye).length
  const pourcentPaye = total > 0 ? (totalPaye / total) * 100 : 0

  const catOuverte = CATEGORIES_CHARGES_VARIABLES.find((c) => c.id === categorieOuverte)
  const itemEnEdition = editionId ? items.find((i) => i.id === editionId) : null

  const itemsTries = [...itemsDuMois].sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  return (
    <div className="item-list">
      {itemsDuMois.length > 0 && (
        <div className="charges-overview">
          <div className="charges-overview-label">
            <strong>{nbPaye}</strong>/{itemsDuMois.length} dépenses passées sur le compte
          </div>
          <div className="charges-overview-track">
            <div className="charges-overview-fill good" style={{ width: `${pourcentPaye}%` }}>
              {formatEuros(totalPaye)}
            </div>
            <div className="charges-overview-fill pending" style={{ width: `${100 - pourcentPaye}%` }}>
              {formatEuros(totalEnAttente)}
            </div>
          </div>
        </div>
      )}

      <button type="button" className="btn-ajouter-charge" onClick={ouvrirAjout}>
        <Icon name="add" />
        Ajouter une dépense
      </button>

      {drawerOuvert && (
        <div className="charges-drawer-overlay" onClick={() => setDrawerOuvert(false)}>
          <div
            className="charges-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={editionId ? 'Modifier la dépense' : 'Nouvelle dépense'}
            style={catOuverte ? { '--chip-color': catOuverte.color, '--chip-color-dark': catOuverte.colorDark } : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="charges-drawer-head">
              <h3>{editionId ? 'Modifier la dépense' : 'Nouvelle dépense'}</h3>
              <button
                type="button"
                className="btn-icon"
                aria-label="Fermer"
                onClick={() => setDrawerOuvert(false)}
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="charges-drawer-body">
              <span className="form-field-label">Catégorie</span>
              <CategoryPicker
                categories={CATEGORIES_CHARGES_VARIABLES}
                selectionnee={categorieOuverte}
                onSelect={setCategorieOuverte}
              />

              {catOuverte && (
                <>
                  {!editionId && (
                    <div className="preset-chips">
                      {catOuverte.presets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className={`preset-chip ${formulaire.label === preset ? 'selectionne' : ''}`}
                          style={{ '--chip-color': catOuverte.color, '--chip-color-dark': catOuverte.colorDark }}
                          onClick={() => choisirPreset(preset)}
                        >
                          <Icon name={formulaire.label === preset ? 'check' : 'add'} />
                          {preset}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="form-field-label">Libellé</span>
                  <input
                    type="text"
                    placeholder="Ex. Courses"
                    value={formulaire.label}
                    onChange={(e) => majFormulaire('label', e.target.value)}
                  />

                  <div className="form-row">
                    <label className="form-field">
                      <span className="form-field-label">Date</span>
                      <input
                        type="date"
                        value={formulaire.date}
                        onChange={(e) => majFormulaire('date', e.target.value)}
                      />
                    </label>
                    <label className="form-field">
                      <span className="form-field-label">Montant</span>
                      <div className="charge-fixe-montant-champ">
                        <input
                          type="number"
                          inputMode="decimal"
                          placeholder="0"
                          value={formulaire.montant}
                          onChange={(e) => majFormulaire('montant', e.target.value)}
                        />
                        <span className="unit">€</span>
                      </div>
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="charges-drawer-foot">
              {editionId ? (
                <>
                  <button type="button" className="btn-supprimer" onClick={supprimerDepuisTiroir}>
                    Supprimer
                  </button>
                  <button
                    type="button"
                    className={`btn-preleve-tiroir ${itemEnEdition?.paye ? 'on' : ''}`}
                    aria-label={itemEnEdition?.paye ? 'Marquer comme en attente' : 'Marquer comme passée'}
                    onClick={() => {
                      basculerPaye(itemEnEdition)
                      setDrawerOuvert(false)
                    }}
                  >
                    Payer
                  </button>
                  <button type="button" className="btn-confirmer-ajout" disabled={!categorieOuverte} onClick={confirmer}>
                    Enregistrer
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn-annuler" onClick={() => setDrawerOuvert(false)}>
                    Annuler
                  </button>
                  <button type="button" className="btn-confirmer-ajout" disabled={!categorieOuverte} onClick={confirmer}>
                    Ajouter la dépense
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="charges-grid item-list-card">
        {itemsTries.map((item) => {
          const cat = categorieInfoVariable(item.categorie)
          return (
            <div
              className="item-row"
              key={item.id}
              style={{ '--chip-color': cat.color, '--chip-color-dark': cat.colorDark }}
            >
              <button type="button" className="item-row-main" onClick={() => ouvrirEdition(item)}>
                <span className="icon-badge">
                  <Icon name={cat.icon} />
                </span>
                <span className="item-main">
                  <span className="item-title">{item.label || 'Sans nom'}</span>
                  <span className="item-sub">
                    {item.categorie} · {formatDateCourte(item.date)}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className={`status-chip ${item.paye ? 'paid' : 'pending'}`}
                onClick={() => basculerPaye(item)}
                aria-label={item.paye ? 'Marquer comme en attente' : 'Marquer comme passée'}
              >
                {item.paye ? 'Payée' : 'En attente'}
              </button>
              <span className="item-amount">{formatEuros(item.montant)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
