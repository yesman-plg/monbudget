import Icon from './Icon'
import ChargesFixesList from './ChargesFixesList'

export default function StepChargesFixes({ chargesFixes, setChargesFixes, dateReference }) {
  return (
    <section className="step">
      <h2>
        <Icon name="push_pin" className="step-title-icon" />
        Vos charges fixes
      </h2>
      <p className="step-hint">
        Choisis une catégorie ci-dessous, puis clique sur une charge courante
        pour l'ajouter direct. Le montant mensuel équivalent est calculé
        automatiquement selon la fréquence.
      </p>
      <ChargesFixesList
        items={chargesFixes}
        onChange={setChargesFixes}
        dateReference={dateReference}
      />
    </section>
  )
}
