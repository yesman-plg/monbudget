import Icon from './Icon'

const ETAPES = [
  { label: 'Revenus', icon: 'payments' },
  { label: 'Charges fixes', icon: 'push_pin' },
  { label: 'Charges variables', icon: 'receipt_long' },
  { label: 'Résumé', icon: 'bar_chart' },
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
