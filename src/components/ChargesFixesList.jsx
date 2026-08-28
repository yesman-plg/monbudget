import { useEffect, useState } from 'react'
import Icon from './Icon'
import CategoryPicker from './CategoryPicker'
import {
  CATEGORIES_CHARGES_FIXES,
  FREQUENCES,
  MOIS,
  categorieInfo,
  montantMensualise,
  estDueCeMois,
  montantCeMois,
  sommeChargesFixesCeMois,
  cleMois,
  estPreleveeCeMois,
  nouvelId,
  formatEuros,
  dateDuJour,
} from '../utils/budget'

function formulaireVide() {
  return {
    label: '',
    montant: '',
    frequence: 'mensuel',
    jourPrelevement: '',
    moisPrelevement: '',
    dateDebut: '',
    dureeMois: '',
    echeancesPassees: '',
  }
}

/**
 * Liste des charges fixes : chaque ligne est un rappel compact (icône,
 * libellé, catégorie · fréquence, statut, montant) — un tap dessus ouvre le
 * tiroir en mode édition. Le statut (prélevée / à venir) se bascule
 * directement sur la ligne, sans ouvrir le tiroir.
 * L'ajout se fait dans le même tiroir : catégorie, éventuellement un
 * intitulé courant, champs à compléter, puis "Ajouter la charge" valide —
 * rien n'est créé avant ce clic.
 */
export default function ChargesFixesList({ items, onChange, dateReference = new Date() }) {
  const [categorieOuverte, setCategorieOuverte] = useState(null)
  const [drawerOuvert, setDrawerOuvert] = useState(false)
  const [editionId, setEditionId] = useState(null)
  const [formulaire, setFormulaire] = useState(formulaireVide)

  function ouvrirAjout() {
    setEditionId(null)
    setCategorieOuverte(null)
    setFormulaire(formulaireVide())
    setDrawerOuvert(true)
  }

  function ouvrirEdition(item) {
    setEditionId(item.id)
    setCategorieOuverte(item.categorie)
    setFormulaire({
      label: item.label,
      montant: item.montant,
      frequence: item.frequence,
      jourPrelevement: item.jourPrelevement ?? '',
      moisPrelevement: item.moisPrelevement ?? '',
      dateDebut: item.dateDebut ?? '',
      dureeMois: item.dureeMois ?? '',
      echeancesPassees: item.echeancesPassees ?? '',
    })
    setDrawerOuvert(true)
  }

  function choisirCategorie(id) {
    setCategorieOuverte(id)
    // Une charge qui reprend un crédit démarré ailleurs : la date du jour
    // est un point de départ raisonnable, modifiable ensuite.
    if (id === 'Crédits' && !formulaire.dateDebut) {
      setFormulaire((f) => ({ ...f, dateDebut: dateDuJour() }))
    }
  }

  function choisirPreset(preset) {
    setFormulaire((f) => ({ ...f, label: preset }))
  }

  function majFormulaire(champ, valeur) {
    setFormulaire((f) => {
      if (champ !== 'frequence') return { ...f, [champ]: valeur }
      const moisPrelevement =
        valeur !== 'mensuel' && !f.moisPrelevement
          ? String(dateReference.getMonth() + 1)
          : f.moisPrelevement
      return { ...f, frequence: valeur, moisPrelevement }
    })
  }

  function confirmer() {
    if (!categorieOuverte) return
    const champs = {
      label: formulaire.label,
      montant: formulaire.montant,
      frequence: formulaire.frequence,
      categorie: categorieOuverte,
      jourPrelevement: formulaire.jourPrelevement,
      moisPrelevement: formulaire.moisPrelevement,
      dureeMois: formulaire.dureeMois,
      echeancesPassees: formulaire.echeancesPassees || 0,
      dateDebut: formulaire.dateDebut,
    }
    if (editionId) {
      onChange(items.map((i) => (i.id === editionId ? { ...i, ...champs } : i)))
    } else {
      onChange([...items, { id: nouvelId(), moisPreleves: [], ...champs }])
    }
    setDrawerOuvert(false)
  }

  function supprimerDepuisTiroir() {
    if (!editionId) return
    onChange(items.filter((i) => i.id !== editionId))
    setDrawerOuvert(false)
  }

  useEffect(() => {
    if (!drawerOuvert) return
    function surEchap(e) {
      if (e.key === 'Escape') setDrawerOuvert(false)
    }
    document.addEventListener('keydown', surEchap)
    return () => document.removeEventListener('keydown', surEchap)
  }, [drawerOuvert])

  // Le statut "prélevée" est propre au mois affiché (voir estPreleveeCeMois).
  // Pour un crédit, valider "Prélevée" avance aussi le compteur d'échéances
  // (et le recule si on annule) — un seul update atomique.
  function basculerPreleve(item) {
    const cle = cleMois(dateReference)
    const dejaPreleve = (item.moisPreleves ?? []).includes(cle)
    const nouveauPreleve = !dejaPreleve
    onChange(
      items.map((i) => {
        if (i.id !== item.id) return i
        const moisPreleves = nouveauPreleve
          ? [...(i.moisPreleves ?? []), cle]
          : (i.moisPreleves ?? []).filter((m) => m !== cle)
        if (i.categorie !== 'Crédits') return { ...i, moisPreleves }
        const actuel = Number(i.echeancesPassees) || 0
        const duree = i.dureeMois ? Number(i.dureeMois) : null
        const suivant = nouveauPreleve
          ? duree
            ? Math.min(actuel + 1, duree)
            : actuel + 1
          : Math.max(actuel - 1, 0)
        return { ...i, moisPreleves, echeancesPassees: suivant }
      })
    )
  }

  const itemsDus = items.filter((i) => estDueCeMois(i, dateReference))
  const total = sommeChargesFixesCeMois(items, dateReference)
  const totalPreleve = itemsDus
    .filter((i) => estPreleveeCeMois(i, dateReference))
    .reduce((sum, i) => sum + montantCeMois(i, dateReference), 0)
  const totalAVenir = total - totalPreleve
  const nbPreleve = itemsDus.filter((i) => estPreleveeCeMois(i, dateReference)).length
  const pourcentPreleve = total > 0 ? (totalPreleve / total) * 100 : 0

  const catOuverte = CATEGORIES_CHARGES_FIXES.find((c) => c.id === categorieOuverte)
  const itemEnEdition = editionId ? items.find((i) => i.id === editionId) : null
  const preleveeEnEdition = itemEnEdition ? estPreleveeCeMois(itemEnEdition, dateReference) : false
  const frequenceLabel = (valeur) => FREQUENCES.find((f) => f.value === valeur)?.label ?? valeur
  const pasMensuelleFormulaire = formulaire.frequence !== 'mensuel'

  // Les cartes de la même catégorie se retrouvent groupées ensemble
  // (tri stable : dans une même catégorie, l'ordre d'ajout est conservé).
  const ordreCategories = CATEGORIES_CHARGES_FIXES.map((c) => c.id)
  const itemsTries = [...items].sort(
    (a, b) => ordreCategories.indexOf(a.categorie) - ordreCategories.indexOf(b.categorie)
  )

  return (
    <div className="item-list">
      {items.length > 0 && (
        <div className="charges-overview">
          <div className="charges-overview-label">
            <strong>{nbPreleve}</strong>/{itemsDus.length} charges prélevées ce mois-ci
          </div>
          <div className="charges-overview-track">
            <div className="charges-overview-fill good" style={{ width: `${pourcentPreleve}%` }}>
              {formatEuros(totalPreleve)}
            </div>
            <div className="charges-overview-fill pending" style={{ width: `${100 - pourcentPreleve}%` }}>
              {formatEuros(totalAVenir)}
            </div>
          </div>
        </div>
      )}

      <button type="button" className="btn-ajouter-charge" onClick={ouvrirAjout}>
        <Icon name="add" />
        Ajouter une charge fixe
      </button>

      {drawerOuvert && (
        <div className="charges-drawer-overlay" onClick={() => setDrawerOuvert(false)}>
          <div
            className="charges-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={editionId ? 'Modifier la charge fixe' : 'Nouvelle charge fixe'}
            style={catOuverte ? { '--chip-color': catOuverte.color, '--chip-color-dark': catOuverte.colorDark } : undefined}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="charges-drawer-head">
              <h3>{editionId ? 'Modifier la charge' : 'Nouvelle charge fixe'}</h3>
              <button
                type="button"
                className="btn-icon"
                aria-label="Fermer"
                onClick={() => setDrawerOuvert(false)}
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="charges-drawer-body">
              <span className="form-field-label">Catégorie</span>
              <CategoryPicker
                categories={CATEGORIES_CHARGES_FIXES}
                selectionnee={categorieOuverte}
                onSelect={choisirCategorie}
              />

              {catOuverte && (
                <>
                  {!editionId && (
                    <div className="preset-chips">
                      {catOuverte.presets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          className={`preset-chip ${formulaire.label === preset ? 'selectionne' : ''}`}
                          style={{ '--chip-color': catOuverte.color, '--chip-color-dark': catOuverte.colorDark }}
                          onClick={() => choisirPreset(preset)}
                        >
                          <Icon name={formulaire.label === preset ? 'check' : 'add'} />
                          {preset}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="form-field-label">Libellé</span>
                  <input
                    type="text"
                    placeholder="Ex. Netflix"
                    value={formulaire.label}
                    onChange={(e) => majFormulaire('label', e.target.value)}
                  />

                  <div className="form-row">
                    <label className="form-field">
                      <span className="form-field-label">Montant</span>
                      <div className="charge-fixe-montant-champ">
                        <input
                          type="number"
                          inputMode="decimal"
                          placeholder="0"
                          value={formulaire.montant}
                          onChange={(e) => majFormulaire('montant', e.target.value)}
                        />
                        <span className="unit">€</span>
                      </div>
                    </label>
                    <label className="form-field">
                      <span className="form-field-label">Fréquence</span>
                      <select
                        value={formulaire.frequence}
                        onChange={(e) => majFormulaire('frequence', e.target.value)}
                      >
                        {FREQUENCES.map((f) => (
                          <option key={f.value} value={f.value}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="form-field">
                    <span className="form-field-label">Jour de prélèvement</span>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      placeholder="jj"
                      value={formulaire.jourPrelevement}
                      onChange={(e) => majFormulaire('jourPrelevement', e.target.value)}
                    />
                  </label>

                  {pasMensuelleFormulaire && (
                    <label className="form-field">
                      <span className="form-field-label">Prélevée en</span>
                      <select
                        value={formulaire.moisPrelevement}
                        onChange={(e) => majFormulaire('moisPrelevement', e.target.value)}
                      >
                        <option value="" disabled>
                          —
                        </option>
                        {MOIS.map((mois, index) => (
                          <option key={mois} value={index + 1}>
                            {mois}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {pasMensuelleFormulaire && formulaire.montant !== '' && (
                    <p className="drawer-note">
                      ≈ {formatEuros(montantMensualise(formulaire.montant, formulaire.frequence))} / mois en moyenne
                    </p>
                  )}

                  {categorieOuverte === 'Crédits' && (
                    <>
                      <label className="form-field">
                        <span className="form-field-label">Date de début</span>
                        <input
                          type="date"
                          value={formulaire.dateDebut}
                          onChange={(e) => majFormulaire('dateDebut', e.target.value)}
                        />
                      </label>
                      <div className="form-row">
                        <label className="form-field">
                          <span className="form-field-label">Durée</span>
                          <input
                            type="number"
                            min="1"
                            placeholder="—"
                            value={formulaire.dureeMois}
                            onChange={(e) => majFormulaire('dureeMois', e.target.value)}
                          />
                        </label>
                        <label className="form-field">
                          <span className="form-field-label">Échéances passées</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={formulaire.echeancesPassees}
                            onChange={(e) => majFormulaire('echeancesPassees', e.target.value)}
                          />
                        </label>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="charges-drawer-foot">
              {editionId ? (
                <>
                  <button type="button" className="btn-supprimer" onClick={supprimerDepuisTiroir}>
                    Supprimer
                  </button>
                  <button
                    type="button"
                    className={`btn-preleve-tiroir ${preleveeEnEdition ? 'on' : ''}`}
                    aria-label={preleveeEnEdition ? 'Marquer comme à venir' : 'Marquer comme prélevée'}
                    onClick={() => {
                      basculerPreleve(itemEnEdition)
                      setDrawerOuvert(false)
                    }}
                  >
                    Prélever
                  </button>
                  <button type="button" className="btn-confirmer-ajout" disabled={!categorieOuverte} onClick={confirmer}>
                    Enregistrer
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn-annuler" onClick={() => setDrawerOuvert(false)}>
                    Annuler
                  </button>
                  <button type="button" className="btn-confirmer-ajout" disabled={!categorieOuverte} onClick={confirmer}>
                    Ajouter la charge
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="charges-grid item-list-card">
        {itemsTries.map((item) => {
          const cat = categorieInfo(item.categorie)
          const pasMensuelle = item.frequence !== 'mensuel'
          const due = estDueCeMois(item, dateReference)
          const preleveCeMois = estPreleveeCeMois(item, dateReference)
          return (
            <div
              className="item-row"
              key={item.id}
              style={{ '--chip-color': cat.color, '--chip-color-dark': cat.colorDark }}
            >
              <button type="button" className="item-row-main" onClick={() => ouvrirEdition(item)}>
                <span className="icon-badge">
                  <Icon name={cat.icon} />
                </span>
                <span className="item-main">
                  <span className="item-title">{item.label || 'Sans nom'}</span>
                  <span className="item-sub">
                    {item.categorie} · {frequenceLabel(item.frequence)}
                    {item.jourPrelevement ? ` · le ${item.jourPrelevement}` : ''}
                    {pasMensuelle && !due ? ' · ne tombe pas ce mois-ci' : ''}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className={`status-chip ${preleveCeMois ? 'paid' : 'pending'}`}
                disabled={pasMensuelle && !due}
                onClick={() => basculerPreleve(item)}
                aria-label={preleveCeMois ? 'Marquer comme à venir' : 'Marquer comme prélevée'}
              >
                {preleveCeMois ? 'Prélevée' : 'À venir'}
              </button>
              <span className="item-amount">{formatEuros(item.montant)}</span>
            </div>
          )
        })}
      </div>

      {items.length > 0 && (
        <div className="item-list-total">
          Total charges fixes ce mois-ci : {formatEuros(total)}
        </div>
      )}
    </div>
  )
}
