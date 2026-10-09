// Icônes au trait (24×24, couleur du texte) utilisées à la place des émojis dans l'interface.
const P = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  brain: '<path d="M9.5 4.5A2.5 2.5 0 0 0 7 7a3 3 0 0 0-2.5 4.5A3 3 0 0 0 6 16.5 2.5 2.5 0 0 0 9.5 19.5h.5V4.5z"/><path d="M14.5 4.5A2.5 2.5 0 0 1 17 7a3 3 0 0 1 2.5 4.5 3 3 0 0 1-1.5 5 2.5 2.5 0 0 1-3.5 3h-.5V4.5z"/>',
  book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  chart: '<path d="M3 20h18"/><path d="M6.5 16v-5M11.5 16V6M16.5 16v-8"/>',
  sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  repeat: '<path d="M4 11V9a3 3 0 0 1 3-3h12"/><path d="m16 3 3 3-3 3"/><path d="M20 13v2a3 3 0 0 1-3 3H5"/><path d="m8 21-3-3 3-3"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  cards: '<rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  health: '<path d="M20.8 8.6a5 5 0 0 0-8.8-3.1A5 5 0 0 0 3.2 8.6c0 5.4 8.8 11.4 8.8 11.4s8.8-6 8.8-11.4z"/><path d="M3.8 12h3.7l2-3 3 5 2-2h5.7"/>',
  check: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="m8 12 3 3 5-6"/>',
  pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield: '<path d="M12 3 4.5 6v6c0 4.5 3.2 7.7 7.5 9 4.3-1.3 7.5-4.5 7.5-9V6z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  sigma: '<path d="M18 5H6l6 7-6 7h12"/>',
  atom: '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  plane: '<path d="M12 2.5c.8 0 1.4.9 1.4 2v5.2l7.6 4.3v2l-7.6-2.2v4.4l2.4 1.8v1.5L12 20.5l-3.8 1v-1.5l2.4-1.8v-4.4L3 16v-2l7.6-4.3V4.5c0-1.1.6-2 1.4-2z"/>',
  medal: '<circle cx="12" cy="15" r="5"/><path d="M8.5 11 6 3h4l2 5 2-5h4l-2.5 8"/>',
  play: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 9 5 3-5 3z"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  fire: '<path d="M12 21c4 0 7-2.7 7-6.5 0-4-3.5-6.5-4.5-10.5-2 1.5-3 3.5-3 5.5-1-1-1.5-2-1.5-3C7 8.5 5 11.5 5 14.5 5 18.3 8 21 12 21z"/>',
  radio: '<rect x="3" y="8" width="18" height="12" rx="2"/><circle cx="15.5" cy="14" r="2.5"/><path d="M7 12h4M7 16h4M6 8l10-5"/>',
  dot: '<circle cx="12" cy="12" r="2.5"/>',
};

// Correspondance émoji → icône (les émojis absents de la liste deviennent un point discret).
const MAP = {
  '🏠': 'home', '🧠': 'brain', '📖': 'book', '📚': 'book', '📘': 'book', '📰': 'book', '✏️': 'pencil', '🗓️': 'calendar', '📅': 'calendar',
  '📊': 'chart', '⚙️': 'sliders', '🧭': 'compass', '🔁': 'repeat', '📈': 'trend', '🃏': 'cards', '🗂️': 'cards', '🎤': 'mic', '👥': 'users',
  '⏱️': 'timer', '⏲️': 'timer', '🩺': 'health', '✅': 'check', '🏃': 'pulse', '📝': 'clipboard', '🎯': 'target', '🆕': 'sparkle', '🚀': 'sparkle',
  '⏳': 'clock', '🔧': 'shield', 'ℹ️': 'info', '💾': 'download', '📐': 'sigma', '⚛️': 'atom', '🇬🇧': 'globe', '✈️': 'plane', '🛩️': 'plane',
  '🎖️': 'medal', '🎬': 'play', '🖼️': 'image', '💡': 'bulb', '🔥': 'fire', '📻': 'radio', '🛫': 'plane', '🔢': 'sigma', '🧩': 'brain',
};

export function icon(name, size = 22) {
  return `<svg class="i" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.dot}</svg>`;
}

export function iconForEmoji(e) {
  const k = e.trim();
  return MAP[k] || MAP[k.replace(/️/g, '')] || MAP[k + '️'] || 'dot';
}
