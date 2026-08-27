import Icon from './Icon'

const THEMES = [
  {
    titre: 'Épargne',
    icon: 'trending_up',
    conseils: [
      {
        titre: 'Te payer en premier',
        texte:
          "Vire une partie de tes revenus vers l'épargne dès qu'ils arrivent, avant de dépenser le reste. Automatiser ce virement évite d'avoir à y penser — et à se retenir.",
      },
      {
        titre: "Un fonds d'urgence avant tout",
        texte:
          '3 à 6 mois de charges fixes de côté, sur un support disponible rapidement (Livret A). Ça évite de devoir emprunter au moindre imprévu.',
      },
      {
        titre: 'Épargner un pourcentage, pas un montant fixe',
        texte:
          'Un % de tes revenus s\'ajuste automatiquement s\'ils augmentent ou baissent, plutôt qu\'une somme fixe à retrouver coûte que coûte.',
      },
      {
        titre: 'Chaque petite somme compte',
        texte:
          "20 €/mois, c'est 240 €/an. Commence petit si besoin : l'habitude compte plus que le montant au départ.",
      },
    ],
  },
  {
    titre: 'Budget au quotidien',
    icon: 'receipt_long',
    conseils: [
      {
        titre: 'Note tes dépenses au fil de l\'eau',
        texte:
          "Plus tu attends pour les saisir, plus tu en oublies. Un réflexe de 10 secondes juste après chaque dépense suffit.",
      },
      {
        titre: 'Revois ton budget chaque mois',
        texte:
          'Les charges (énergie, abonnements) évoluent — ton budget doit suivre, pas rester figé au jour où tu l\'as créé.',
      },
      {
        titre: 'Traque les abonnements oubliés',
        texte:
          'Un audit tous les 6 mois permet souvent de retrouver 10 à 30 €/mois de charges qui ne servent plus à rien.',
      },
      {
        titre: 'Sépare besoins et envies',
        texte:
          "Un loyer est un besoin, un abonnement streaming est une envie. Aucun jugement à avoir — juste de la clarté sur où va l'argent.",
      },
    ],
  },
  {
    titre: 'Dettes & crédits',
    icon: 'credit_card',
    conseils: [
      {
        titre: 'Rembourse en priorité les taux les plus élevés',
        texte:
          "Entre plusieurs dettes, concentre l'effort sur celle qui coûte le plus cher en intérêts — pas forcément la plus petite.",
      },
      {
        titre: 'Méfie-toi du crédit renouvelable',
        texte:
          'Pratique pour dépanner, mais des taux souvent très élevés qui peuvent vite transformer un petit besoin en dette durable.',
      },
      {
        titre: 'Viser 33% des revenus maximum',
        texte:
          "C'est le seuil que les banques utilisent pour un crédit. Au-delà, le reste à vivre devient trop juste pour absorber un imprévu.",
      },
    ],
  },
  {
    titre: 'Achats & consommation',
    icon: 'shopping_bag',
    conseils: [
      {
        titre: 'La règle des 48h',
        texte:
          "Pour un achat non essentiel, attends deux jours avant de valider. L'envie retombe souvent — et si elle persiste, tu achètes l'esprit tranquille.",
      },
      {
        titre: "Compare avant d'acheter",
        texte:
          'Un comparateur de prix ou une recherche rapide de deux minutes évite pas mal de mauvaises surprises.',
      },
      {
        titre: 'Fais une liste avant les courses',
        texte:
          'Et tiens-t\'y : les achats impulsifs au supermarché pèsent plus vite qu\'on ne le pense sur le budget du mois.',
      },
    ],
  },
  {
    titre: 'Investissement',
    icon: 'query_stats',
    conseils: [
      {
        titre: 'Ne mets pas tous tes œufs dans le même panier',
        texte:
          'Diversifie entre livrets, assurance-vie, PEA... selon ton horizon de temps et ta tolérance au risque.',
      },
      {
        titre: 'Investis ce que tu peux te permettre de ne pas toucher',
        texte:
          "L'argent dont tu as besoin à court terme n'a rien à faire en bourse — les marchés montent et descendent.",
      },
      {
        titre: 'Méfie-toi des promesses de gains rapides',
        texte:
          "Si ça semble trop beau pour être vrai, ça l'est probablement. Prends le temps de te renseigner avant tout placement.",
      },
    ],
  },
  {
    titre: 'Sécurité financière',
    icon: 'shield',
    conseils: [
      {
        titre: 'Vérifie ton taux d\'effort logement',
        texte:
          'Les banques visent 33% max des revenus pour le logement. Au-delà, la marge de manœuvre se réduit vite en cas de coup dur.',
      },
      {
        titre: 'Anticipe les grosses dépenses annuelles',
        texte:
          'Assurance, impôts, cadeaux de fin d\'année : les lisser sur l\'année (comme dans cette app) évite la mauvaise surprise un mois donné.',
      },
      {
        titre: 'Protège tes accès autant que ton argent',
        texte:
          'Un gestionnaire de mots de passe et la double authentification sur tes comptes bancaires sont aussi une forme d\'épargne — celle qu\'on ne perd pas.',
      },
    ],
  },
]

export default function StepAstuces() {
  return (
    <section className="step">
      <h2>
        <Icon name="lightbulb" className="step-title-icon" />
        Astuces
      </h2>
      <p className="step-hint">
        Quelques repères généraux sur l'épargne et le budget — à adapter à ta
        situation, pas des conseils personnalisés.
      </p>

      {THEMES.map((theme) => (
        <div className="analyse" key={theme.titre}>
          <h3>
            <Icon name={theme.icon} className="step-title-icon" />
            {theme.titre}
          </h3>
          <div className="analyse-rows">
            {theme.conseils.map((conseil) => (
              <div className="analyse-row" key={conseil.titre}>
                <Icon name="check_circle" className="analyse-row-icon" />
                <div className="analyse-row-body">
                  <span className="analyse-row-label">{conseil.titre}</span>
                  <span className="analyse-row-sub">{conseil.texte}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
