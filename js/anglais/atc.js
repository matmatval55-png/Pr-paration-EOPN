// Listening: ATC messages read aloud by the phone (speech synthesis), choose the correct readback.
import { register } from '../core/registry.js';
import { buildChoices } from '../core/rng.js';
import { ICAO } from './index.js';

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'niner'];
export const digits = (s) => String(s).split('').map((c) => (c === '.' ? 'decimal' : WORDS[+c])).join(' ');
const pad3 = (h) => String(h).padStart(3, '0');

function callsign(r) {
  const letters = Array.from({ length: 4 }, () => ABC[r.int(0, 25)]).join('');
  return { written: `F-${letters}`, short: `F-${letters.slice(2)}`, spoken: ['Foxtrot', ...letters.split('').map((c) => ICAO[ABC.indexOf(c)])].join(' ') };
}

const TEMPLATES = [
  // décollage
  (r, cs) => {
    const rw = r.pick(['09', '27', '18', '36', '04', '22', '13', '31']);
    const wd = r.int(1, 36) * 10, ws = r.int(3, 20);
    const other = r.pick(['09', '27', '18', '36', '04', '22'].filter((x) => x !== rw));
    return {
      spoken: `${cs.spoken}, runway ${digits(rw)}, wind ${digits(pad3(wd))} degrees, ${digits(ws)} knots, cleared for take-off.`,
      text: `${cs.written}, runway ${rw}, wind ${pad3(wd)} degrees ${ws} knots, cleared for take-off.`,
      q: 'What is the correct readback?',
      a: `Runway ${rw}, cleared for take-off, ${cs.written}.`,
      d: [`Runway ${rw}, line up and wait, ${cs.written}.`, `Runway ${other}, cleared for take-off, ${cs.written}.`, `Runway ${rw}, cleared to land, ${cs.written}.`],
      e: 'A take-off clearance must be read back with the <b>runway</b> and the word <b>cleared</b>. The wind is not read back.',
    };
  },
  // cap et niveau
  (r, cs) => {
    const h = r.int(1, 36) * 10, fl = r.pick([50, 60, 70, 80, 90, 100, 110, 120]);
    const left = r.bool();
    const climb = r.bool();
    const dir = left ? 'left' : 'right', odir = left ? 'right' : 'left';
    const v = climb ? 'climb' : 'descend', ov = climb ? 'descend' : 'climb';
    const H = pad3(h), FL = pad3(fl);
    const wrongH = pad3(((h + r.pick([20, 30, 50])) % 360) || 360);
    return {
      spoken: `${cs.spoken}, turn ${dir} heading ${digits(H)}, ${v} flight level ${fl % 100 ? digits(String(fl)) : WORDS[fl / 100] + ' hundred'}.`,
      text: `${cs.written}, turn ${dir} heading ${H}, ${v} flight level ${fl}.`,
      q: 'What is the correct readback?',
      a: `Turn ${dir} heading ${H}, ${v} FL ${FL}, ${cs.short}.`,
      d: [`Turn ${odir} heading ${H}, ${v} FL ${FL}, ${cs.short}.`, `Turn ${dir} heading ${wrongH}, ${v} FL ${FL}, ${cs.short}.`, `Turn ${dir} heading ${H}, ${ov} FL ${FL}, ${cs.short}.`],
      e: 'Headings and levels are always read back. Check three things: <b>left/right</b>, the <b>heading digits</b>, and <b>climb/descend</b>.',
    };
  },
  // transpondeur et fréquence
  (r, cs) => {
    const code = Array.from({ length: 4 }, () => r.int(0, 7)).join('');
    const f = `${r.pick([118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134])}.${r.pick(['05', '1', '15', '2', '25', '3', '35', '4', '45', '5', '55', '6', '7', '8', '85', '9'])}`;
    const unit = r.pick(['Approach', 'Information', 'Tower', 'Control']);
    const wrongCode = code.slice(0, 2) + code[3] + code[2];
    const wrongF = f.replace(/\.(\d)/, (m, d) => '.' + ((+d + 1) % 10));
    return {
      spoken: `${cs.spoken}, squawk ${digits(code)}, contact ${unit} on ${digits(f)}.`,
      text: `${cs.written}, squawk ${code}, contact ${unit} on ${f}.`,
      q: 'What must you set?',
      a: `Squawk ${code}, frequency ${f}`,
      d: [`Squawk ${wrongCode}, frequency ${f}`, `Squawk ${code}, frequency ${wrongF}`, `Squawk ${wrongCode}, frequency ${wrongF}`],
      e: 'Squawk codes only use digits 0 to 7 (octal). Frequencies are read digit by digit with “decimal”.',
    };
  },
  // altitude et QNH
  (r, cs) => {
    const alt = r.pick([1500, 2000, 2500, 3000, 3500, 4000, 5000]);
    const qnh = r.int(995, 1030);
    const wq = qnh + r.pick([-2, -1, 1, 2, 10]);
    const altSpoken = alt % 1000 ? `${WORDS[Math.floor(alt / 1000)]} thousand five hundred` : `${WORDS[alt / 1000]} thousand`;
    return {
      spoken: `${cs.spoken}, descend to altitude ${altSpoken} feet, QNH ${digits(qnh)}.`,
      text: `${cs.written}, descend to altitude ${alt} feet, QNH ${qnh}.`,
      q: 'What is the correct readback?',
      a: `Descend altitude ${alt} feet, QNH ${qnh}, ${cs.short}.`,
      d: [`Descend altitude ${alt} feet, QNH ${wq}, ${cs.short}.`, `Descend FL ${alt / 100}, ${cs.short}.`, `Descend altitude ${alt + 500} feet, QNH ${qnh}, ${cs.short}.`],
      e: '“Altitude” + QNH: set the QNH on the altimeter and read it back. Don’t confuse an altitude (QNH) with a flight level (1013).',
    };
  },
  // roulage
  (r, cs) => {
    const rw = r.pick(['09', '27', '18', '36', '22', '04']);
    const tw = r.pick(['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo']);
    const hp = r.pick(['Alfa 1', 'Bravo 2', 'Charlie 1', 'Delta 3']);
    return {
      spoken: `${cs.spoken}, taxi to holding point ${hp} runway ${digits(rw)}, via taxiway ${tw}, hold short of runway ${digits(rw)}.`,
      text: `${cs.written}, taxi to holding point ${hp} runway ${rw} via taxiway ${tw}, hold short of runway ${rw}.`,
      q: 'What must you do?',
      a: `Taxi via ${tw} to holding point ${hp} and stop before runway ${rw}`,
      d: [`Taxi via ${tw} and line up on runway ${rw}`, `Taxi via ${tw} and cross runway ${rw}`, `Hold position on taxiway ${tw}`],
      e: '<b>Hold short</b> = stop before the runway. You must not enter the runway without a new clearance (“line up and wait” or “cleared for take-off”).',
    };
  },
];

register({
  id: 'en.atc',
  module: 'anglais',
  group: 'Radiotelephony',
  title: 'ATC listening',
  desc: 'Listen to a controller message (read by your phone) and choose the correct readback.',
  make(level, r) {
    const cs = callsign(r);
    const t = r.pick(TEMPLATES)(r, cs);
    const rate = { 1: 0.85, 2: 1, 3: 1.15 }[level];
    const { choices, answer } = buildChoices(r, t.a, t.d, 4);
    const spoken = t.spoken.replace(/"/g, '');
    return {
      kind: 'mcq',
      prompt: `<button type="button" class="btn primary block" data-speak="${spoken}" data-rate="${rate}">🔊 Écouter le message${level === 3 ? ' (rapide)' : ''}</button>
        <details class="small" style="margin:8px 0"><summary>Afficher le texte (si pas de son)</summary>${t.text}</details>${t.q}`,
      choices,
      answer,
      explain: `<p>Message : <i>${t.text}</i></p><p>${t.e}</p><p class="small muted">Callsign ${cs.written} = ${cs.spoken}. After first contact, ATC may abbreviate it to ${cs.short}.</p>`,
      timeLimit: 45,
    };
  },
});
