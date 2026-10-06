# Prépa EOPN

Application web de préparation à la sélection **EOPN** (Élève Officier du Personnel Navigant) de l'Armée de l'Air et de l'Espace.
Pensée pour le téléphone, installable (PWA), utilisable **hors ligne**, sans serveur : tes données restent sur ton appareil (localStorage) et s'exportent en JSON.

> Application personnelle et non officielle. Le déroulé de la sélection est résumé dans [`docs/selection-eopn.md`](docs/selection-eopn.md) avec ce qui est confirmé et ce qui reste à vérifier.

## Modules
| Module | État |
|---|---|
| Tests psychotechniques (29 générateurs infinis + 3 examens blancs) | ✅ |
| Maths (10 chapitres, de la seconde à la terminale) | ✅ |
| Tableau de bord, révision espacée, séries de jours | ✅ |
| Physique, Anglais, Culture & BIA, Entretien, Sport, Planning | à venir |

## Mettre le site en ligne gratuitement

### Option 1 : GitHub Pages (recommandé, déjà le dépôt du projet)
1. Sur GitHub, ouvre le dépôt → **Settings** → **Pages**.
2. Dans **Build and deployment** : Source = **Deploy from a branch**, Branch = **main**, dossier **/ (root)** → **Save**.
3. Attends 1 à 2 minutes : le site est disponible à l'adresse
   `https://<ton-pseudo>.github.io/<nom-du-depot>/` (ici : https://matmatval55-png.github.io/Pr-paration-EOPN/).
4. Chaque nouveau commit sur `main` met le site à jour automatiquement.

### Option 2 : Netlify
1. Va sur https://app.netlify.com → **Add new site** → **Import an existing project** → GitHub → choisis le dépôt.
2. Build command : *(vide)* · Publish directory : `.` → **Deploy**.
   (Ou, sans compte GitHub : glisse-dépose le dossier du projet sur https://app.netlify.com/drop.)

### Installer l'application sur ton téléphone
- **iPhone (Safari)** : ouvre le site → bouton Partager → « Sur l'écran d'accueil ».
- **Android (Chrome)** : menu ⋮ → « Installer l'application ».

Après la première ouverture, tout fonctionne hors ligne. Les mises à jour du site sont téléchargées en arrière-plan et s'affichent au lancement suivant.

### Sauvegarder ses progrès
Réglages (onglet « Plus ») → **Exporter** : un fichier `.json` est téléchargé. Pour le restaurer (nouveau téléphone…) : **Importer**.

## Développement
Aucune dépendance ni étape de build : HTML, CSS et JavaScript (modules ES).

```bash
npx http-server -c-1 -p 8080 .   # lancer en local → http://localhost:8080
npm test                         # tests des générateurs (Node 18+)
node tests/e2e.mjs               # test navigateur (Playwright, serveur local lancé)
```

Quand tu ajoutes un fichier JS/CSS, ajoute-le à la liste `FILES` de `sw.js` et incrémente `VERSION` (le test `tests/sw.test.js` le vérifie).

### Arborescence
```
index.html, manifest.webmanifest, sw.js   coquille de l'app, PWA, hors ligne
css/app.css                               styles (mobile d'abord, clair/sombre)
js/app.js                                 navigation
js/core/                                  stockage, stats, révision espacée, moteur de quiz, graphiques
js/psycho/                                générateurs psychotechniques + examens blancs
js/maths/                                 chapitres de maths (cours, méthode, exercices générés)
js/pages/                                 écrans
docs/selection-eopn.md                    résumé de la sélection et sources
tests/                                    tests automatiques
```
