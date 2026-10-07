// Export du planning au format iCalendar (.ics) : importable dans l'agenda du téléphone, avec rappel.
import { MODS } from './plan.js';

const pad = (n) => String(n).padStart(2, '0');
const stamp = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
const esc = (s) => String(s).replace(/[\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n');

/**
 * plan : résultat de buildWeek ; from : Date (aujourd'hui) ; hour : 'HH:MM' ; weeks : nombre de semaines.
 * Un événement par jour de travail (somme des créneaux) + un événement par séance de sport.
 */
export function buildICS(plan, { from = new Date(), hour = '18:00', weeks = 4, url = '' } = {}) {
  const [h, m] = hour.split(':').map(Number);
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Prepa EOPN//Planning//FR', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Prépa EOPN'];
  const now = stamp(new Date());
  let uid = 0;
  const event = (start, minutes, summary, desc) => {
    const end = new Date(start.getTime() + minutes * 60000);
    lines.push('BEGIN:VEVENT', `UID:eopn-${start.getTime()}-${uid++}@prepa-eopn`, `DTSTAMP:${now}`, `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${esc(summary)}`, `DESCRIPTION:${esc(desc)}`, 'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(summary)}`, 'TRIGGER:-PT10M', 'END:VALARM', 'END:VEVENT');
  };
  for (let i = 0; i < weeks * 7; i++) {
    const day = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i, h, m);
    const di = (day.getDay() + 6) % 7;
    const blocks = plan.perDay[di];
    const total = blocks.reduce((a, b) => a + b.min, 0);
    if (total) {
      const desc = blocks.map((b) => `${MODS[b.mod].label} : ${b.min} min`).join('\n') + (url ? `\n\nOuvrir l’application : ${url}#/planning` : '');
      event(day, total, `Prépa EOPN · ${blocks.map((b) => MODS[b.mod].label).join(', ')}`, desc);
    }
    if (plan.sport.includes(di)) {
      const s = new Date(day.getTime() + (total + 15) * 60000);
      event(s, 45, 'Prépa EOPN · Sport', `Séance du programme sportif.${url ? `\n${url}#/sport` : ''}`);
    }
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
