import { useEffect, useRef, useState } from 'react'
import { appelerApi } from '../api'

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

/**
 * Stocke le budget dans l'API homelab (un enregistrement par utilisateur), avec
 * chargement initial et écriture différée (debounce) pour éviter d'écrire à
 * chaque frappe. `data` est null tant que rien n'est encore chargé.
 */
export function useCloudBudget() {
  const [data, setDataState] = useState(null)
  const [erreur, setErreur] = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    let annule = false

    async function charger() {
      try {
        const { budget } = await appelerApi('/budget')
        if (annule) return
        if (budget) {
          setDataState(budget)
          return
        }

        const initial = lireDonneesLocales()
        await appelerApi('/budget', { method: 'PUT', body: JSON.stringify({ budget: initial }) })
        if (annule) return
        setDataState(initial)
      } catch {
        if (!annule) setErreur('Impossible de charger ce budget. Réessaie dans un instant.')
      }
    }

    charger()

    return () => {
      annule = true
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Champ par champ, avec support des mises à jour fonctionnelles
  // (ex. setChargesFixes((fixes) => fixes.map(...))) comme useState.
  function creerSetter(champ) {
    return (valeurOuFn) => {
      setDataState((prev) => {
        const valeur = typeof valeurOuFn === 'function' ? valeurOuFn(prev[champ]) : valeurOuFn
        const suivant = { ...prev, [champ]: valeur }
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(async () => {
          try {
            await appelerApi('/budget', { method: 'PUT', body: JSON.stringify({ budget: suivant }) })
          } catch {
            setErreur('La dernière modification n’a pas pu être enregistrée.')
          }
        }, DELAI_ENREGISTREMENT)
        return suivant
      })
    }
  }

  return { data, erreur, creerSetter }
}
