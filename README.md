# Prépa EOPN

Application web de préparation à la sélection **EOPN** (Élève Officier du Personnel Navigant) de l'Armée de l'Air et de l'Espace.
Pensée pour le téléphone, installable (PWA), utilisable **hors ligne**, sans serveur : tes données restent sur ton appareil (localStorage) et s'exportent en JSON.

> Application personnelle et non officielle. Le déroulé de la sélection est résumé dans [`docs/selection-eopn.md`](docs/selection-eopn.md) avec ce qui est confirmé et ce qui reste à vérifier.

## Modules
| Module | Contenu |
|---|---|
| 📖 Cours | Bibliothèque de fiches à lire (dont **fiches visuelles** : photos d’aéronefs, carte des bases, insignes, organigramme, schémas), recherche plein texte, suivi de lecture |
| ✈️ Tests type sélection pilote | Inspirés des sélections DLR / Air France / ENAC : N-back, mémoire défilante, compteurs, angles, cadrans, réaction go/no-go · examen blanc dédié |
| 🧠 Personnalité | Questionnaire d’entraînement (60 items), profil sur 6 dimensions, cohérence, désirabilité sociale, questions du psychologue |
| 🎯 Jour J | Simulation complète (≈ 1 h 30, avec pauses) et courte, déroulé des 4 jours, dernière semaine, gestion du stress |
| 👥 Épreuve de groupe | 24 sujets, séance chronométrée avec rappels, grille d’évaluation pour un proche, quiz de 30 situations |
| 🩺 Médical & santé | Vérifications à faire tôt, aptitude (SIGYCOP), journal quotidien sommeil/sport/caféine/alcool avec conseils |
| 🧭 Coach et suivi | Niveau mémorisé par exercice (monte à 4/5, baisse après 2 erreurs), séances personnalisées (révisions dues, points faibles, exercices oubliés, découverte), suivi de maîtrise, tendances 7 j, conseils, évolution des examens blancs |
| 🧠 Psychotechniques | 21 exercices : suites, matrices, dominos, raisonnement verbal (40 q), rotations, patrons de cubes, mécanique, barrage, comptage, codage, mémoire, calcul, problèmes, multitâche, **manche et palonniers au gyroscope**, instruments, caps, **structuration d’informations**, **situations de vol animées** (VOR/RMI, vent, tour de piste, PAPI, attitudes, anticollision, instruments → image de l’avion, CDI/ILS, circuit d’attente, signaux lumineux, interception, 30 urgences) · 3 examens blancs |
| 📐 Maths | 10 chapitres (seconde → terminale), exercices générés corrigés pas à pas, **test de positionnement** |
| ⚛️ Physique | 7 chapitres : unités, cinématique, Newton, énergie, électricité, optique, mécanique du vol |
| 🇬🇧 Anglais | Grammaire (68), vocabulaire C1 (56), vocabulaire aéro (80), phraséologie (32), alphabet OACI, **écoute de messages ATC**, compréhension écrite (12 textes, 60 q), flashcards, test type Chambéry 150 q / 55 min |
| ✈️ Culture & BIA | Histoire (42), AAE (52), défense (45), 4 thèmes BIA (40 chacun), BIA blanc ; faits vérifiés : `docs/verification.md` |
| 🎤 Entretien | 36 questions commentées, notes, simulation chronométrée **avec enregistrement vocal**, auto-évaluation |
| 🏃 Sport | Barème officiel, calculateur, **bande sonore Luc Léger intégrée**, suivi et graphiques, programme de 12 semaines |
| 🗓️ Planning | Programme hebdomadaire (date, heures, jours, points faibles), **export vers l’agenda (.ics)** |
| ✅ Checklist | Étapes de candidature (CIRFA, dossier, médical, jour J) avec sources |
| 📊 Tableau de bord | Statistiques, graphiques, points faibles, révision espacée, séries, **signalement d’erreurs**, rappel de sauvegarde |

### Crédits
- Photos d’aéronefs : fiches officielles du ministère des Armées (defense.gouv.fr), utilisées pour une révision personnelle ; source indiquée sous chaque photo (`js/cours/credits.js`).
- Contour de la France : IGN Admin Express (Licence ouverte Etalab), via le projet france-geojson.

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
js/cours/                                 fiches de la bibliothèque de cours
js/pages/                                 écrans
docs/selection-eopn.md                    résumé de la sélection et sources
tests/                                    tests automatiques
```
