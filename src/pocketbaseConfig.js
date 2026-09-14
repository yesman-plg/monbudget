import PocketBase from 'pocketbase'

// Web (Vite) : PocketBase utilise localStorage par défaut pour persister la
// session, pas besoin d'un store custom comme côté React Native.
// URL en dur (comme firebaseConfig avant elle) : pas de secret ici, et pas
// besoin d'un système de variables d'environnement pour ce petit projet.
export const pb = new PocketBase('https://homelab-r11.duckdns.org/pb')

// Collection My Budget dédiée (voir SETUP.md du projet homelab-r11-api) —
// distincte de celle d'ActiveLog (users), chaque app garde son propre
// espace de comptes malgré l'infra partagée.
export const usersCollection = 'budget_users'
