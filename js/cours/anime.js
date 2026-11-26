// Fiches animées : situations de vol expliquées avec des schémas qui bougent.
import { rmiSVG, radialMap, windSVG, circuitSVG, papiSVG, horizonAnimSVG, trafficSVG } from '../psycho/situations.js';
import { avionVue, cdiSVG, ilsSVG, holdingSVG, SIGNAUX, signalSVG, interceptionSVG } from '../psycho/situations2.js';
import { horizonSVG } from '../psycho/instruments.js';

// Écoulement de l'air autour d'un profil : normal ou décroché (filets animés).
export function ecoulementSVG(stall) {
  const aoa = stall ? 20 : 5;
  const lines = [40, 60, 80, 120, 140, 160].map((y, i) => {
    const above = y < 100;
    let d;
    if (!stall || !above) d = `M0,${y} C120,${y} 150,${above ? y - 18 + i * 2 : y + 8} 200,${above ? y - 10 : y + 4} S300,${y} 400,${y}`;
    else d = `M0,${y} C110,${y} 140,${y - 22} 190,${y - 26} C240,${y - 30} 260,${y + 30} 300,${y + 10} S360,${y - 10} 400,${y}`;
    return `<path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="14 10"><animate attributeName="stroke-dashoffset" values="48;0" dur="${stall && above ? 0.9 : 0.6}s" repeatCount="indefinite"/></path>`;
  });
  const swirls = stall
    ? [[260, 92], [300, 82], [335, 96]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${9 - i}" fill="none" stroke="var(--danger)" stroke-width="2" stroke-dasharray="6 4"><animateTransform attributeName="transform" type="rotate" values="0 ${x} ${y};360 ${x} ${y}" dur="${0.8 + i * 0.2}s" repeatCount="indefinite"/></circle>`).join('')
    : '';
  return `<svg viewBox="0 0 400 200" class="mech" aria-label="écoulement autour d'une aile">
    <rect width="400" height="200" fill="var(--instr-bg)" rx="14"/>
    ${lines.join('')}
    <g transform="rotate(${-aoa} 200 100)"><path d="M120,100 C140,70 230,72 290,100 C230,110 150,112 120,100 Z" fill="var(--card2)" stroke="currentColor" stroke-width="2"/></g>
    ${swirls}
    <text x="12" y="20" font-size="12" font-weight="700" fill="currentColor">Incidence ${aoa}° — ${stall ? 'DÉCROCHAGE : l’écoulement décolle de l’extrados' : 'écoulement collé : portance'}</text>
    ${!stall ? '<text x="200" y="40" font-size="11" text-anchor="middle" fill="var(--ok)">dépression (extrados) ↑</text><text x="200" y="182" font-size="11" text-anchor="middle" fill="var(--ok)">surpression (intrados) ↑</text>' : ''}
  </svg>`;
}

const fig = (svg, cap) => `<figure class="schema">${svg}<figcaption>${cap}</figcaption></figure>`;

export const FICHES_ANIME = [
  {
    id: 'portance',
    title: 'Portance et décrochage (animé)',
    train: '#/train/bia.aero',
    html: `<p>Les filets d’air glissent autour de l’aile. Sur l’<b>extrados</b>, ils accélèrent et la pression baisse ; sur l’<b>intrados</b>, la pression est un peu plus forte : c’est la <b>portance</b>.</p>
      ${fig(ecoulementSVG(false), 'Incidence normale : filets collés au profil.')}
      <p>Si l’on dépasse l’incidence critique (variable selon le profil et la configuration), les filets ne suivent plus la courbure de l’extrados : ils <b>décollent</b> et forment des tourbillons. La portance chute brutalement : c’est le <b>décrochage</b>.</p>
      ${fig(ecoulementSVG(true), 'Incidence trop forte : décollement et tourbillons sur l’extrados.')}
      <p class="tip">Sortie de décrochage : rendre la main (diminuer l’incidence), mettre de la puissance, remettre les ailes à plat, puis reprendre le vol normal sans brutalité.</p>`,
  },
  {
    id: 'circuit',
    title: 'Le tour de piste (animé)',
    train: '#/train/psy.circuit',
    html: `<p>Autour de chaque aérodrome, les avions suivent un circuit standard pour s’insérer et atterrir en sécurité.</p>${fig(circuitSVG('montee', true), 'Tour de piste « main gauche » : tous les virages se font à gauche.')}
      <ol><li><b>Montée initiale</b> dans l’axe après le décollage.</li><li><b>Vent traversier</b> : premier virage, perpendiculaire à la piste.</li><li><b>Vent arrière</b> : parallèle à la piste, en sens inverse de l’atterrissage ; on fait la check-list avant atterrissage.</li><li><b>Étape de base</b> : on commence la descente.</li><li><b>Finale</b> : aligné sur l’axe, on se stabilise jusqu’à l’atterrissage.</li></ol>
      <p class="tip">Le sens du circuit (main gauche ou droite) et sa hauteur figurent sur la carte VAC du terrain.</p>`,
  },
  {
    id: 'vent',
    title: 'Vent, manche à air et choix de piste (animé)',
    train: '#/train/psy.vent',
    html: `<p>On décolle et on atterrit <b>face au vent</b> : la vitesse sol est plus faible, la distance de roulage plus courte et le contrôle meilleur.</p>
      ${fig(windSVG(27, 250, 15), 'Vent du 250° à 15 kt : on utilise la piste 27 (orientée 270°), avec un léger vent de travers venant de la gauche.')}
      <ul><li>La <b>manche à air</b> pointe vers où <b>va</b> le vent ; plus elle est tendue, plus le vent est fort.</li><li>Le vent se donne par la direction d’où il <b>vient</b> : « 250/15 ».</li><li>Avec du vent de travers, on corrige la dérive en mettant le nez du côté du vent.</li></ul>`,
  },
  {
    id: 'papi',
    title: 'Le PAPI : la pente d’approche (animé)',
    train: '#/train/psy.papi',
    html: `<p>Le <b>PAPI</b> (Precision Approach Path Indicator) est une rangée de 4 feux à côté de la piste. Chaque feu est blanc ou rouge selon l’angle sous lequel on le voit.</p>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr))">${[4, 3, 2, 1, 0].map((w) => `<figure class="schema" style="margin:0">${papiSVG(w)}<figcaption>${{ 4: '4 blancs : trop haut', 3: '3 blancs : un peu haut', 2: '2 + 2 : sur le plan ✓', 1: '3 rouges : un peu bas', 0: '4 rouges : trop bas' }[w]}</figcaption></figure>`).join('')}</div>
      <p class="tip">Repère : <b>2 blancs + 2 rouges</b> indiquent le plan nominal. Une indication basse nécessite une correction adaptée ; si l’approche ne peut pas être stabilisée, remise de gaz selon les procédures applicables.</p>`,
  },
  {
    id: 'vor',
    title: 'Radiales VOR et RMI (animé)',
    train: '#/train/psy.vor',
    html: `<p>Une balise <b>VOR</b> émet 360 « routes » appelées <b>radiales</b>, numérotées selon la direction <b>depuis</b> la balise : la radiale 090 part vers l’est.</p>
      <div class="instr-row">${rmiSVG(30, 270)}${radialMap(90, 30)}</div>
      <p>Sur le <b>RMI</b>, l’aiguille pointe toujours <b>vers la balise</b>. Ici, la tête indique 270 : pour rejoindre la balise, il faut prendre le cap 270. La <b>queue</b> indique 090 : tu es sur la <b>radiale 090</b>, donc à l’<b>est</b> de la balise, quel que soit ton cap (ici 030).</p>
      <ul><li><b>QDM</b> = relèvement magnétique vers la balise (cap à suivre sans vent) (tête de l’aiguille).</li><li><b>QDR</b> = radiale sur laquelle tu te trouves (queue de l’aiguille) = QDM ± 180.</li></ul>`,
  },
  {
    id: 'attitudes',
    title: 'Attitudes inusuelles (animé)',
    train: '#/train/psy.attitudes',
    html: `<p>Dans les nuages, sans repère extérieur, l’oreille interne trompe le pilote : l’avion peut partir dans une attitude anormale sans qu’il le sente (désorientation spatiale). Il faut croire les <b>instruments</b>.</p>
      <div class="instr-row"><figure class="schema">${horizonAnimSVG(-20, 50, 'fa1')}<figcaption>Nez bas + inclinaison : spirale engageante</figcaption></figure><figure class="schema">${horizonAnimSVG(22, -35, 'fa2')}<figcaption>Nez haut : risque de décrochage</figcaption></figure></div>
      <h3>Rattrapage</h3>
      <ul><li><b>Nez bas</b> (vitesse qui augmente) : réduire la puissance → ailes à plat → ramener doucement le nez sur l’horizon. Ne pas tirer avant d’avoir remis les ailes à plat (on resserrerait la spirale).</li><li><b>Nez haut</b> (vitesse qui diminue) : afficher la puissance → baisser le nez vers l’horizon → ailes à plat.</li></ul>
      <p class="tip">Procédure générale enseignée en vol aux instruments ; l’ordre précis dépend de l’avion et de son manuel de vol.</p>`,
  },
  {
    id: 'anticollision',
    title: 'Voir et éviter : l’anticollision (animé)',
    train: '#/train/psy.trafic',
    html: `<p>En vol à vue, chaque pilote est responsable de <b>voir et éviter</b> les autres aéronefs. On annonce un trafic comme sur une horloge : 12 h devant, 3 h à droite, 9 h à gauche.</p>
      <div class="instr-row"><figure class="schema">${trafficSVG(2, true, false)}<figcaption>Trafic à 2 h qui reste au même endroit du pare-brise et grossit : <b>collision</b> !</figcaption></figure><figure class="schema">${trafficSVG(2, false, true)}<figcaption>Trafic dont le relèvement varie : risque de collision à évaluer en continu.</figcaption></figure></div>
      <ul><li><b>Position relative constante + distance qui diminue = trajectoire de collision.</b></li><li>Convergence : priorité à l’aéronef qui vient de la <b>droite</b>.</li><li>Face à face : chacun s’écarte vers sa <b>droite</b>.</li><li>Dépassement : par la droite.</li></ul>`,
  },
  {
    id: 'visualisation',
    title: 'Des instruments à l’image de l’avion',
    train: '#/train/psy.orientation',
    html: `<p>Épreuve classique : on te montre l’horizon artificiel (et parfois le cap) et tu dois retrouver l’image de l’avion. La maquette de l’horizon, c’est <b>toi</b> ; c’est le décor qui bouge.</p>
      <div class="instr-row"><figure class="schema">${horizonSVG(10, 30, 'fv1')}<figcaption>Instrument : nez haut, incliné à droite</figcaption></figure><figure class="schema">${avionVue({ bank: 30, pitch: 10, heading: 90 })}<figcaption>Image : aile droite basse, montée, cap est</figcaption></figure></div>
      <h3>Méthode en 3 critères</h3><ol><li><b>Inclinaison</b> : la ligne d’horizon penche à l’<b>inverse</b> de l’avion : en virage à droite, elle remonte du côté droit. Le plus simple : l’aile de la maquette qui « plonge » vers la terre (vers le marron) indique le côté du virage.</li><li><b>Assiette</b> : la maquette au-dessus de l’horizon (on voit du ciel bleu sous le point central) = nez haut.</li><li><b>Cap</b> : lis le conservateur de cap (000 = nord, 090 = est, 180 = sud, 270 = ouest).</li></ol>
      <p class="tip">Élimine les propositions critère par critère : en général 2 réponses tombent sur l’inclinaison, 1 sur l’assiette ou le cap.</p>`,
  },
  {
    id: 'cdi-ils',
    title: 'Aiguilles CDI et ILS (animé)',
    train: '#/train/psy.navaig',
    html: `<p>Le <b>CDI</b> (VOR) et l’<b>ILS</b> montrent un écart par rapport à une route ou à un plan de descente. Avec un guidage correctement sélectionné et en approche normale, l’aiguille indique le côté du plan à rejoindre. Attention à la logique TO/FROM du VOR.</p>
      <div class="instr-row"><figure class="schema">${cdiSVG(3)}<figcaption>Aiguille à droite : la route est à droite, je corrige à droite.</figcaption></figure><figure class="schema">${ilsSVG(-2, 1)}<figcaption>Axe à gauche (je suis à droite) ; plan au-dessus (je suis trop bas).</figcaption></figure></div>
      <ul><li><b>Alignement de piste</b> (aiguille verticale) : indique où est l’axe de piste.</li><li><b>Pente</b> (aiguille horizontale) : en haut = le plan est au-dessus de toi = tu es <b>trop bas</b> → réduis le taux de descente.</li><li>Les deux aiguilles centrées en croix : parfait, sur l’axe et sur le plan.</li></ul>
      <p class="tip">Sur un VOR, 1 point ≈ 2° d’écart. L’indicateur TO/FROM dit si la route affichée te rapproche (TO) ou t’éloigne (FROM) de la balise.</p>`,
  },
  {
    id: 'attente',
    title: 'Le circuit d’attente (animé)',
    train: '#/train/psy.attente',
    html: `<p>Quand le contrôle fait patienter un avion, celui-ci tourne en <b>hippodrome</b> autour d’un point (balise ou point de report).</p>
      ${fig(holdingSVG(null), 'Attente standard : virages à droite, branche de rapprochement vers le point d’attente.')}
      <ul><li><b>Branche de rapprochement</b> : vers le point d’attente, 1 min jusqu’au FL 140 (1 min 30 au-dessus).</li><li>Au point : virage (taux standard 3°/s, donc 1 min pour 180°), puis <b>branche d’éloignement</b>.</li><li>Attente <b>standard</b> = virages à <b>droite</b> ; virages à gauche = non standard (publié sur la carte).</li></ul>
      <p class="tip">À l’entretien ou en vol, savoir dire « circuit d’attente = hippodrome, virages à droite, 1 minute » suffit largement.</p>`,
  },
  {
    id: 'signaux',
    title: 'Signaux lumineux de la tour (animé)',
    train: '#/train/psy.signaux',
    html: `<p>Si la radio tombe en panne (transpondeur <b>7600</b>), la tour peut communiquer avec un projecteur de couleur.</p>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))">${SIGNAUX.map((s) => `<figure class="schema" style="margin:0">${signalSVG(s)}<figcaption><b>En vol</b> : ${s.air}<br><b>Au sol</b> : ${s.sol}</figcaption></figure>`).join('')}</div>
      <p class="tip">Mémo : <b>vert</b> = oui (fixe : vas-y ; clignotant : prépare-toi), <b>rouge</b> = non (fixe : attends ; clignotant : danger, pas ici), <b>blanc clignotant</b> = « pose-toi / rentre au parking ».</p>`,
  },
  {
    id: 'interception',
    title: 'Être intercepté : les signaux (animé)',
    train: '#/train/psy.interception',
    html: `<p>La <b>police du ciel</b> vue de l’autre côté : un avion qui ne répond pas à la radio peut être intercepté par un chasseur en alerte (Rafale, Mirage 2000) ou un hélicoptère.</p>
      <div class="instr-row"><figure class="schema">${interceptionSVG('suivre')}<figcaption>Balancement des ailes : « suivez-moi »</figcaption></figure><figure class="schema">${interceptionSVG('liberer')}<figcaption>Dégagement en virage montant : « continuez »</figcaption></figure><figure class="schema">${interceptionSVG('atterrir')}<figcaption>Train sorti, phares, survol de piste : « atterrissez ici »</figcaption></figure></div>
      <h3>Conduite à tenir</h3><ol><li>Suivre les instructions visuelles de l’intercepteur.</li><li>Répondre en <b>balançant les ailes</b>.</li><li>Appeler sur <b>121,5 MHz</b> et afficher <b>7700</b> (sauf instruction contraire).</li></ol>`,
  },
  {
    id: 'urgences',
    title: 'Urgences en vol : les bons réflexes',
    train: '#/train/psy.urgences',
    html: `<p>Les questions de « jugement » testent tes priorités. La règle universelle : <b>Piloter, Naviguer, Communiquer</b> (aviate, navigate, communicate).</p>
      <div class="sit-ico drift">✈️💨</div>
      <ul><li><b>Panne moteur au décollage</b> : garder la vitesse, se poser devant (pas de demi-tour à basse hauteur).</li><li><b>Panne en croisière</b> : vitesse de meilleur plané, choix d’un champ, recherche de panne, MAYDAY + 7700.</li><li><b>Givrage carburateur</b> : baisse de régime par temps humide → réchauffage carburateur.</li><li><b>Cumulonimbus</b> : on le contourne largement, jamais dessous ni dedans.</li><li><b>Météo qui se dégrade</b> : demi-tour <b>tôt</b>.</li><li><b>Entrée dans un nuage</b> : instruments, ailes à plat, virage modéré pour ressortir.</li><li><b>Avertisseur de décrochage</b> : rendre la main + puissance.</li><li><b>Approche non stabilisée</b> : remise de gaz.</li><li><b>Perdu</b> : cap constant, position estimée, repère marquant, appel au SIV.</li></ul>
      <h3>Codes transpondeur</h3><table class="tbl"><tr><th>Code</th><th>Signification</th><th>Mémo</th></tr><tr><td>7500</td><td>Intervention illicite</td><td>« seven-five, man with a knife »</td></tr><tr><td>7600</td><td>Panne radio</td><td>« seven-six, radio fix »</td></tr><tr><td>7700</td><td>Détresse</td><td>« seven-seven, going to heaven »</td></tr></table>
      <p class="tip">Message de détresse : « MAYDAY MAYDAY MAYDAY », indicatif, nature du problème, intentions, position, altitude. Urgence sans danger immédiat : « PAN PAN ».</p>`,
  },
];

const animFig=(body,caption)=>fig('<svg viewBox="0 0 360 220" role="img" aria-label="'+caption+'"><rect width="360" height="220" rx="14" fill="#eef3f8"/>'+body+'</svg>',caption);
const check=(q,a)=>'<details class="visual-recall"><summary>'+q+'</summary><p>'+a+'</p></details>';
FICHES_ANIME.push(
{id:'moteur-flux',title:'Turboréacteur : trajet de l’air',train:'#/train/bia.aeronefs',html:'<h2>Suivre le flux</h2>'+animFig('<path d="M20 65 L95 80 L270 80 L340 60 L340 160 L270 140 L95 140 L20 155Z" fill="#c5d4e2" stroke="#315f91"/><g fill="#315f91"><rect x="80" y="80" width="12" height="60"/><rect x="110" y="80" width="10" height="60"/><rect x="140" y="80" width="10" height="60"/><rect x="250" y="80" width="12" height="60"/></g><rect x="165" y="87" width="65" height="46" rx="12" fill="#e8a15b"/><g fill="#315f91" font-size="12" text-anchor="middle"><text x="110" y="50">Compresseur</text><text x="198" y="175">Combustion</text><text x="255" y="50">Turbine</text><text x="320" y="190">Tuyère</text></g>'+[0,1,2,3].map(i=>'<circle cy="110" r="5" fill="#34816c"><animate attributeName="cx" from="12" to="348" dur="3s" begin="'+i*.75+'s" repeatCount="indefinite"/></circle>').join(''),'Flux simplifié dans un turboréacteur')+'<h2>Les quatre étapes</h2><p>Compression de l’air, combustion avec apport de carburant, détente dans la turbine qui entraîne le compresseur, puis accélération des gaz dans la tuyère. Le schéma ne représente pas le flux secondaire d’un turbofan.</p>'+check('Quel élément entraîne le compresseur ?','La turbine, par un arbre mécanique.')},
{id:'derive-anime',title:'Dérive : cap et route',train:'#/train/psy.vent',html:'<h2>Observer le déplacement</h2>'+animFig('<path d="M55 190V25" stroke="#315f91" stroke-width="2" stroke-dasharray="5 5"/><path d="M55 190L250 25" stroke="#34816c" stroke-width="3"/><path d="M90 110H200" stroke="#b86a36" stroke-width="3"/><path d="M190 103L200 110L190 117" fill="none" stroke="#b86a36" stroke-width="3"/><g fill="#263b50" font-size="13"><text x="12" y="20">Cap nord</text><text x="245" y="20">Route sol</text><text x="105" y="100">Vent vers l’est</text></g><g><path d="M0 -13L5 2L15 8L15 11L0 7L-15 11L-15 8L-5 2Z" fill="#315f91"/><animateMotion path="M55 190L250 25" dur="5s" repeatCount="indefinite"/></g>','Cap maintenu au nord, dérive vers l’est')+'<h2>Interprétation</h2><p>Le vent venant de l’ouest déplace la trajectoire vers l’est. Pour maintenir une route nord, il faut orienter le cap vers l’ouest d’un angle adapté au vent et à la vitesse air.</p>'+check('Le cap est-il identique à la route dans cet exemple ?','Non, le cap reste nord mais la route sol dévie vers l’est.')});
