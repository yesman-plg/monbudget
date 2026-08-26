import Icon from './Icon'
import JournalDepenses from './JournalDepenses'

export default function StepChargesVariables({ chargesVariables, setChargesVariables, dateReference }) {
  return (
    <section className="step">
      <h2>
        <Icon name="receipt_long" className="step-title-icon" />
        Vos charges variables
      </h2>
      <p className="step-hint">
        C'est ton journal de dépenses : choisis une catégorie, ajoute une
        estimation pour démarrer, puis complète au fil du mois à chaque
        dépense. Coche la case quand elle est passée sur ton compte. Chaque
        dépense reste rattachée au mois affiché en haut de la page.
      </p>
      <JournalDepenses
        items={chargesVariables}
        onChange={setChargesVariables}
        dateReference={dateReference}
      />
    </section>
  )
}
