import { useEffect, useState } from 'react'
import Icon from './Icon'
import { nouvelId, formatEuros } from '../utils/budget'

const COULEUR_REVENU = { '--chip-color': '#1baf7a', '--chip-color-dark': '#199e70' }

function formulaireVide() {
  return { label: '', montant: '' }
}

/**
 * Liste éditable générique d'items { id, label, montant } — utilisée pour
 * les revenus. Lignes statiques (libellé + montant) ; un tap ouvre le
 * tiroir en édition. L'ajout se fait dans le même tiroir : éventuellement
 * un intitulé courant qui préremplit le libellé, puis "Ajouter" valide.
 */
export default function SimpleItemList({ items, onChange, presets = [] }) {
  const [drawerOuvert, setDrawerOuvert] = useState(false)
  const [editionId, setEditionId] = useState(null)
  const [formulaire, setFormulaire] = useState(formulaireVide)

  function ouvrirAjout() {
    setEditionId(null)
    setFormulaire(formulaireVide())
    setDrawerOuvert(true)
  }

  function ouvrirEdition(item) {
    setEditionId(item.id)
    setFormulaire({ label: item.label, montant: item.montant })
    setDrawerOuvert(true)
  }

  function choisirPreset(preset) {
    setFormulaire((f) => ({ ...f, label: preset }))
  }

  function majFormulaire(champ, valeur) {
    setFormulaire((f) => ({ ...f, [champ]: valeur }))
  }

  function confirmer() {
    if (editionId) {
      onChange(
        items.map((i) =>
          i.id === editionId ? { ...i, label: formulaire.label, montant: formulaire.montant } : i
        )
      )
    } else {
      onChange([...items, { id: nouvelId(), label: formulaire.label, montant: formulaire.montant }])
    }
    setDrawerOuvert(false)
  }

  function supprimerDepuisTiroir() {
    if (!editionId) return
    onChange(items.filter((i) => i.id !== editionId))
    setDrawerOuvert(false)
  }

  useEffect(() => {
    if (!drawerOuvert) return
    function surEchap(e) {
      if (e.key === 'Escape') setDrawerOuvert(false)
    }
    document.addEventListener('keydown', surEchap)
    return () => document.removeEventListener('keydown', surEchap)
  }, [drawerOuvert])

  const total = items.reduce((sum, i) => sum + (Number(i.montant) || 0), 0)

  return (
    <div className="item-list">
      <button type="button" className="btn-ajouter-charge" onClick={ouvrirAjout}>
        <Icon name="add" />
        Ajouter un revenu
      </button>

      {drawerOuvert && (
        <div className="charges-drawer-overlay" onClick={() => setDrawerOuvert(false)}>
          <div
            className="charges-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={editionId ? 'Modifier le revenu' : 'Nouveau revenu'}
            style={COULEUR_REVENU}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="charges-drawer-head">
              <h3>{editionId ? 'Modifier le revenu' : 'Nouveau revenu'}</h3>
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
              {!editionId && presets.length > 0 && (
                <div className="preset-chips">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className={`preset-chip ${formulaire.label === preset.label ? 'selectionne' : ''}`}
                      style={{ '--chip-color': preset.color, '--chip-color-dark': preset.colorDark }}
                      onClick={() => choisirPreset(preset.label)}
                    >
                      <Icon name={formulaire.label === preset.label ? 'check' : 'add'} />
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}

              <span className="form-field-label">Libellé</span>
              <input
                type="text"
                placeholder="Ex. Salaire"
                value={formulaire.label}
                onChange={(e) => majFormulaire('label', e.target.value)}
              />

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

            <div className="charges-drawer-foot">
              {editionId ? (
                <button type="button" className="btn-supprimer" onClick={supprimerDepuisTiroir}>
                  Supprimer
                </button>
              ) : (
                <button type="button" className="btn-annuler" onClick={() => setDrawerOuvert(false)}>
                  Annuler
                </button>
              )}
              <button type="button" className="btn-confirmer-ajout" onClick={confirmer}>
                {editionId ? 'Enregistrer' : 'Ajouter le revenu'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="charges-grid item-list-card">
        {items.map((item) => (
          <div className="item-row" key={item.id} style={COULEUR_REVENU}>
            <button type="button" className="item-row-main" onClick={() => ouvrirEdition(item)}>
              <span className="icon-badge">
                <Icon name="payments" />
              </span>
              <span className="item-main">
                <span className="item-title">{item.label || 'Sans nom'}</span>
              </span>
            </button>
            <span />
            <span className="item-amount">{formatEuros(item.montant)}</span>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="item-list-total">Total : {formatEuros(total)} / mois</div>
      )}
    </div>
  )
}
