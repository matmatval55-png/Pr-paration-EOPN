// Schémas SVG dessinés pour les fiches visuelles (aucune image externe, fonctionnent hors ligne
// et s'adaptent au thème clair/sombre via currentColor et les variables CSS).

/* ---------- Carte simplifiée de la France et des bases ---------- */
const K = 60, COS = Math.cos((46.5 * Math.PI) / 180);
const pt = (lon, lat) => [((lon + 5) * K * COS).toFixed(1), ((51.6 - lat) * K).toFixed(1)];
// Contour de la France métropolitaine : IGN Admin Express (Licence ouverte Etalab), via le projet
// france-geojson, simplifié et projeté pour ce schéma.
const FRANCE_PATH = 'M501.0,245.8 L495.0,246.5 L495.6,248.9 L490.6,254.5 L496.1,253.6 L497.5,256.4 L493.3,258.7 L493.8,261.4 L484.9,269.5 L483.2,273.7 L472.2,280.3 L473.3,288.7 L458.9,301.4 L460.8,303.3 L457.0,311.0 L461.3,313.9 L458.6,318.9 L459.4,320.9 L453.4,323.0 L452.5,328.1 L459.5,327.6 L465.8,323.1 L467.0,320.7 L464.1,319.4 L466.9,314.0 L470.4,315.6 L475.5,311.7 L484.2,311.5 L487.6,313.2 L486.1,314.7 L490.0,319.0 L487.2,327.7 L491.4,328.6 L490.4,332.9 L493.6,333.0 L497.4,340.6 L493.1,345.2 L488.1,345.8 L487.7,352.5 L495.6,357.6 L495.6,365.7 L503.2,371.6 L500.3,376.3 L501.3,380.6 L498.4,383.4 L494.2,383.5 L491.3,387.8 L486.0,386.4 L480.2,389.9 L482.1,394.7 L485.0,395.0 L485.3,401.7 L490.0,405.0 L495.9,405.6 L495.6,408.6 L498.3,413.2 L498.8,415.1 L493.9,415.8 L492.8,421.6 L489.6,424.3 L493.0,429.7 L491.2,430.8 L491.0,434.3 L495.9,441.8 L510.4,448.9 L523.9,445.6 L525.1,452.1 L522.6,457.5 L516.1,464.3 L517.5,468.7 L512.7,472.5 L505.7,474.6 L504.1,477.3 L502.1,476.8 L500.6,482.4 L493.6,483.9 L491.1,490.3 L484.6,491.7 L483.6,495.3 L478.4,499.4 L483.1,500.0 L479.9,506.4 L477.3,504.7 L471.0,507.1 L469.4,510.7 L462.9,509.0 L460.9,510.6 L460.8,514.3 L459.1,513.6 L459.5,511.3 L455.6,511.4 L451.0,508.6 L450.9,510.9 L447.2,513.0 L446.6,509.6 L440.0,504.8 L437.8,506.2 L435.0,503.3 L427.1,503.1 L428.4,501.3 L426.4,494.6 L414.6,496.3 L410.2,490.0 L407.4,491.6 L407.0,496.0 L399.0,495.2 L395.0,493.7 L394.9,489.4 L378.6,487.7 L375.9,482.7 L372.2,482.9 L357.8,492.5 L351.5,499.7 L346.4,499.0 L341.3,502.3 L334.2,511.9 L332.2,518.4 L331.9,538.4 L332.8,543.8 L336.1,545.1 L337.6,549.9 L333.9,550.5 L332.1,547.6 L328.2,547.1 L316.9,551.7 L316.9,555.5 L313.0,554.5 L311.4,556.0 L299.7,549.7 L294.4,551.3 L292.6,554.2 L288.5,554.3 L286.4,548.8 L278.0,546.4 L278.2,543.0 L280.3,541.6 L277.8,540.6 L278.3,539.3 L270.5,536.7 L267.6,536.9 L266.0,539.8 L262.6,533.1 L254.5,533.3 L252.2,529.7 L244.7,528.6 L235.8,524.3 L233.1,529.0 L234.2,534.6 L224.5,534.6 L221.4,532.6 L218.6,535.5 L213.8,531.8 L206.1,534.9 L202.3,532.7 L199.9,528.2 L193.6,525.0 L190.3,528.0 L185.5,526.5 L183.7,529.3 L176.6,522.5 L175.5,518.0 L167.4,518.8 L154.3,513.3 L152.5,511.9 L153.6,508.9 L150.9,510.5 L150.6,514.3 L147.0,513.2 L145.8,510.5 L148.0,508.4 L149.4,500.8 L144.3,498.4 L140.1,500.9 L139.5,498.0 L135.1,498.3 L132.7,494.9 L140.4,490.0 L146.2,478.8 L152.2,448.2 L154.5,423.2 L156.8,417.6 L158.5,416.2 L164.5,417.0 L158.4,409.5 L154.4,418.1 L159.6,365.3 L162.7,362.4 L171.9,373.3 L178.3,391.3 L181.4,395.1 L182.1,393.5 L178.9,388.4 L176.2,373.9 L173.4,368.4 L164.8,359.3 L155.4,353.6 L155.2,349.1 L159.7,347.7 L158.9,344.3 L161.0,343.7 L162.5,339.0 L161.1,336.6 L163.0,335.3 L159.9,328.4 L156.0,326.0 L160.6,320.3 L159.9,317.4 L156.9,317.0 L156.6,320.0 L151.0,315.5 L146.0,315.5 L144.5,312.2 L131.6,306.3 L129.9,299.5 L118.1,286.9 L117.5,282.6 L124.7,274.3 L121.7,270.4 L114.5,268.1 L117.0,266.0 L116.9,259.9 L111.4,261.8 L108.6,259.4 L105.6,260.4 L102.7,258.9 L103.1,256.3 L100.8,253.5 L105.3,250.5 L103.3,248.6 L103.2,246.6 L105.7,246.2 L104.7,245.3 L97.0,243.6 L95.8,246.3 L88.8,246.1 L86.3,242.4 L92.4,243.8 L94.4,241.4 L92.7,237.8 L87.0,241.1 L77.5,241.8 L78.7,247.1 L77.3,247.6 L76.8,241.2 L73.9,237.6 L77.4,232.6 L75.3,231.9 L73.7,237.3 L68.2,232.3 L63.9,234.3 L61.1,230.5 L61.0,225.1 L60.4,230.2 L52.2,227.7 L47.5,228.2 L42.2,221.7 L42.2,224.8 L34.5,225.0 L34.1,223.4 L33.7,228.0 L26.3,228.3 L26.8,224.6 L23.8,218.2 L19.0,215.2 L12.4,214.3 L11.7,212.3 L29.5,209.7 L28.8,204.3 L22.2,201.7 L18.4,205.9 L18.8,201.5 L16.3,200.4 L18.5,195.7 L19.2,199.0 L32.1,198.2 L26.1,195.4 L23.0,196.4 L23.8,192.1 L16.2,195.7 L13.3,194.7 L9.4,196.2 L8.5,191.2 L11.1,182.6 L26.8,175.4 L32.1,177.1 L33.6,174.8 L38.9,174.6 L42.0,172.4 L43.4,176.8 L45.3,176.1 L47.7,178.4 L48.7,173.9 L55.4,174.3 L55.4,176.4 L58.6,175.8 L60.3,166.6 L66.2,168.0 L73.5,164.0 L74.2,165.9 L78.7,163.9 L79.2,166.4 L82.0,166.7 L80.7,168.7 L85.5,170.8 L84.9,172.8 L89.8,177.0 L90.1,180.4 L94.2,182.7 L95.1,185.7 L104.6,177.0 L110.9,175.6 L110.0,178.8 L113.0,177.4 L115.4,181.3 L119.3,177.6 L122.7,178.6 L125.0,183.9 L122.8,176.9 L126.5,174.3 L130.2,174.3 L129.2,177.2 L133.2,179.8 L146.9,178.3 L149.0,177.0 L142.1,171.9 L140.2,165.7 L142.8,160.1 L140.0,151.2 L140.9,142.0 L139.1,143.1 L135.8,136.5 L131.9,133.7 L128.6,123.6 L130.3,118.9 L126.1,115.5 L126.3,112.5 L139.4,117.2 L147.8,113.8 L154.1,114.3 L155.7,119.5 L153.0,121.0 L152.6,123.7 L158.3,131.5 L157.8,133.3 L160.3,134.7 L162.0,132.7 L167.7,132.3 L172.4,134.5 L189.4,135.9 L197.2,139.1 L206.5,136.5 L211.9,131.8 L220.5,129.5 L211.5,128.2 L209.4,125.6 L214.4,113.6 L230.2,105.0 L248.6,101.0 L256.3,97.6 L266.6,89.4 L270.5,83.1 L276.0,85.0 L270.0,79.0 L270.6,75.0 L274.3,74.9 L270.8,72.1 L272.0,63.8 L273.4,63.9 L271.0,54.0 L272.8,50.2 L271.9,43.7 L280.1,38.7 L311.7,30.7 L315.2,39.2 L313.5,40.9 L315.3,47.2 L318.8,47.2 L322.7,53.0 L326.2,54.3 L331.3,49.7 L336.7,49.1 L341.1,54.0 L342.2,64.3 L345.9,66.5 L350.0,64.0 L351.9,64.6 L350.9,66.1 L355.5,66.2 L357.8,68.8 L357.6,73.7 L359.8,77.8 L361.3,74.9 L368.0,76.3 L372.8,74.6 L376.8,79.6 L380.3,79.6 L377.0,87.9 L379.8,87.9 L381.1,91.2 L377.3,94.8 L379.8,98.7 L392.8,99.2 L399.6,96.2 L399.9,91.9 L403.2,87.8 L408.0,86.9 L404.3,97.8 L408.4,101.4 L407.0,108.5 L413.0,108.0 L419.9,114.4 L424.1,114.2 L426.7,116.7 L425.9,119.2 L430.8,120.4 L432.5,126.2 L445.0,122.2 L448.9,126.1 L453.1,126.5 L453.6,128.9 L464.9,125.4 L477.2,130.9 L477.8,135.3 L484.0,142.7 L484.8,146.2 L488.8,146.9 L488.8,143.3 L492.9,142.7 L497.0,144.6 L497.9,149.2 L499.9,147.6 L507.3,149.0 L514.0,144.9 L517.5,150.2 L521.9,152.8 L528.4,152.1 L531.5,154.0 L534.2,152.5 L540.7,156.6 L546.1,157.4 L540.9,167.4 L535.7,170.7 L530.3,177.5 L526.0,191.8 L526.4,195.9 L519.5,208.8 L519.2,214.2 L521.3,217.7 L516.8,233.8 L519.8,241.4 L511.3,250.1 L505.8,250.7 L502.7,249.3 L503.3,246.5 L501.0,245.8Z M594.8,584.5 L594.2,596.4 L590.1,599.5 L590.4,601.0 L593.3,600.2 L587.5,609.5 L587.2,613.9 L585.6,614.0 L582.0,612.1 L582.2,609.4 L573.5,605.7 L569.0,600.5 L574.7,594.6 L565.3,591.1 L570.1,582.6 L569.1,580.5 L562.3,581.9 L561.6,578.8 L567.5,573.5 L563.6,568.7 L560.8,566.6 L560.1,561.8 L565.4,559.3 L562.3,555.0 L559.7,555.2 L562.0,551.0 L564.0,551.1 L564.4,545.2 L573.3,538.2 L578.6,537.6 L583.4,532.1 L587.3,531.9 L590.3,535.5 L592.5,531.8 L591.1,526.2 L592.3,516.3 L595.3,515.6 L597.4,516.8 L598.5,528.3 L596.6,535.6 L600.0,542.0 L601.3,564.2 L600.9,569.8 L595.3,578.7 L594.8,584.5Z';

export const BASES = [
  { n: 'Tours (BA 705)', d: 'Sélection CSSA', lon: 0.72, lat: 47.43, side: 'r' },
  { n: 'Salon-de-Provence (BA 701)', d: 'École de l’air et de l’espace, Patrouille de France', lon: 5.1, lat: 43.6, side: 'r', dy: -8 },
  { n: 'Istres (BA 125)', d: 'Phénix (ravitaillement)', lon: 4.92, lat: 43.52, side: 'l', dy: 10 },
  { n: 'Cognac (BA 709)', d: 'PC-21, drones Reaper', lon: -0.32, lat: 45.66, side: 'l' },
  { n: 'Saint-Dizier (BA 113)', d: 'Rafale (dont FAS)', lon: 4.97, lat: 48.64, side: 'l' },
  { n: 'Nancy-Ochey (BA 133)', d: 'Mirage 2000D', lon: 5.95, lat: 48.58, side: 'r', dy: 10 },
  { n: 'Mont-de-Marsan (BA 118)', d: 'Rafale, CEAM', lon: -0.5, lat: 43.9, side: 'l' },
  { n: 'Orléans-Bricy (BA 123)', d: 'A400M Atlas', lon: 1.77, lat: 47.98, side: 'r' },
  { n: 'Avord (BA 702)', d: 'AWACS E-3F', lon: 2.63, lat: 47.05, side: 'r' },
  { n: 'Villacoublay (BA 107)', d: 'Avions gouvernementaux', lon: 2.19, lat: 48.77, side: 'l', dy: -6 },
  { n: 'Bordeaux-Mérignac (BA 106)', d: 'Commandement territorial', lon: -0.7, lat: 44.83, side: 'l' },
  { n: 'Toulouse', d: 'Commandement de l’espace', lon: 1.44, lat: 43.6, side: 'r', dy: 6 },
];

export function carteBases() {
  const dots = BASES.map((b, i) => {
    const [x, y] = pt(b.lon, b.lat);
    const tx = b.side === 'r' ? +x + 9 : +x - 9;
    return `<g><circle cx="${x}" cy="${y}" r="6" fill="var(--accent)" stroke="var(--card)" stroke-width="2"/><text x="${tx}" y="${+y + 4 + (b.dy || 0)}" font-size="16" font-weight="800" text-anchor="${b.side === 'r' ? 'start' : 'end'}" fill="currentColor">${i + 1}</text></g>`;
  }).join('');
  return `<figure class="schema"><svg viewBox="0 20 620 600" role="img" aria-label="Carte des principales bases aériennes">
    <path d="${FRANCE_PATH}" fill="var(--card2)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    ${dots}
  </svg><figcaption>Principales bases citées dans les fiches (positions approximatives). Contour : IGN Admin Express, Licence ouverte Etalab.</figcaption></figure>
  <ol class="legend">${BASES.map((b) => `<li><b>${b.n}</b> — ${b.d}</li>`).join('')}</ol>`;
}

/* ---------- Insignes de grades (officiers et généraux) ---------- */
function epaulette(galons, label) {
  const bars = galons.map((c, i) => `<rect x="14" y="${78 - i * 11}" width="52" height="7" rx="1" fill="${c === 'a' ? '#c9ced6' : '#d4a72c'}"/>`).join('');
  return `<div class="grade"><svg viewBox="0 0 80 120" width="70"><rect x="6" y="6" width="68" height="108" rx="12" fill="#13203a" stroke="currentColor" stroke-width="1.5"/><circle cx="40" cy="20" r="5" fill="#d4a72c"/>${bars}</svg><span>${label}</span></div>`;
}
function etoiles(n, label) {
  const star = (cx, cy) => `<polygon transform="translate(${cx} ${cy}) scale(0.5)" points="0,-18 5,-6 18,-6 8,2 12,15 0,7 -12,15 -8,2 -18,-6 -5,-6" fill="#c9ced6"/>`;
  const pos = [];
  const step = n > 4 ? 15 : 17;
  for (let i = 0; i < n; i++) pos.push([40, 100 - i * step]);
  return `<div class="grade"><svg viewBox="0 0 80 120" width="70"><rect x="6" y="6" width="68" height="108" rx="12" fill="#13203a" stroke="currentColor" stroke-width="1.5"/><circle cx="40" cy="20" r="5" fill="#d4a72c"/>${pos.map(([x, y]) => star(x, y)).join('')}</svg><span>${label}</span></div>`;
}

export function insignesGrades() {
  const o = 'o', a = 'a';
  return `<figure class="schema"><div class="grades">
      ${epaulette([o], 'Sous-lieutenant')}${epaulette([o, o], 'Lieutenant')}${epaulette([o, o, o], 'Capitaine')}${epaulette([o, o, o, o], 'Commandant')}${epaulette([o, a, o, a, o], 'Lieutenant-colonel')}${epaulette([o, o, o, o, o], 'Colonel')}
    </div><div class="grades">
      ${etoiles(2, 'Général de brigade aérienne')}${etoiles(3, 'Général de division aérienne')}${etoiles(4, 'Général de corps aérien')}${etoiles(5, 'Général d’armée aérienne')}
    </div><figcaption>Schéma simplifié des fourreaux d’épaule : nombre de galons (dorés ; 2 argentés pour le lieutenant-colonel) et d’étoiles. Vérifie l’aspect exact des insignes sur les sources officielles.</figcaption></figure>`;
}

/* ---------- Organigramme ---------- */
export function organigramme() {
  const box = (t, s = '', cls = '') => `<div class="org-box ${cls}"><b>${t}</b>${s ? `<span>${s}</span>` : ''}</div>`;
  return `<figure class="schema"><div class="org">
      ${box('Président de la République', 'chef des armées (art. 15)', 'top')}
      <div class="org-arrow">↓</div>
      ${box('Ministre des Armées', 'gouvernement')}
      <div class="org-arrow">↓</div>
      ${box('CEMA', 'chef d’état-major des armées : commande les opérations')}
      <div class="org-arrow">↓</div>
      ${box('CEMAAE', 'chef d’état-major de l’Armée de l’Air et de l’Espace + état-major (EMAAE)', 'accent')}
      <div class="org-arrow">↓</div>
      <div class="org-row">
        ${box('CFA', 'Commandement des forces aériennes : prépare les forces')}
        ${box('CDAOA', 'Défense aérienne et opérations aériennes')}
        ${box('CFAS', 'Forces aériennes stratégiques (dissuasion)')}
        ${box('CDE', 'Commandement de l’espace (Toulouse)')}
        ${box('CTAAE', 'Commandement territorial (Bordeaux-Mérignac, 2023)')}
      </div>
      <div class="org-arrow">↓</div>
      ${box('Bases aériennes, escadres et escadrons', 'les unités où servent les aviateurs')}
    </div><figcaption>Organisation simplifiée. Sources : organigramme AAE, arrêtés de création du CDE (2019) et du CTAAE (2023).</figcaption></figure>`;
}

/* ---------- Anatomie d'un avion de combat (vue de dessus) ---------- */
export function anatomieChasseur() {
  const lab = (x, y, tx, ty, t, anchor = 'start') => `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="var(--accent)" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="3" fill="var(--accent)"/><text x="${anchor === 'start' ? tx + 4 : tx - 4}" y="${ty + 4}" font-size="13" text-anchor="${anchor}" fill="currentColor">${t}</text>`;
  return `<figure class="schema"><svg viewBox="0 0 520 560" role="img" aria-label="Anatomie d'un avion de combat">
      <g fill="var(--card2)" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
        <path d="M260 30 L272 90 L276 170 L282 250 L430 400 L430 420 L290 400 L292 470 L300 500 L268 500 L260 488 L252 500 L220 500 L228 470 L230 400 L90 420 L90 400 L238 250 L244 170 L248 90 Z"/>
        <path d="M244 170 L190 205 L190 215 L246 205 Z"/><path d="M276 170 L330 205 L330 215 L274 205 Z"/>
        <path d="M260 350 L252 470 L268 470 Z" fill="var(--line)"/>
      </g>
      <ellipse cx="260" cy="120" rx="9" ry="28" fill="#4c8dff" opacity="0.7"/>
      <rect x="226" y="335" width="8" height="70" rx="3" fill="currentColor" opacity="0.6"/>
      <rect x="286" y="335" width="8" height="70" rx="3" fill="currentColor" opacity="0.6"/>
      <rect x="130" y="380" width="6" height="40" rx="3" fill="var(--danger)"/><rect x="384" y="380" width="6" height="40" rx="3" fill="var(--danger)"/>
      <circle cx="252" cy="502" r="6" fill="var(--warn)"/><circle cx="268" cy="502" r="6" fill="var(--warn)"/>
      ${lab(260, 45, 330, 40, 'Radome (radar dans le nez)')}
      ${lab(262, 120, 330, 95, 'Cockpit / verrière')}
      ${lab(268, 70, 160, 60, 'Perche de ravitaillement', 'end')}
      ${lab(195, 210, 120, 180, 'Plan canard', 'end')}
      ${lab(248, 230, 120, 255, 'Entrée d’air', 'end')}
      ${lab(360, 330, 400, 300, 'Aile delta')}
      ${lab(420, 410, 440, 450, 'Aileron/élevon (bord de fuite)', 'end')}
      ${lab(133, 400, 70, 470, 'Missile en bout d’aile', 'start')}
      ${lab(260, 420, 340, 470, 'Dérive (gouverne de direction)')}
      ${lab(268, 502, 330, 535, 'Tuyères (2 réacteurs)')}
    </svg><figcaption>Vue de dessus schématique d’un chasseur à aile delta et plans canard (configuration du Rafale). Le dessin n’est pas à l’échelle.</figcaption></figure>`;
}

/* ---------- Chaîne de la posture permanente de sûreté aérienne ---------- */
export function chainePPS() {
  const steps = [
    ['📡', 'Détecter', 'Radars au sol, avions radar AWACS, informations du contrôle civil.'],
    ['🖥️', 'Analyser', 'Les centres de défense aérienne évaluent la situation : avion qui ne répond pas, trajectoire anormale…'],
    ['🚨', 'Décider', 'Ordre de décollage des avions en alerte (quelques minutes).'],
    ['✈️', 'Intercepter', 'Les chasseurs rejoignent l’appareil, l’identifient visuellement et tentent d’établir le contact (signaux, radio).'],
    ['🛡️', 'Agir', 'Escorter, dérouter, faire atterrir. Un éventuel usage de la force ne peut être décidé qu’au plus haut niveau de l’État.'],
  ];
  return `<figure class="schema"><div class="flow">${steps
    .map(([i, t, d], k) => `<div class="flow-step"><span class="flow-ico">${i}</span><div><b>${k + 1}. ${t}</b><p>${d}</p></div></div>${k < steps.length - 1 ? '<div class="flow-arrow">↓</div>' : ''}`)
    .join('')}</div><figcaption>Schéma simplifié de la « police du ciel », assurée 24 h/24.</figcaption></figure>`;
}

/* ---------- Dissuasion ---------- */
export function schemaDissuasion() {
  return `<figure class="schema"><div class="org">
      <div class="org-box top"><b>Président de la République</b><span>seul à pouvoir décider de l’emploi de l’arme nucléaire</span></div>
      <div class="org-arrow">↓ ↓</div>
      <div class="org-row two">
        <div class="org-box"><b>🌊 Composante océanique</b><span>Sous-marins nucléaires lanceurs d’engins (SNLE) de la Marine nationale : invulnérabilité, permanence à la mer.</span></div>
        <div class="org-box accent"><b>✈️ Composante aéroportée</b><span>Forces aériennes stratégiques (Rafale, missile ASMPA) et Force aéronavale nucléaire (porte-avions) : démonstration de détermination, flexibilité.</span></div>
      </div>
      <div class="org-arrow">↓</div>
      <div class="org-box"><b>Un raid aérien, c’est une équipe</b><span>Rafale porteurs, ravitailleurs A330 Phénix, avions radar E-3F, escorte, guerre électronique — entraînés lors des exercices « Poker ».</span></div>
    </div><figcaption>Les deux composantes de la dissuasion nucléaire française (la composante terrestre a été démantelée dans les années 1990).</figcaption></figure>`;
}

/* ---------- Frise chronologique ---------- */
export const FRISE = [
  [1909, 'Blériot traverse la Manche'],
  [1914, 'Première Guerre mondiale : naissance de l’aviation militaire'],
  [1934, 'L’armée de l’air devient une armée autonome'],
  [1940, 'Bataille d’Angleterre'],
  [1943, 'Normandie-Niémen sur le front de l’Est'],
  [1953, 'Naissance officielle de la Patrouille de France'],
  [1964, 'Création des Forces aériennes stratégiques'],
  [1986, 'Premier vol du Rafale A'],
  [2006, 'Le Rafale entre en service dans l’armée de l’air'],
  [2019, 'Création du Commandement de l’espace'],
  [2020, 'Armée de l’Air et de l’Espace'],
];

export function frise() {
  return `<figure class="schema"><div class="frise">${FRISE.map(([y, t]) => `<div class="frise-item"><span class="frise-year">${y}</span><span class="frise-dot"></span><span class="frise-txt">${t}</span></div>`).join('')}</div><figcaption>Frise : les grandes dates à connaître pour l’entretien.</figcaption></figure>`;
}
