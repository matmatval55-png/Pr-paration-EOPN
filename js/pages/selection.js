// Résumé de la sélection EOPN (recherche d'octobre 2026). Voir aussi docs/selection-eopn.md.
const OK = '<span class="badge ok">confirmé</span>';
const CHK = '<span class="badge warn">à vérifier</span>';

export function renderSelection(root) {
  root.innerHTML = `
    <a href="#/bibliotheque" class="small">← Cours</a>
    <h1>La sélection EOPN</h1>
    <p class="muted small">Synthèse faite en octobre 2026 à partir des sources officielles. Les formats évoluent : fais toujours confirmer par ton CIRFA.</p>

    <div class="card course">
      <h3>Conditions</h3>
      <ul>
        <li>Nationalité française, bac minimum, <b>moins de 27 ans à la signature du contrat</b> ${OK}</li>
        <li>Réussir les tests de sélection et les tests médicaux militaires ${OK}</li>
        <li>Âge minimum (17 ans / 17 ans et 3 mois selon les textes) ${CHK}</li>
        <li>Contrat initial de 10 ans, jusqu’à 20 ans de service ${CHK}</li>
        <li>Commission de sélection deux fois par an ${CHK}</li>
      </ul>
    </div>

    <div class="card course">
      <h3>Déroulé</h3>
      <p>Dossier au <b>CIRFA</b>, puis tests au <b>CSSA de la base aérienne 705 de Tours</b> sur 4 jours ${OK}. Certaines pages officielles placent la présélection dans un centre régional (C2RA/CRRA : Rueil-Malmaison, Nancy, Lyon, Bordeaux, Rennes) ${CHK}.</p>
      <div class="table-wrap"><table class="tbl" style="text-align:left">
        <tr><th>Épreuve</th><th>Ce qu’on sait</th></tr>
        <tr><td>Psychotechnique (TAMI-C)</td><td>6 épreuves sur ordinateur : raisonnement, spatial, arithmétique, verbal, attention, vitesse de codage ${OK}. Durées et nombre de questions ${CHK}</td></tr>
        <tr><td>Anglais</td><td>« Test de Chambéry » : QCM de compréhension écrite, <b>150 questions en 55 min</b>, rattrapage possible ${OK}. Seuil éliminatoire de 10/20 ${CHK}</td></tr>
        <tr><td>Sport</td><td>Luc Léger, tractions (H) ou tirage de poulie haute (F), test Killy ${OK}. Note minimum pour les navigants ${CHK}</td></tr>
        <tr><td>Test palonnier</td><td>Coordination jambes / stimuli visuels ; oriente vers pilote, navigateur ou pilote à distance ${OK}</td></tr>
        <tr><td>Tests cognitifs navigants</td><td>Visualisation spatiale à partir des instruments, vitesse de lecture des instruments, problèmes arithmétiques, attention multitâche, structuration rapide d’informations ${OK}. Noms et formats (RC2S, T3A…) ${CHK}</td></tr>
        <tr><td>Système d’évaluation candidat pilote</td><td>Épreuve psychomotrice de 20 min (manche + palonniers), <b>éliminatoire</b> ${OK}</td></tr>
        <tr><td>Épreuve de groupe</td><td>Au moins 4 candidats ${OK}</td></tr>
        <tr><td>Entretiens</td><td>Jury de 2 navigants + officier psychologue du CERP’Air ${OK}</td></tr>
        <tr><td>Culture scientifique / aéronautique</td><td>Citée par des sources non officielles seulement ${CHK}</td></tr>
        <tr><td>Visite médicale</td><td>Mesures, analyse d’urine, ECG, audition, vision, entretien médecin. Apporter carnet de santé et dossier médical complet ${OK}. Expertise PN au CEMPN ${CHK}</td></tr>
      </table></div>
    </div>

    <div class="card course">
      <h3>Barème sportif officiel (livret AAE, septembre 2025)</h3>
      <div class="table-wrap"><table class="tbl">
        <tr><th>Note</th><th>Luc Léger H</th><th>Luc Léger F</th><th>Killy</th><th>Tractions H</th><th>Poulie F</th></tr>
        <tr><td>20</td><td>palier 12</td><td>9</td><td>168 s</td><td>17</td><td>+58</td></tr>
        <tr><td>15</td><td>9</td><td>6+30 s</td><td>128 s</td><td>12</td><td>44</td></tr>
        <tr><td>10</td><td>7+15 s</td><td>5</td><td>88 s</td><td>7</td><td>29</td></tr>
        <tr><td>5</td><td>—</td><td>—</td><td>48 s</td><td>3</td><td>19</td></tr>
      </table></div>
      <p class="small">Ce livret concerne le recrutement général et ne fixe pas de note minimum pour les navigants ${CHK}. Une moyenne de 6/20 minimum et une élimination en dessous de 1/20 sont citées ailleurs ${CHK}.</p>
    </div>

    <div class="card course">
      <h3>Sources</h3>
      <ul class="small">
        <li><a href="https://devenir-aviateur.gouv.fr/postuler/tout-savoir-pour-postuler/passer-les-tests-d-evaluation/se-preparer-aux-tests" target="_blank" rel="noopener">devenir-aviateur.gouv.fr — Se préparer aux tests</a> (officiel)</li>
        <li><a href="https://devenir-aviateur.gouv.fr/choisir-votre-metier/tous-nos-domaines-et-metiers/pilote-et-navigateur/pilote-de-chasse" target="_blank" rel="noopener">devenir-aviateur.gouv.fr — Pilote de chasse</a> (officiel)</li>
        <li><a href="https://devenir-aviateur.gouv.fr/media/2556/download/carnet_evalue_AAE.pdf" target="_blank" rel="noopener">Carnet évalué AAE, septembre 2025</a> (officiel)</li>
        <li><a href="https://fr.wikipedia.org/wiki/%C3%89l%C3%A8ve-officier_du_personnel_navigant" target="_blank" rel="noopener">Wikipédia — EOPN</a> (non officiel)</li>
        <li><a href="https://cockpitseeker.com/eopn/" target="_blank" rel="noopener">cockpitseeker.com — EOPN</a> (non officiel)</li>
      </ul>
    </div>`;
}
