import Icon from './Icon'
import { nouvelId, formatEuros } from '../utils/budget'

const COULEUR_REVENU = { '--chip-color': '#1baf7a', '--chip-color-dark': '#199e70' }

/**
 * Liste éditable générique d'items { id, label, montant }.
 * Utilisée pour les revenus, avec des puces de suggestions prédéfinies
 * pour ajouter vite sans tout retaper.
 */
export default function SimpleItemList({ items, onChange, presets = [] }) {
  function ajouter(label = '') {
    onChange([...items, { id: nouvelId(), label, montant: '' }])
  }

  function modifier(id, champ, valeur) {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [champ]: valeur } : item))
    )
  }

  function supprimer(id) {
    onChange(items.filter((item) => item.id !== id))
  }

  const total = items.reduce((sum, i) => sum + (Number(i.montant) || 0), 0)
  const labelsPresents = new Set(items.map((i) => i.label))

  return (
    <div className="item-list">
      {presets.length > 0 && (
        <div className="preset-chips">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset-chip"
              disabled={labelsPresents.has(preset.label)}
              style={{ '--chip-color': preset.color, '--chip-color-dark': preset.colorDark }}
              onClick={() => ajouter(preset.label)}
            >
              <Icon name={labelsPresents.has(preset.label) ? 'check' : 'add'} />
              {preset.label}
            </button>
          ))}
          <button type="button" className="preset-chip preset-chip-autre" onClick={() => ajouter()}>
            <Icon name="add" />
            Autre
          </button>
        </div>
      )}

      <div className="charges-grid">
        {items.map((item) => (
          <div className="charge-fixe-row" key={item.id} style={COULEUR_REVENU}>
            <div className="charge-fixe-row-main">
              <span className="icon-badge">
                <Icon name="payments" />
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
            <div className="charge-fixe-row-details">
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={item.montant}
                onChange={(e) => modifier(item.id, 'montant', e.target.value)}
              />
              <span className="unit">€</span>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="item-list-total">Total : {formatEuros(total)} / mois</div>
      )}
    </div>
  )
}
