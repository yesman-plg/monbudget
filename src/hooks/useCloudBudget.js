import { useEffect, useRef, useState } from 'react'
import { pb } from '../pocketbaseConfig'

const COLLECTION = 'budget_budgets'
const DELAI_ENREGISTREMENT = 600 // ms après la dernière modif avant écriture

function periodeParDefaut() {
  const d = new Date()
  return { mois: d.getMonth() + 1, annee: d.getFullYear() }
}

// Reprend ce qui était déjà dans le navigateur (avant la connexion) pour ne
// rien perdre lors du tout premier passage au cloud.
function lireDonneesLocales() {
  function lire(cle) {
    try {
      const brut = localStorage.getItem(cle)
      return brut ? JSON.parse(brut) : null
    } catch {
      return null
    }
  }
  return {
    revenus: lire('budget.revenus') ?? [],
    chargesFixes: lire('budget.chargesFixes') ?? [],
    chargesVariables: lire('budget.chargesVariables') ?? [],
    periode: lire('budget.periode') ?? periodeParDefaut(),
  }
}

async function trouverBudget(uid) {
  try {
    return await pb.collection(COLLECTION).getFirstListItem(pb.filter('user = {:uid}', { uid }))
  } catch (err) {
    if (err?.status === 404) return null
    throw err
  }
}

/**
 * Stocke le budget dans PocketBase (un enregistrement par utilisateur, dans
 * budget_budgets), avec chargement initial et écriture différée (debounce)
 * pour éviter d'écrire à chaque frappe. `data` est null tant que rien n'est
 * encore chargé.
 */
export function useCloudBudget(uid) {
  const [data, setDataState] = useState(null)
  const recordIdRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!uid) return
    let annule = false

    trouverBudget(uid).then((existant) => {
      if (annule) return
      if (existant) {
        recordIdRef.current = existant.id
        setDataState({
          revenus: existant.revenus ?? [],
          chargesFixes: existant.chargesFixes ?? [],
          chargesVariables: existant.chargesVariables ?? [],
          periode: existant.periode ?? periodeParDefaut(),
        })
      } else {
        const initial = lireDonneesLocales()
        setDataState(initial)
        pb.collection(COLLECTION)
          .create({ user: uid, ...initial })
          .then((rec) => {
            if (!annule) recordIdRef.current = rec.id
          })
      }
    })

    return () => {
      annule = true
    }
  }, [uid])

  // Champ par champ, avec support des mises à jour fonctionnelles
  // (ex. setChargesFixes((fixes) => fixes.map(...))) comme useState.
  function creerSetter(champ) {
    return (valeurOuFn) => {
      setDataState((prev) => {
        const valeur = typeof valeurOuFn === 'function' ? valeurOuFn(prev[champ]) : valeurOuFn
        const suivant = { ...prev, [champ]: valeur }
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
          if (recordIdRef.current) {
            pb.collection(COLLECTION).update(recordIdRef.current, { [champ]: valeur })
          }
        }, DELAI_ENREGISTREMENT)
        return suivant
      })
    }
  }

  return { data, creerSetter }
}
