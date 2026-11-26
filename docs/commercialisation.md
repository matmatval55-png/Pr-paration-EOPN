# V47 — Préparation commerciale (non autorisée à la vente)
## Décision
Conserver main comme application personnelle. Cette branche est une préproduction, pas une offre payante. Nom Flight Academy provisoire, prix hypothétique 14,99 €/mois. Aucun paiement ni collecte de prospects activés.
## Conditions bloquantes
- Inventorier chaque image, audio, texte et dépendance, documenter auteur, licence et autorisation commerciale. Le README indique explicitement des photos utilisées pour révision personnelle : remplacer ou obtenir les droits. Vérifier également la bande sonore Luc Léger.
- Revoir chaque question, correction et fiche, avec référence datée et relecteur compétent. Ne pas annoncer une équivalence avec les sélections officielles ni une garantie de réussite.
- Vérifier disponibilité du nom auprès de l'INPI et EUIPO, domaine et marques similaires.
- Choisir un hébergeur autorisant un SaaS commercial, dépôt privé pour le produit. GitHub Pages n'est pas retenu pour la vente.
- Créer une activité déclarée, identité du vendeur, coordonnées, médiateur, CGV, information précontractuelle, prix TTC, rétractation et résiliation en ligne adaptés au modèle. Faire valider par un professionnel.
- Cartographier données, sous-traitants, durées, droits RGPD, sécurité. Ne pas synchroniser les données santé, audio ou personnalité par défaut.
## Architecture cible
Frontend PWA sur hébergement commercial, API serveur, authentification gérée, base de données avec contrôle d'accès par utilisateur, paiement hébergé Stripe Checkout, webhook signé et idempotent, droits premium vérifiés côté serveur. Aucun secret dans le navigateur. Ne pas mettre le contenu premium dans le cache public. Mode hors ligne premium à concevoir avec compromis explicite sur la protection.
## Critères de lancement
Tests unitaires et navigateur verts, Safari physique, tests d'isolation entre comptes, webhook en mode test, annulation/remboursement, export et suppression des données, sauvegarde et restauration, audit de droits et de contenu terminé. Bêta gratuite de 20 à 30 candidats après validation des droits et de la confidentialité. Mesurer activation, rétention et volonté de payer sans inventer de témoignages.
## État
V46 inspectée via README et audit historique : audit éditorial incomplet, sources et Safari non confirmés. Aucun de ces critères n'est déclaré satisfait sans preuve. La page de présentation V47 est un prototype sans collecte ni vente. Ne pas fusionner automatiquement dans main.
