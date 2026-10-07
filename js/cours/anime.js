// Fiches animées : situations de vol expliquées avec des schémas qui bougent.
import { rmiSVG, radialMap, windSVG, circuitSVG, papiSVG, horizonAnimSVG, trafficSVG } from '../psycho/situations.js';

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
      <p>Si l’on augmente trop l’incidence (environ 15 à 18°), les filets ne suivent plus la courbure de l’extrados : ils <b>décollent</b> et forment des tourbillons. La portance chute brutalement : c’est le <b>décrochage</b>.</p>
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
      <p class="tip">Objectif : <b>2 blancs + 2 rouges</b> jusqu’à l’arrondi. Si tu vois du rouge partout, remets de la puissance et remonte sur le plan (ou remets les gaz).</p>`,
  },
  {
    id: 'vor',
    title: 'Radiales VOR et RMI (animé)',
    train: '#/train/psy.vor',
    html: `<p>Une balise <b>VOR</b> émet 360 « routes » appelées <b>radiales</b>, numérotées selon la direction <b>depuis</b> la balise : la radiale 090 part vers l’est.</p>
      <div class="instr-row">${rmiSVG(30, 270)}${radialMap(90, 30)}</div>
      <p>Sur le <b>RMI</b>, l’aiguille pointe toujours <b>vers la balise</b>. Ici, la tête indique 270 : pour rejoindre la balise, il faut prendre le cap 270. La <b>queue</b> indique 090 : tu es sur la <b>radiale 090</b>, donc à l’<b>est</b> de la balise, quel que soit ton cap (ici 030).</p>
      <ul><li><b>QDM</b> = cap magnétique pour aller vers la balise (tête de l’aiguille).</li><li><b>QDR</b> = radiale sur laquelle tu te trouves (queue de l’aiguille) = QDM ± 180.</li></ul>`,
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
      <div class="instr-row"><figure class="schema">${trafficSVG(2, true, false)}<figcaption>Trafic à 2 h qui reste au même endroit du pare-brise et grossit : <b>collision</b> !</figcaption></figure><figure class="schema">${trafficSVG(2, false, true)}<figcaption>Trafic qui glisse dans le pare-brise : il passera devant.</figcaption></figure></div>
      <ul><li><b>Position relative constante + distance qui diminue = trajectoire de collision.</b></li><li>Convergence : priorité à l’aéronef qui vient de la <b>droite</b>.</li><li>Face à face : chacun s’écarte vers sa <b>droite</b>.</li><li>Dépassement : par la droite.</li></ul>`,
  },
];
