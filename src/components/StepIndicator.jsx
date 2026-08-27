import Icon from './Icon'

const ETAPES = [
  { label: 'Revenus', icon: 'payments' },
  { label: 'Fixes', icon: 'push_pin' },
  { label: 'Variables', icon: 'receipt_long' },
  { label: 'Résumé', icon: 'bar_chart' },
  { label: 'Astuces', icon: 'lightbulb' },
]

export default function StepIndicator({ etapeActuelle, onGoTo }) {
  return (
    <nav className="step-indicator" aria-label="Navigation">
      {ETAPES.map((etape, index) => (
        <button
          key={etape.label}
          type="button"
          className={`step-indicator-item ${index === etapeActuelle ? 'active' : ''}`}
          onClick={() => onGoTo(index)}
        >
          <Icon name={etape.icon} className="step-indicator-icon" />
          <span className="step-indicator-label">{etape.label}</span>
        </button>
      ))}
    </nav>
  )
}
