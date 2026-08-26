export const CATEGORIES_CHARGES_FIXES = [
  {
    id: 'Abonnements',
    icon: 'devices',
    color: '#4a3aa7',
    colorDark: '#9085e9',
    presets: [
      'Netflix',
      'Spotify',
      'Salle de sport',
      'Amazon Prime',
      'Presse / magazines',
      'Jeux vidéo (abonnement)',
      'Application (Duolingo, etc.)',
      'Stockage cloud',
      'VPN',
    ],
  },
  {
    id: 'Alimentation',
    icon: 'shopping_cart',
    color: '#8bc34a',
    colorDark: '#a5d76e',
    presets: ['Courses', 'Marché', 'Panier bio (AMAP)', 'Livraison de repas'],
  },
  {
    id: 'Animaux',
    icon: 'pets',
    color: '#a3852f',
    colorDark: '#d1ab4a',
    presets: ['Assurance animal', 'Nourriture animal', 'Toilettage', 'Vétérinaire (suivi)', 'Pension animalière'],
  },
  {
    id: 'Assurances',
    icon: 'shield',
    color: '#eda100',
    colorDark: '#c98500',
    presets: [
      'Assurance habitation',
      'Assurance auto',
      'Assurance vie',
      'Assurance scolaire',
      'Protection juridique',
      'Garantie panne mécanique',
    ],
  },
  {
    id: 'Autres',
    icon: 'inventory_2',
    color: '#6b6b6b',
    colorDark: '#9a9a9a',
    presets: ['Frais bancaires', 'Cotisation association', 'Dons réguliers', 'Cotisation syndicale', 'Garde-meuble'],
  },
  {
    id: 'Beauté & bien-être',
    icon: 'spa',
    color: '#d6336c',
    colorDark: '#f06595',
    presets: ['Coiffeur (abonnement)', 'Institut / spa (abonnement)', 'Box beauté'],
  },
  {
    id: 'Crédits',
    icon: 'credit_card',
    color: '#e87ba4',
    colorDark: '#d55181',
    presets: ['Crédit auto', 'Crédit conso', 'Crédit travaux', 'Crédit étudiant', 'Rachat de crédit'],
  },
  {
    id: 'Énergie',
    icon: 'bolt',
    color: '#eb6834',
    colorDark: '#d95926',
    presets: ['Électricité', 'Gaz', 'Eau', 'Fioul / bois de chauffage', 'Climatisation'],
  },
  {
    id: 'Épargne',
    icon: 'trending_up',
    color: '#0f9b8e',
    colorDark: '#2ec4b6',
    presets: ['Virement épargne', 'Livret A', 'PEL', 'PEA', "Épargne retraite (PER)", 'Épargne enfants'],
  },
  {
    id: 'Famille',
    icon: 'family_restroom',
    color: '#c96f2e',
    colorDark: '#e08a49',
    presets: [
      "Garde d'enfants",
      'Pension alimentaire',
      'Cantine scolaire',
      'Activités enfants',
      'Frais de scolarité',
      'Argent de poche',
      'Baby-sitting régulier',
    ],
  },
  {
    id: 'Impôts & taxes',
    icon: 'account_balance',
    color: '#5a6b8c',
    colorDark: '#8b9dbf',
    presets: [
      'Impôt sur le revenu',
      'Taxe foncière',
      "Taxe d'habitation",
      'Cotisations URSSAF',
      'Frais comptable',
    ],
  },
  {
    id: 'Logement',
    icon: 'home',
    color: '#2a78d6',
    colorDark: '#3987e5',
    presets: [
      'Loyer',
      'Crédit immobilier',
      'Charges copropriété',
      'Assurance emprunteur',
      'Entretien / travaux',
      'Ordures ménagères',
      'Gardiennage',
    ],
  },
  {
    id: 'Santé',
    icon: 'medical_services',
    color: '#e34948',
    colorDark: '#e66767',
    presets: [
      'Mutuelle santé',
      'Frais médicaux récurrents',
      'Orthodontie',
      'Psychologue / thérapeute',
      'Ostéopathe',
      'Compléments alimentaires',
    ],
  },
  {
    id: 'Télécom',
    icon: 'wifi',
    color: '#1baf7a',
    colorDark: '#199e70',
    presets: ['Internet', 'Mobile', 'Fixe'],
  },
  {
    id: 'Transport',
    icon: 'directions_car',
    color: '#008300',
    colorDark: '#008300',
    presets: [
      'Abonnement transports',
      'Parking',
      'Péage',
      'Entretien véhicule',
      'Location / leasing',
      'Vélo en libre-service',
      'Covoiturage (abonnement)',
    ],
  },
  {
    id: 'Travail / Pro',
    icon: 'work',
    color: '#495057',
    colorDark: '#adb5bd',
    presets: ['Cotisation ordre professionnel', 'Logiciels pro', 'Coworking', 'Formation récurrente'],
  },
]

export function categorieInfo(id) {
  return CATEGORIES_CHARGES_FIXES.find((c) => c.id === id) ?? CATEGORIES_CHARGES_FIXES[0]
}

export const PRESETS_REVENUS = [
  { label: 'Salaire', color: '#1baf7a', colorDark: '#199e70' },
  { label: 'Prime', color: '#1baf7a', colorDark: '#199e70' },
  { label: 'Freelance / à-côté', color: '#1baf7a', colorDark: '#199e70' },
  { label: 'Revenus locatifs', color: '#1baf7a', colorDark: '#199e70' },
  { label: 'Allocations', color: '#1baf7a', colorDark: '#199e70' },
  { label: 'Pension', color: '#1baf7a', colorDark: '#199e70' },
]

export const CATEGORIES_CHARGES_VARIABLES = [
  {
    id: 'Alimentation',
    icon: 'shopping_cart',
    color: '#8bc34a',
    colorDark: '#a5d76e',
    presets: ['Courses', 'Marché', 'Boulangerie', 'Livraison de repas'],
  },
  {
    id: 'Cadeaux & occasions',
    icon: 'redeem',
    color: '#e8590c',
    colorDark: '#ffa94d',
    presets: ['Anniversaire', 'Noël', 'Mariage'],
  },
  {
    id: 'Divers',
    icon: 'build',
    color: '#495057',
    colorDark: '#adb5bd',
    presets: ['Bricolage', 'Imprévu', 'Autre'],
  },
  {
    id: 'Famille & enfants',
    icon: 'child_care',
    color: '#c96f2e',
    colorDark: '#e08a49',
    presets: ['Vêtements enfants', 'Jouets', 'Sortie enfants'],
  },
  {
    id: 'Loisirs & culture',
    icon: 'theater_comedy',
    color: '#1098ad',
    colorDark: '#66d9e8',
    presets: ['Cinéma', 'Concert / spectacle', 'Livres', 'Jeux vidéo', 'Activité sportive ponctuelle'],
  },
  {
    id: 'Restaurants & sorties',
    icon: 'restaurant',
    color: '#d6336c',
    colorDark: '#f06595',
    presets: ['Restaurant', 'Bar / Café', 'Fast-food', 'Sortie entre amis'],
  },
  {
    id: 'Santé & beauté',
    icon: 'medication',
    color: '#e34948',
    colorDark: '#e66767',
    presets: ['Pharmacie', 'Coiffeur', 'Soins / esthétique', 'Médecin (hors mutuelle)'],
  },
  {
    id: 'Shopping',
    icon: 'shopping_bag',
    color: '#ae3ec9',
    colorDark: '#da77f2',
    presets: ['Vêtements', 'Chaussures', 'High-tech', 'Maison / déco'],
  },
  {
    id: 'Transport',
    icon: 'directions_car',
    color: '#008300',
    colorDark: '#008300',
    presets: ['Essence', 'Taxi / VTC', 'Parking ponctuel', 'Billet train / avion'],
  },
  {
    id: 'Voyages',
    icon: 'flight',
    color: '#1864ab',
    colorDark: '#74c0fc',
    presets: ['Hôtel', 'Location vacances', 'Activités sur place'],
  },
]

export function categorieInfoVariable(id) {
  return (
    CATEGORIES_CHARGES_VARIABLES.find((c) => c.id === id) ?? CATEGORIES_CHARGES_VARIABLES[0]
  )
}

export const FREQUENCES = [
  { value: 'mensuel', label: 'Mensuelle', diviseur: 1 },
  { value: 'trimestriel', label: 'Trimestrielle', diviseur: 3 },
  { value: 'annuel', label: 'Annuelle', diviseur: 12 },
]

export const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

/**
 * Moyenne mensuelle théorique (montant lissé sur 12 mois) — utile comme
 * repère de coût moyen, mais n'est plus ce qui compte dans les totaux :
 * une charge annuelle/trimestrielle ne débite le compte que certains mois.
 */
export function montantMensualise(montant, frequence) {
  const f = FREQUENCES.find((f) => f.value === frequence) ?? FREQUENCES[0]
  const m = Number(montant) || 0
  return m / f.diviseur
}

/**
 * Une charge trimestrielle/annuelle n'est due que le(s) mois où elle tombe
 * réellement, à partir de son mois de référence (moisPrelevement, 1-12).
 * Sans mois configuré, on la considère non due (0€ tant que non précisée).
 */
export function estDueCeMois(item, date = new Date()) {
  if (item.frequence === 'mensuel') return true
  if (!item.moisPrelevement) return false
  const moisActuel = date.getMonth() + 1
  const moisRef = Number(item.moisPrelevement)
  if (item.frequence === 'annuel') return moisActuel === moisRef
  if (item.frequence === 'trimestriel') {
    return ((moisActuel - moisRef) % 3 + 3) % 3 === 0
  }
  return false
}

export function montantCeMois(item, date = new Date()) {
  return estDueCeMois(item, date) ? Number(item.montant) || 0 : 0
}

export function sommeMontants(items) {
  return items.reduce((total, item) => total + (Number(item.montant) || 0), 0)
}

/** Total réel des charges fixes qui débitent le compte ce mois-ci. */
export function sommeChargesFixesCeMois(items, date = new Date()) {
  return items.reduce((total, item) => total + montantCeMois(item, date), 0)
}

/** Clé "AAAA-MM" identifiant un mois — sert à stocker un statut par mois. */
export function cleMois(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Le statut "prélevée" d'une charge fixe est propre à chaque mois : on garde
 * la liste des mois où elle a été cochée, pas un simple booléen global —
 * sinon la coche resterait allumée en changeant de mois.
 */
export function estPreleveeCeMois(item, dateReference = new Date()) {
  return (item.moisPreleves ?? []).includes(cleMois(dateReference))
}

export function formatEuros(montant) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(Number(montant) || 0)
}

export function nouvelId() {
  return Math.random().toString(36).slice(2, 10)
}

export function dateDuJour() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export function formatDateCourte(dateStr) {
  if (!dateStr) return ''
  const [an, mois, jour] = dateStr.split('-')
  return `${jour}/${mois}`
}

/** Une dépense variable appartient au mois de sa propre date, pas au mois affiché. */
export function estDansLaPeriode(item, dateReference = new Date()) {
  if (!item.date) return false
  const [annee, mois] = item.date.split('-').map(Number)
  return annee === dateReference.getFullYear() && mois === dateReference.getMonth() + 1
}

export function chargesVariablesDuMois(items, dateReference = new Date()) {
  return items.filter((item) => estDansLaPeriode(item, dateReference))
}

/**
 * Date par défaut pour une nouvelle dépense : aujourd'hui si on consulte le
 * mois en cours, sinon le 1er du mois affiché (on regarde un autre mois que
 * l'actuel, la nouvelle entrée doit tomber dedans par défaut).
 */
export function dateParDefaut(dateReference = new Date()) {
  const maintenant = new Date()
  const memePeriode =
    dateReference.getFullYear() === maintenant.getFullYear() &&
    dateReference.getMonth() === maintenant.getMonth()
  if (memePeriode) return dateDuJour()
  const annee = dateReference.getFullYear()
  const mois = String(dateReference.getMonth() + 1).padStart(2, '0')
  return `${annee}-${mois}-01`
}

export function moisPrecedent(dateReference) {
  return new Date(dateReference.getFullYear(), dateReference.getMonth() - 1, 1)
}

export function joursDansLeMois(dateReference) {
  return new Date(dateReference.getFullYear(), dateReference.getMonth() + 1, 0).getDate()
}

/** Jours restants dans le mois affiché (aujourd'hui inclus) ; le mois entier si ce n'est pas le mois en cours. */
export function joursRestants(dateReference) {
  const total = joursDansLeMois(dateReference)
  const maintenant = new Date()
  const memePeriode =
    dateReference.getFullYear() === maintenant.getFullYear() &&
    dateReference.getMonth() === maintenant.getMonth()
  if (!memePeriode) return total
  return Math.max(1, total - maintenant.getDate() + 1)
}
