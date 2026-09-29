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
- **Astuces** — une vingtaine de conseils généraux sur l'épargne et le budget, répartis en 6 thèmes (Épargne, Budget au quotidien, Dettes & crédits, Achats & consommation, Investissement, Sécurité financière).
- **Réinitialiser le mois** — vide le journal du mois affiché et repasse les charges fixes à "À venir", sans toucher aux autres mois.
- **Compte par pseudo + code PIN** — l'écran d'accueil propose de se connecter ou de créer un compte. Un code de secours à noter est affiché une seule fois à la création et après chaque récupération du PIN. Les données sont isolées par utilisateur et le même compte fonctionne sur tous les services homelab.
- **Mode sombre** natif (suit les préférences système ou le thème forcé).

## Stack technique

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- API [homelab-r11](https://homelab-r11.duckdns.org) — comptes anonymes par pseudo + PIN, codes de secours, sessions HTTP sécurisées et stockage privé des budgets
- Icônes [Material Symbols](https://fonts.google.com/icons) (Google)
- Police : [Chivo Mono](https://fonts.google.com/specimen/Chivo+Mono) (titres, interface et chiffres — police unique, auto-hébergée dans `public/fonts/` pour fiabilité de chargement, zéro plein sans point ni barre)
- Déploiement automatique sur [GitHub Pages](https://pages.github.com/) via GitHub Actions à chaque push sur `main`

## Développement local

```bash
npm install
npm run dev      # serveur de dev, http://localhost:5173/monbudget/
npm run build    # build de production dans dist/
```

## Configuration de l'API homelab

L'application appelle l'API du même domaine, sous `/api/`. Elle doit donc être servie par `homelab-r11.duckdns.org` (par exemple dans `/monbudget/`) afin que la session HTTP soit envoyée. L'API est dans le dépôt `homelab-r11-api` : elle stocke le budget dans SQLite, rattaché à l'identifiant du compte connecté.

## Déploiement

Construire l'application puis publier le contenu de `dist/` dans le sous-dossier servi par nginx sur le serveur, typiquement `/monbudget/`. Le chemin de base (`/monbudget/`) est configuré dans `vite.config.js`.
