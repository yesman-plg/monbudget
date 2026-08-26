import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

/**
 * Sélecteur de catégorie compact : un seul bouton affichant la catégorie
 * choisie, qui ouvre au tap une grille de toutes les catégories disponibles.
 * Remplace une longue rangée de puces toujours visibles par une seule ligne.
 */
export default function CategoryPicker({
  categories,
  selectionnee,
  onSelect,
  placeholder = 'Choisir une catégorie',
}) {
  const [ouvert, setOuvert] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!ouvert) return
    function surClicExterieur(e) {
      if (ref.current && !ref.current.contains(e.target)) setOuvert(false)
    }
    function surEchap(e) {
      if (e.key === 'Escape') setOuvert(false)
    }
    document.addEventListener('mousedown', surClicExterieur)
    document.addEventListener('keydown', surEchap)
    return () => {
      document.removeEventListener('mousedown', surClicExterieur)
      document.removeEventListener('keydown', surEchap)
    }
  }, [ouvert])

  const cat = categories.find((c) => c.id === selectionnee)

  return (
    <div className="category-picker" ref={ref}>
      <button
        type="button"
        className={`category-picker-trigger ${!cat ? 'vide' : ''}`}
        style={cat ? { '--chip-color': cat.color, '--chip-color-dark': cat.colorDark } : undefined}
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
      >
        {cat ? (
          <span className="icon-badge icon-badge-sm">
            <Icon name={cat.icon} />
          </span>
        ) : (
          <span className="icon-badge icon-badge-sm icon-badge-vide">
            <Icon name="category" />
          </span>
        )}
        <span className="category-picker-label">{cat ? cat.id : placeholder}</span>
        <Icon name={ouvert ? 'expand_less' : 'expand_more'} className="category-picker-chevron" />
      </button>

      {ouvert && (
        <div className="category-picker-panel">
          <div className="category-picker-grid">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`category-picker-item ${c.id === selectionnee ? 'active' : ''}`}
                style={{ '--chip-color': c.color, '--chip-color-dark': c.colorDark }}
                onClick={() => {
                  onSelect(c.id)
                  setOuvert(false)
                }}
              >
                <span className="icon-badge icon-badge-sm">
                  <Icon name={c.icon} />
                </span>
                <span className="category-picker-item-label">{c.id}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
