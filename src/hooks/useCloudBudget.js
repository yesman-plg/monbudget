import { useEffect, useRef, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

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
 * Stocke le budget dans Firestore (un document par utilisateur), avec
 * chargement initial et écriture différée (debounce) pour éviter d'écrire
 * à chaque frappe. `data` est null tant que rien n'est encore chargé.
 */
export function useCloudBudget(uid) {
  const [data, setDataState] = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!uid) return
    let annule = false

    getDoc(doc(db, 'users', uid)).then((snap) => {
      if (annule) return
      if (snap.exists()) {
        setDataState(snap.data())
      } else {
        const initial = lireDonneesLocales()
        setDataState(initial)
        setDoc(doc(db, 'users', uid), initial)
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
          setDoc(doc(db, 'users', uid), suivant)
        }, DELAI_ENREGISTREMENT)
        return suivant
      })
    }
  }

  return { data, creerSetter }
}
