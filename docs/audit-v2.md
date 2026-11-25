# Audit de livraison de Prépa EOPN V2

État relevé le 25 novembre 2026. Les exercices et les seuils de maîtrise sont des outils de préparation personnelle. Le registre contient 75 générateurs, dont 15 banques totalisant 700 entrées, 20 chapitres de maths et de physique et 80 fiches de bibliothèque.

## État du cahier des charges

| Partie | État | Périmètre vérifié ou restant |
|---|---|---|
| 1–2. Objectif et exécution | Partiel | PWA statique développée et testée par parcours. La qualification finale dépend des points ci-dessous. |
| 3. Reprise | Terminé | Départ au commit `f1e8f0e` de la PR nº 1. Les tests précédents sont conservés. |
| 4. Profil | Terminé | Profil local initial modifiable. Expérience et études ne fixent aucun score. Le temps disponible propose une durée de séance. |
| 5. Audit de l’existant | Partiel | Revue des parcours, du registre, de la persistance, du cache, des exercices modifiés et des formules ciblées. La vérification éditoriale question par question reste incomplète. |
| 6. Sources | Bloqué en partie | Les liens et leur datation antérieure sont conservés. Le proxy renvoie 403 sur des sources officielles dont le ministère des Armées. Les descriptions de format sont étiquetées comme simulations. |
| 7. Moteur psychotechnique | Partiel | Calcul à cinq niveaux et correction d’un biais N-back sur les non-réponses. Les autres progressions et distracteurs restent à valider individuellement. |
| 8. Calcul mental | Partiel | Six familles supplémentaires aux niveaux expert et haute intensité. Saisie directe et méthodes de simplification. Les modes à distraction et à charge combinée n’ont pas été remaniés. |
| 9. Coordination | Partiel | Clavier, pointeur et axes Gamepad sur le manche, mesure de l’écart et du temps hors cible, condition de réussite par axe. Manette et inclinaison physiques non testées. |
| 10. Laboratoire aéronautique | Partiel | Parcours Instruments et Navigation dans le diagnostic. Instruments et scénarios existants conservés. Laboratoire avancé et croisement dynamique des indications incomplets. |
| 11. Mathématiques | Partiel | Dix chapitres conservés et mobilisés au diagnostic et à la simulation longue. La refonte de tous les chapitres est ouverte. |
| 12. Physique | Partiel | Pression et fluides, ondes et échos, gaz parfaits et transferts thermiques. Comparaison numérique indépendante sur les problèmes de niveau 3 des trois nouveaux chapitres. |
| 13. Anglais | Partiel | Texte long avec questions d’inférence et diction synthétique identifiée. Anciens indices de banque conservés. La progression B2–C1 complète reste à qualifier. |
| 14. Bibliothèque | Partiel | 80 fiches accessibles dans la PWA. Revue exhaustive des références et enrichissement des sujets non achevés. |
| 15. Coach | Partiel | Durées de 15 à 90 minutes. Priorité explicable selon le niveau courant, les dépassements, la régression et l’espacement. Les examens terminés alimentent une priorité à niveau identique, omissions comprises. Couplage complet avec le planning restant. |
| 16. Diagnostic | Partiel | 48 questions, quatre domaines, 40 minutes, résultats par bloc et bloc prioritaire. Pas de comparaison entre candidats. Plan de travail initial et liens directs vers les exercices prioritaires. La planification sur plusieurs semaines reste ouverte. |
| 17. Examens | Partiel | Simulation 180 minutes, coordination, précision, omissions, délais, comparaison à format stable et signalement d’interruption. Composition par matières et durée. La reprise d’un bloc reste ouverte. |
| 18. Tableau de bord | Partiel | Objectif quotidien, échéance, compte des examens, résultats, temps et tendances. Les nouveaux échantillons du coach portent le niveau. Objectifs hebdomadaires détaillés et distinctions historiques par activité incomplets. |
| 19. Carnet d’erreurs | Terminé pour les nouvelles réponses | Enregistrement local, classement manuel, répétitions, filtres et séance ciblée. Pour les exercices interactifs, l’énoncé et l’explication sont conservés lorsque la réponse brute est indisponible. |
| 20. Flashcards | Partiel | Cartes manuelles et créées depuis les erreurs, classement par matière, recherche par contenu. Échéances Leitner existantes conservées. |
| 21. Entretiens et groupe | Partiel | Relance chronométrée et enregistrement optionnel local. Fuite du flux microphone lors d’un changement de page corrigée. Exercices de groupe hérités. |
| 22. Sport | Partiel | Parcours existants conservés. Nouvelle qualification des barèmes et suivi complet de charge non effectués. |
| 23. Planning | Partiel | Planning, date, jours et export calendrier hérités. Replanification des séances manquées non développée. |
| 24. Design | Partiel | Composants et identité existants conservés. Clarté du carnet, des rapports d’examens et du signal de mise à jour améliorée. Refonte visuelle globale non effectuée. |
| 25. iPad et iPhone | Partiel | Émulation Chromium. Téléchargement WebKit bloqué par les CDN Playwright. iPad A16 et iPhone physiques non disponibles. |
| 26. PWA | Terminé pour les scénarios testés | Version cohérente, ressources préchargées, mise à jour signalée, rechargement hors connexion vérifié. Installation sur écran d’accueil physique non vérifiée. |
| 27. Données | Terminé pour les scénarios testés | Sauvegarde v1, validation avant remplacement, ajout de champs par défaut et vérification du quota. Données d’entraînement et audio traités localement. |
| 28. Architecture | Partiel | Aucun backend ni nouvelle dépendance d’exécution. Les corrections ciblent le cycle de vie du micro et des commandes. L’audit des performances à long terme reste ouvert. |
| 29. Tests | Partiel | Tests unitaires, vérification massive des générateurs et Playwright Chromium. Validation WebKit et physique bloquée, audit de toutes les réponses hors de la couverture actuelle. |
| 30. Documentation | Partiel | Guide de développement et d’utilisation dans le README, méthode et état dans ce document, références existantes dans les dossiers de sélection. |
| 31. Livraison finale | Partiel | Plusieurs critères pédagogiques, de contenu et d’appareils restent ouverts. |
| 32. Production | Bloqué | Les critères de publication ne sont pas réunis. Main et le déploiement GitHub Pages ne sont pas modifiés. |
| 33–34. Rapport et directive | Partiel | Rapport de travail réel. Les limites ci-dessus conditionnent la qualification définitive. |

## Méthodes

Le score d’examen divise les réponses correctes par les questions prévues. La précision utilise seulement les réponses données. Les omissions de fin de bloc et les dépassements individuels sont affichés séparément. Un passage interrompu ne reçoit pas de score d’examen. La graine est enregistrée pour les passages terminés. Le tirage sans historique est reproductible pour les formats à composition fixe avec la même version de contenu.

Le coach calcule la précision au niveau courant sur les observations disponibles. Il affiche un manque de données avant cinq observations et exige vingt observations récentes au niveau maximal avec 90 % de réussite pour la maîtrise interne. Les révisions actualisent les échéances et le carnet mais sont comptées comme activité de révision. Les anciennes données agrégées conservent leur définition historique.

Le carnet d’erreurs contient du texte échappé à l’affichage, une référence de générateur et un compteur. Le bouton de création de carte copie la question et la réponse attendue vers le paquet de sa matière. Les catégories d’erreur sont renseignées par l’utilisateur.

## Vérifications reproductibles

- `npm test` sous Node 20 et Node 24. Les 125 tests passent sur chaque version. La boucle de génération couvre 87 200 couples graine–niveau. La couverture de structure et de reproductibilité ne remplace pas une vérification pédagogique de chaque réponse.
- `node tests/e2e.mjs` a terminé avec `E2E OK` sous Chromium pour l’iPhone 13, l’iPad 7 et le profil ordinateur. Les parcours couvrent les routes principales, l’entraînement, les examens, la bibliothèque, le planning, l’entretien et le rechargement hors ligne.
- `node tests/exam-e2e.mjs` dans Chromium avec iPhone 13 et iPad 7 émulés. Expiration, détection d’interruption, conservation du dénominateur et rechargement hors ligne.
- `node tests/preparation-e2e.mjs` dans Chromium avec iPad 7, iPhone 13 paysage et ordinateur émulés. Carnet, classification, création de flashcard, révision séparée, composition d’examen, export, import invalide et restauration.
- Parcours ciblé sur les quatre blocs du diagnostic en accélérant l’horloge. Les 48 questions figurent dans le dénominateur et les résultats par exercice totalisent 48 omissions ou dépassements.
- Six vues contrôlées sans débordement horizontal en paysage pour iPhone et iPad émulés. Réécoute d’une réponse et relance chronométrée avec un flux audio simulé.
- Les téléchargements Playwright WebKit et les requêtes vers le ministère des Armées et l’API GitHub ont reçu un HTTP 403 du proxy. Git HTTPS a permis de vérifier le commit de la PR. Les tests sur appareils physiques, le site public et les sources non joignables restent non vérifiés.

Le commit `442c621ec623489b4c6fd68255997b7bf33766ac` est la référence de `main` relevée avant la revue. La branche de production est conservée à ce point tant que les critères de livraison restent ouverts.

## Suivi de finalisation · version 29

| Priorité | État | Résultat |
|---|---|---|
| Audit question par question | Partiel | Les 700 entrées de banque passent le contrôle individuel de contenu et d’unicité des choix visibles, et 87 200 couples graine–niveau sont testés. Deux questions verbales ont été reformulées, dont celle qui utilisait « ULM » comme synonyme de voilure fixe. La question de position VOR précise le découpage en huit secteurs. La vérification pédagogique et factuelle de chaque réponse reste à terminer. |
| Laboratoire aéronautique | Partiel | Trois scénarios dynamiques en palier avec vent, inclinaison commandée, OBS réglable, conservateur de cap, horizon, CDI et RMI. Les conditions de réussite portent sur le temps tenu, l’écart à l’axe et la route sol. Les scénarios dynamiques ILS et la coordination en plusieurs axes restent hors de ce laboratoire. |
| Planning | Terminé pour les séances datées | Report par blocs de 30 minutes, par matière faible puis ancienneté. Une place au maximum par jour disponible, selon le plafond du profil et avant la sélection. Les reports terminés sont conservés, et les reports non faits retournent à leur séance d’origine sans se multiplier. La fenêtre de recherche est de 14 jours. Les dates jamais affichées dans le planning ne créent pas d’arriéré. |
| Reprise d’examen | Terminé pour les interruptions dans le même onglet | Le tirage, les réponses et l’échéance absolue sont conservés dans l’onglet. La question déjà affichée est omise lors de la reprise. Les questions restantes expirent à l’échéance initiale. Le point de reprise n’est pas exporté et une autre version de l’application ne le réutilise pas. La reprise après fermeture dépend de la restauration de l’onglet par le navigateur. Une PWA locale ne peut pas protéger ses scores contre la modification du stockage ou de l’horloge du système. |
| Tests | Partiel | Couverture automatisée des deux sens VOR, du vent, du report et de la reprise. WebKit et appareils physiques restent à vérifier. |
| Publication | Bloquée par le périmètre restant | Le 403 GitHub Pages empêche de vérifier le site public depuis le cloud. L’accès Git HTTPS permet d’actualiser la PR. Aucune fusion n’a été faite. |

### Validation manuelle sur iPad

Tester la version 29 servie en HTTPS ou depuis un serveur statique de confiance, dans Safari. Sur une installation existante, exporter d’abord la sauvegarde.

1. Ouvrir le laboratoire, sélectionner le scénario vent du sud et faire varier OBS et inclinaison. Vérifier le CDI, le drapeau TO/FROM, le RMI et la pause. Passer de portrait à paysage.
2. Ouvrir un examen, donner une réponse et attendre la question suivante. Recharger et reprendre. Vérifier que le décompte avance au-delà de la question affichée et que le chronomètre a retranché le temps passé hors de la page.
3. Ouvrir le planning, vérifier qu’un éventuel report ne s’ajoute pas un jour de repos, cocher le report puis recharger pour confirmer la persistance.
4. Ajouter la PWA à l’écran d’accueil, l’ouvrir connecté une première fois puis activer le mode avion. Recharger les pages Laboratoire et Planning et vérifier que les données locales restent visibles.

### Sources officielles non revérifiées

Le 25 novembre 2026, le proxy a refusé les connexions à Devenir Aviateur, au PDF du Carnet évalué AAE de septembre 2025, à la note 2026 de l’École de l’air et de l’espace et au ministère des Armées. Restent à confirmer dans ces sources les conditions exactes de candidature (âge, diplôme et calendrier), le déroulement et les lieux de sélection, les épreuves et leur format (TAMI-C, anglais, psychomotricité, groupe), le barème sportif applicable et les seuils d’élimination. Les valeurs officielles citées historiquement restent datées dans le dossier de sélection. [Sources et dates](selection-eopn.md)

### Résultats sur la version 29

- 128 tests Node réussis sous Node 20 et Node 24.
- Parcours Playwright complets réussis sur Chromium avec iPhone 13, iPad 7 et profil ordinateur.
- Les trois suites navigateur ciblées ont réussi. La reprise conserve une réponse correcte et compte les quinze autres questions comme omises à l’échéance. Les scénarios de laboratoire et les reports de planning ont été vérifiés sur iPhone et iPad émulés.
