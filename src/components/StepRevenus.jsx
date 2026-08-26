import Icon from './Icon'
import SimpleItemList from './SimpleItemList'
import { PRESETS_REVENUS } from '../utils/budget'

export default function StepRevenus({ revenus, setRevenus }) {
  return (
    <section className="step">
      <h2>
        <Icon name="payments" className="step-title-icon" />
        Vos revenus
      </h2>
      <p className="step-hint">
        Salaire, primes, revenus locatifs, allocations... tout ce qui rentre chaque mois.
      </p>
      <SimpleItemList items={revenus} onChange={setRevenus} presets={PRESETS_REVENUS} />
    </section>
  )
}
