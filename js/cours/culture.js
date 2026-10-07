// Fiches de cours : culture aéronautique et militaire, révision du BIA.

export const FICHES_CULTURE = [
  {
    id: 'chronologie',
    title: 'Grandes dates de l’aviation',
    train: '#/train/cult.histoire',
    html: `
      <div class="table-wrap"><table class="tbl" style="text-align:left">
        <tr><th>Date</th><th>Événement</th></tr>
        <tr><td>1783</td><td>Premier vol humain en montgolfière (Pilâtre de Rozier et le marquis d’Arlandes).</td></tr>
        <tr><td>1890</td><td>Clément Ader décolle sur l’Éole ; il invente le mot « avion ».</td></tr>
        <tr><td>1903</td><td>Premier vol motorisé contrôlé des frères Wright (Kitty Hawk).</td></tr>
        <tr><td>1906</td><td>Santos-Dumont vole à Bagatelle sur le 14-bis.</td></tr>
        <tr><td>1909</td><td>Louis Blériot traverse la Manche.</td></tr>
        <tr><td>1910</td><td>Henri Fabre fait décoller le premier hydravion.</td></tr>
        <tr><td>1913</td><td>Roland Garros traverse la Méditerranée.</td></tr>
        <tr><td>1914-1918</td><td>Naissance de l’aviation militaire : reconnaissance, chasse, bombardement. As : Guynemer, Fonck (75 victoires), Nungesser ; côté allemand, le « Baron rouge ». Escadrille La Fayette.</td></tr>
        <tr><td>1921</td><td>Adrienne Bolland traverse la cordillère des Andes.</td></tr>
        <tr><td>Années 1920-30</td><td>L’Aéropostale (Mermoz, Saint-Exupéry, Guillaumet) relie la France à l’Afrique et à l’Amérique du Sud.</td></tr>
        <tr><td>1927</td><td>Lindbergh relie New York à Paris sans escale ; disparition de Nungesser et Coli.</td></tr>
        <tr><td>1932</td><td>Amelia Earhart traverse seule l’Atlantique.</td></tr>
        <tr><td>1934</td><td>L’armée de l’air devient une armée autonome (loi du 2 juillet 1934).</td></tr>
        <tr><td>1940</td><td>Bataille d’Angleterre (RAF contre Luftwaffe).</td></tr>
        <tr><td>1943-1945</td><td>Le Normandie-Niémen combat sur le front de l’Est.</td></tr>
        <tr><td>1944</td><td>Me 262, premier chasseur à réaction opérationnel ; disparition de Saint-Exupéry.</td></tr>
        <tr><td>1947</td><td>Chuck Yeager franchit le mur du son (Bell X-1).</td></tr>
        <tr><td>1953</td><td>La Patrouille de France reçoit son nom ; Jacqueline Auriol franchit le mur du son.</td></tr>
        <tr><td>1961</td><td>Youri Gagarine, premier homme dans l’espace.</td></tr>
        <tr><td>1964</td><td>Création des Forces aériennes stratégiques (Mirage IV).</td></tr>
        <tr><td>1969</td><td>Premier vol du Concorde ; premiers pas sur la Lune (Apollo 11).</td></tr>
        <tr><td>1978</td><td>Premier vol du Mirage 2000.</td></tr>
        <tr><td>1982</td><td>Jean-Loup Chrétien, premier Français dans l’espace.</td></tr>
        <tr><td>1986</td><td>Premier vol du démonstrateur Rafale A.</td></tr>
        <tr><td>1996</td><td>Claudie Haigneré, première Française dans l’espace.</td></tr>
        <tr><td>1999</td><td>Caroline Aigle, première femme pilote de chasse française.</td></tr>
        <tr><td>2006</td><td>Mise en service du Rafale dans l’armée de l’air.</td></tr>
        <tr><td>2019</td><td>Création du Commandement de l’espace.</td></tr>
        <tr><td>2020</td><td>L’armée de l’air devient l’Armée de l’Air et de l’Espace.</td></tr>
        <tr><td>2016-17 / 2021</td><td>Missions Proxima et Alpha de Thomas Pesquet sur l’ISS.</td></tr>
      </table></div>`,
  },
  {
    id: 'aae',
    title: 'L’Armée de l’Air et de l’Espace',
    train: '#/train/cult.aae',
    html: `
      <h3>Repères</h3>
      <ul><li>Armée autonome depuis 1934 ; nom actuel depuis le 11 septembre 2020.</li><li>Environ 40 000 militaires et 5 200 civils.</li><li>Le <b>Président de la République est le chef des armées</b> (art. 15 de la Constitution). L’AAE est commandée par son chef d’état-major (<b>CEMAAE</b>), sous l’autorité du chef d’état-major des armées (<b>CEMA</b>).</li><li>Devise de l’École de l’air et de l’espace : <b>« Faire face »</b> (Guynemer).</li></ul>
      <h3>Les grandes missions</h3>
      <ul>
        <li><b>Protection</b> : la posture permanente de sûreté aérienne (PPS) surveille le ciel français 24 h/24, avec des chasseurs en alerte.</li>
        <li><b>Dissuasion</b> : les Forces aériennes stratégiques (FAS, créées en 1964) mettent en œuvre la composante aéroportée (Rafale, missile ASMPA, ravitailleurs Phénix).</li>
        <li><b>Intervention</b> : frappes, appui des troupes au sol, opérations extérieures (ex. Chammal au Levant depuis 2014).</li>
        <li><b>Renseignement</b> : drones Reaper, AWACS, nacelles de reconnaissance.</li>
        <li><b>Projection et soutien</b> : transport (A400M, C-130, CASA), ravitaillement en vol, évacuations sanitaires.</li>
        <li><b>Espace</b> : le Commandement de l’espace (Toulouse) surveille et protège les satellites français.</li>
        <li><b>Sauvetage</b> : recherche et sauvetage (hélicoptères Caracal, Puma…).</li>
      </ul>
      <h3>Le parcours de l’EOPN</h3>
      <p>Sélection (CSSA de Tours), formation militaire initiale à l’<b>École de l’air et de l’espace</b> (Salon-de-Provence), puis formation au pilotage selon la filière jusqu’au brevet (« les ailes »). Les EOPN deviennent pilotes de chasse, de transport, d’hélicoptère ou de drone, ou <b>navigateurs officiers systèmes d’armes</b> (NOSA). Fais confirmer les détails à jour par ton CIRFA.</p>`,
  },
  {
    id: 'grades',
    title: 'Les grades de l’Armée de l’Air et de l’Espace',
    train: '#/train/cult.aae',
    html: `
      <h3>Officiers généraux</h3>
      <table class="tbl"><tr><th>Grade</th><th>Étoiles</th></tr><tr><td>Général de brigade aérienne</td><td>2</td></tr><tr><td>Général de division aérienne</td><td>3</td></tr><tr><td>Général de corps aérien</td><td>4</td></tr><tr><td>Général d’armée aérienne</td><td>5</td></tr></table>
      <h3>Officiers</h3>
      <table class="tbl"><tr><th>Grade</th><th>Galons</th></tr><tr><td>Colonel</td><td>5</td></tr><tr><td>Lieutenant-colonel</td><td>5 (dont 2 argentés)</td></tr><tr><td>Commandant</td><td>4</td></tr><tr><td>Capitaine</td><td>3</td></tr><tr><td>Lieutenant</td><td>2</td></tr><tr><td>Sous-lieutenant</td><td>1</td></tr></table>
      <p>L’<b>aspirant</b> est un élève-officier (grade de formation).</p>
      <h3>Sous-officiers</h3>
      <p>Sergent → sergent-chef → adjudant → adjudant-chef → <b>major</b> (le plus élevé).</p>
      <h3>Militaires du rang</h3>
      <p>Aviateur de 2e classe → aviateur de 1re classe → caporal → caporal-chef → caporal-chef de 1re classe.</p>
      <p class="tip">Sur ce site, les insignes sont décrits simplement : vérifie leur aspect exact sur les sources officielles avant l’entretien.</p>`,
  },
  {
    id: 'materiels',
    title: 'Aéronefs et bases à connaître',
    train: '#/train/cult.aae',
    html: `
      <h3>Aéronefs en service (principaux)</h3>
      <div class="table-wrap"><table class="tbl" style="text-align:left">
        <tr><th>Appareil</th><th>Rôle</th></tr>
        <tr><td>Rafale (Dassault)</td><td>Avion de combat omnirôle biréacteur : défense aérienne, attaque, reconnaissance, dissuasion.</td></tr>
        <tr><td>Mirage 2000D / 2000-5</td><td>Attaque au sol (D) ; défense aérienne (-5).</td></tr>
        <tr><td>A400M Atlas</td><td>Transport tactique et stratégique.</td></tr>
        <tr><td>A330 MRTT Phénix</td><td>Ravitaillement en vol, transport, évacuations médicales.</td></tr>
        <tr><td>C-130 Hercules, CASA CN-235</td><td>Transport tactique.</td></tr>
        <tr><td>E-3F AWACS</td><td>Détection et contrôle aéroportés (radar rotatif).</td></tr>
        <tr><td>MQ-9 Reaper</td><td>Drone de renseignement et de frappe (MALE).</td></tr>
        <tr><td>PC-21</td><td>Avion d’entraînement des futurs pilotes de chasse.</td></tr>
        <tr><td>Alphajet</td><td>Avion de la Patrouille de France.</td></tr>
        <tr><td>H225M Caracal</td><td>Hélicoptère de recherche et sauvetage au combat.</td></tr>
      </table></div>
      <h3>Quelques bases</h3>
      <ul>
        <li><b>Salon-de-Provence (BA 701)</b> : École de l’air et de l’espace, Patrouille de France.</li>
        <li><b>Tours (BA 705)</b> : centre de sélection CSSA (où se passent les tests EOPN).</li>
        <li><b>Cognac (BA 709)</b> : formation au pilotage sur PC-21, drones Reaper.</li>
        <li><b>Saint-Dizier (BA 113)</b> : Rafale, dont des escadrons des FAS.</li>
        <li><b>Mont-de-Marsan (BA 118)</b> : Rafale et Centre d’expertise aérienne militaire (CEAM).</li>
        <li><b>Nancy-Ochey (BA 133)</b> : Mirage 2000D.</li>
        <li><b>Istres (BA 125)</b> : ravitailleurs Phénix.</li>
        <li><b>Orléans-Bricy (BA 123)</b> : A400M.</li>
        <li><b>Avord (BA 702)</b> : AWACS.</li>
      </ul>
      <p class="tip">Les affectations évoluent (arrivée de nouveaux avions, retraits) : vérifie l’actualité avant l’entretien.</p>`,
  },
  {
    id: 'defense',
    title: 'Défense et géopolitique',
    train: '#/train/cult.defense',
    html: `
      <h3>Institutions françaises</h3>
      <ul><li>Président : chef des armées (art. 15), décide de l’emploi de l’arme nucléaire.</li><li>Gouvernement : « dispose de la force armée » (art. 20) ; le Premier ministre est responsable de la défense nationale (art. 21).</li><li>Parlement : autorise la déclaration de guerre (art. 35) ; il est informé des opérations extérieures et doit autoriser leur prolongation au-delà de 4 mois.</li><li>Ministère des Armées (nom depuis 2017). Loi de programmation militaire 2024-2030 : environ 413 Md€.</li></ul>
      <h3>La dissuasion nucléaire</h3>
      <p>Protéger les intérêts vitaux de la France en dissuadant toute agression. Deux composantes : <b>océanique</b> (sous-marins SNLE) et <b>aéroportée</b> (FAS et aéronavale).</p>
      <h3>Alliances et organisations</h3>
      <ul><li><b>ONU</b> (1945) : la France est membre permanent du Conseil de sécurité (avec États-Unis, Royaume-Uni, Russie, Chine), avec droit de veto.</li><li><b>OTAN</b> (1949) : défense collective (article 5). La France quitte le commandement intégré en 1966 et le réintègre en 2009. Depuis 2024 : 32 membres (Finlande 2023, Suède 2024).</li><li><b>Union européenne</b> (27 membres) : clause d’assistance mutuelle (art. 42.7 TUE), invoquée par la France en 2015.</li></ul>
      <h3>Opérations récentes à connaître</h3>
      <p>Serval (Mali, 2013), Barkhane (Sahel, 2014-2022), Chammal (Levant, depuis 2014), Sentinelle (territoire national, depuis 2015), Hamilton (frappes en Syrie, 2018). Guerre en Ukraine depuis le 24 février 2022.</p>
      <h3>Pour l’entretien</h3>
      <p>Suis l’actualité de défense chaque semaine (site du ministère des Armées, presse) et prépare 2 sujets que tu sais résumer en 1 minute avec une analyse mesurée.</p>`,
  },
];

export const FICHES_BIA = [
  {
    id: 'aerodynamique',
    title: 'Aérodynamique et mécanique du vol',
    train: '#/train/bia.aero',
    html: `
      <h3>Le profil d’aile</h3>
      <p>Bord d’attaque (avant), bord de fuite (arrière), <b>extrados</b> (dessus), <b>intrados</b> (dessous), corde (droite qui relie les deux bords). L’angle entre la corde et le vent relatif est l’<b>incidence</b> (à ne pas confondre avec l’<b>assiette</b>, angle entre l’axe de l’avion et l’horizon).</p>
      <h3>Les forces</h3>
      <p>Portance (⟂ au vent relatif), traînée (// au vent relatif), poids, poussée. Résultante aérodynamique = portance + traînée. L’air accélère sur l’extrados et la pression y baisse : la dépression d’extrados fournit environ les 2/3 de la portance.</p>
      <p><b>F<sub>z</sub> = ½ ρ S V² C<sub>z</sub></b> et <b>F<sub>x</sub> = ½ ρ S V² C<sub>x</sub></b>. Finesse = F<sub>z</sub> / F<sub>x</sub>.</p>
      <h3>La traînée</h3>
      <ul><li>Traînée de forme et de frottement : augmente avec la vitesse.</li><li><b>Traînée induite</b> : due aux tourbillons en bout d’aile, elle est forte à basse vitesse. Un grand allongement (envergure² / surface) et les winglets la réduisent.</li></ul>
      <h3>Décrochage</h3>
      <p>Au-delà de l’incidence critique (≈ 15-18°), l’écoulement décolle de l’extrados et la portance chute. Le décrochage dépend de l’<b>incidence</b>, pas de la vitesse : il peut arriver à toute vitesse. La vitesse de décrochage augmente avec la masse et le facteur de charge (V<sub>s</sub> × √n). Les volets et les becs la diminuent.</p>
      <h3>Virage</h3>
      <p>Facteur de charge en palier : n = 1 / cos φ (2 à 60°). La bille indique la symétrie ; le lacet inverse se corrige au palonnier.</p>
      <h3>Commandes et stabilité</h3>
      <p>Ailerons → roulis ; profondeur → tangage ; direction → lacet. Le compensateur annule l’effort au manche. Un centrage arrière rend l’avion instable ; le dièdre améliore la stabilité en roulis ; la flèche retarde les effets de la compressibilité à grande vitesse.</p>`,
  },
  {
    id: 'aeronefs',
    title: 'Connaissance des aéronefs',
    train: '#/train/bia.aeronefs',
    html: `
      <h3>Familles d’aéronefs</h3>
      <p>Plus légers que l’air (aérostats : ballons, dirigeables, qui volent grâce à la poussée d’Archimède) ; plus lourds que l’air : à voilure fixe (avions, planeurs, ULM) ou tournante (hélicoptères, autogires).</p>
      <h3>Structure</h3>
      <p>Fuselage, voilure (longerons pour les efforts, nervures pour la forme), empennages (horizontal avec la profondeur, vertical avec la direction), train d’atterrissage (tricycle ou classique). Structure monocoque ou semi-monocoque : le revêtement participe à la résistance.</p>
      <h3>Moteurs</h3>
      <ul><li><b>À pistons</b> : 4 temps (admission, compression, combustion-détente, échappement), double allumage par magnétos, commande de mélange, réchauffage carburateur contre le givrage. Carburant : AVGAS 100LL (bleu).</li><li><b>Turboréacteur</b> : compresseur → chambre de combustion → turbine → tuyère. Double flux : plus économique. Postcombustion : poussée supplémentaire (avions de combat). Carburant : kérosène Jet A1.</li><li><b>Turbopropulseur</b> : turbine qui entraîne une hélice (A400M, PC-21).</li><li>Hélice à pas variable : petit pas au décollage, grand pas en croisière.</li></ul>
      <h3>Instruments</h3>
      <ul><li><b>Anémobarométriques</b> (tube de Pitot et prise statique) : anémomètre, altimètre, variomètre.</li><li><b>Gyroscopiques</b> : horizon artificiel, conservateur de cap, indicateur de virage.</li><li><b>Compas magnétique</b> : perturbé en virage et lors des accélérations.</li><li>Transpondeur : répond au radar secondaire (code + altitude).</li></ul>
      <h3>Hélicoptère</h3>
      <p>Rotor principal (portance), rotor anticouple. Le pas <b>collectif</b> fait monter ou descendre ; le pas <b>cyclique</b> incline le disque rotor pour se déplacer. En cas de panne moteur : <b>autorotation</b>.</p>`,
  },
  {
    id: 'meteo',
    title: 'Météorologie',
    train: '#/train/bia.meteo',
    html: `
      <h3>L’atmosphère</h3>
      <p>78 % d’azote, 21 % d’oxygène. Troposphère jusqu’à la tropopause (≈ 11 km en moyenne). Atmosphère standard : <b>15 °C et 1 013,25 hPa</b> au niveau de la mer, −6,5 °C/km (≈ −2 °C/1 000 ft).</p>
      <h3>Humidité et nuages</h3>
      <p>Quand l’air se refroidit jusqu’à son <b>point de rosée</b>, il est saturé : la vapeur se condense (nuages, brouillard).</p>
      <ul><li>Étage supérieur : cirrus, cirrocumulus, cirrostratus (glace).</li><li>Étage moyen : altocumulus, altostratus.</li><li>Étage inférieur : stratus, stratocumulus, nimbostratus (pluie continue).</li><li>À développement vertical : cumulus et <b>cumulonimbus</b> (orages, grêle, foudre, rafales, givrage, cisaillement) — à éviter absolument.</li></ul>
      <h3>Pression et vent</h3>
      <p>Le vent souffle des hautes vers les basses pressions, dévié par la force de Coriolis : dans l’hémisphère Nord, il tourne dans le sens horaire autour d’un anticyclone et anti-horaire autour d’une dépression. Isobares serrées = vent fort. Brise de mer le jour, de terre la nuit. Un vent est désigné par sa direction d’<b>origine</b>.</p>
      <h3>Fronts</h3>
      <ul><li><b>Front chaud</b> : nuages de plus en plus bas (cirrus → altostratus → nimbostratus), pluie continue.</li><li><b>Front froid</b> : passage rapide, cumulonimbus, averses, rafales, puis éclaircies.</li></ul>
      <h3>Dangers</h3>
      <p>Givrage (nuages entre 0 et −15 °C environ), orages, brouillard (de rayonnement : nuit claire et vent faible ; d’advection : air humide sur une surface froide), turbulence (relief, rotors), cisaillement de vent.</p>
      <h3>Messages</h3>
      <p><b>METAR</b> = observation ; <b>TAF</b> = prévision d’aérodrome. Nébulosité : FEW (1-2 octas), SCT (3-4), BKN (5-7), OVC (8). CAVOK : visibilité ≥ 10 km, pas de nuage significatif, pas de phénomène.</p>`,
  },
  {
    id: 'navreg',
    title: 'Navigation et réglementation',
    train: '#/train/bia.navreg',
    html: `
      <h3>Se repérer</h3>
      <p>Latitude (parallèles, de 0 à 90° N ou S), longitude (méridiens, de 0 à 180° E ou O). <b>1 minute d’arc de latitude = 1 NM = 1 852 m</b>. Carte OACI VFR au 1/500 000. Heures en UTC (France : UTC+1 en hiver, UTC+2 en été).</p>
      <h3>Caps et routes</h3>
      <ul><li>Nord vrai (géographique) ≠ nord magnétique : l’écart est la <b>déclinaison</b>. Cm = Cv − déclinaison (déclinaison Est positive).</li><li>Le <b>cap</b> est la direction du nez de l’avion ; la <b>route</b> est la trajectoire au sol. L’écart est la <b>dérive</b>, due au vent.</li><li>Triangle des vitesses : vitesse sol = vitesse air + vent (vecteurs).</li></ul>
      <h3>Moyens de navigation</h3>
      <p>Navigation à l’estime (cap, vitesse, temps), cheminement (repères au sol), radionavigation (VOR, ADF), GPS (satellites). Transpondeur : 7000 en VFR (Europe), 7700 urgence, 7600 panne radio, 7500 intervention illicite.</p>
      <h3>Règles de l’air</h3>
      <ul><li>Priorité à l’aéronef qui vient de la <b>droite</b> ; de face, chacun s’écarte vers sa droite ; on dépasse par la droite.</li><li>Feux : rouge à gauche, vert à droite, blanc à l’arrière.</li><li>VFR (vol à vue) / IFR (vol aux instruments). L’espace aérien est divisé en classes A à G (A : IFR seulement ; G : non contrôlé).</li><li>Zones P (interdites), R (réglementées), D (dangereuses). Les NOTAM signalent les informations temporaires.</li><li>Pistes numérotées selon leur orientation magnétique ÷ 10 (piste 27 = 270°).</li></ul>
      <h3>Organismes et documents</h3>
      <p>OACI (mondial, ONU), EASA (Europe), DGAC (France), BEA (enquêtes accidents). À bord : certificat d’immatriculation (F-xxxx), certificat de navigabilité, documents du pilote (licence PPL, LAPL…).</p>`,
  },
];
