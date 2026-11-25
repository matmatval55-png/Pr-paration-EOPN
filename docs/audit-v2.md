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
