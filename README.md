# Mon budget mensuel

Application web de gestion de budget personnel — revenus, charges fixes, charges variables, résumé et analyse financière, mois par mois.

🔗 **En ligne :** https://yesman-plg.github.io/monbudget/

## Fonctionnalités

- **Revenus** — liste libre avec suggestions rapides (salaire, primes, freelance...).
- **Charges fixes** — 16 catégories (Logement, Énergie, Assurances, Crédits...), chacune avec ses propres suggestions. Fréquence mensuelle, trimestrielle ou annuelle : une charge non mensuelle précise son **mois de prélèvement** et ne compte dans le total que le(s) mois où elle tombe réellement. Statut *À venir / Prélevée* propre à chaque mois (ne se reporte pas d'un mois sur l'autre).
- **Suivi de crédit** — pour la catégorie Crédits : durée (en mois) et nombre d'échéances remboursées, incrémenté automatiquement à chaque fois qu'on coche "Prélevée".
- **Charges variables** — journal de dépenses daté (10 catégories), rempli au fil du mois. Chaque dépense reste rattachée au mois de sa propre date.
- **Sélecteur de mois/année** en tête de page — référence pour tous les calculs "dû ce mois-ci". Les revenus et charges fixes sont partagés entre tous les mois ; le journal des charges variables et les statuts "prélevée" sont propres à chaque mois.
- **Résumé** — tuiles de synthèse, répartition par catégorie, section **Analyse** (taux d'épargne, taux d'effort logement, règle 50/30/20, reste à vivre par jour, tendance vs mois précédent) et **comparaison entre deux mois**.
- **Réinitialiser le mois** — vide le journal du mois affiché et repasse les charges fixes à "À venir", sans toucher aux autres mois.
- **Compte Google + sauvegarde cloud** — connexion via Firebase Authentication, données stockées dans Firestore, isolées par utilisateur (chacun ne voit que les siennes). Migration automatique des données locales au premier login.
- **Mode sombre** natif (suit les préférences système ou le thème forcé).

## Stack technique

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/) — Authentication (Google) + Firestore
- Icônes [Material Symbols](https://fonts.google.com/icons) (Google)
- Polices : [Fraunces](https://fonts.google.com/specimen/Fraunces) (titres), [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) (interface), [Source Code Pro](https://fonts.google.com/specimen/Source+Code+Pro) (chiffres — auto-hébergée dans `public/fonts/` pour fiabilité de chargement)
- Déploiement automatique sur [GitHub Pages](https://pages.github.com/) via GitHub Actions à chaque push sur `main`

## Développement local

```bash
npm install
npm run dev      # serveur de dev, http://localhost:5173/monbudget/
npm run build    # build de production dans dist/
```

## Configuration Firebase

La config dans `src/firebase.js` (clé API publique, sans risque) pointe vers le projet Firebase du site. La sécurité est assurée par les **règles Firestore** (`firestore.rules`, à publier depuis la console Firebase) : chaque utilisateur ne peut lire/écrire que son propre document `users/{uid}`.

## Déploiement

Tout push sur `main` déclenche `.github/workflows/deploy.yml` : build de l'app puis publication sur GitHub Pages. Le chemin de base (`/monbudget/`) est configuré dans `vite.config.js`.
