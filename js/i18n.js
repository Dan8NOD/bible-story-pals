// UI words. Every entry is { en, es }. Story text lives in stories.js.

export const UI = {
  appName: { en: 'Bible Story Pals', es: 'Amiguitos de la Biblia' },
  play: { en: "Let's play!", es: '¡A jugar!' },
  tryAgain: { en: 'Try again!', es: '¡Intenta otra vez!' },
  youEarned: { en: 'You earned a star!', es: '¡Ganaste una estrella!' },
  home: { en: 'Home', es: 'Inicio' },
  next: { en: 'Next', es: 'Siguiente' },
  back: { en: 'Back', es: 'Atrás' },
  listen: { en: 'Listen again', es: 'Escuchar otra vez' },
  again: { en: 'Play again', es: 'Jugar otra vez' },
  nextStory: { en: 'Next story', es: 'Siguiente historia' },
  parents: { en: 'For grown-ups', es: 'Para adultos' },
  welcome: { en: 'Pick a story!', es: '¡Escoge una historia!' },
  tapMap: { en: 'Tap a place on the map', es: 'Toca un lugar en el mapa' },
  sound: { en: 'Sound', es: 'Sonido' },
  worlds: { en: 'Choose a world', es: 'Escoge un mundo' },
  askGrownup: { en: 'Time to ask a grown-up!', es: '¡Hora de llamar a un adulto!' },
  // Voice-guided prayers (js/prayers.js).
  prayers: { en: 'Voice-Guided Prayers', es: 'Oraciones guiadas' },
  prayTogether: { en: "Let's pray together!", es: '¡Vamos a orar juntos!' },
  yourTurn: { en: 'Your turn!', es: '¡Ahora ustedes!' },
  sayNames: { en: 'Say their names!', es: '¡Digan sus nombres!' },
  amen: { en: 'Amen!', es: '¡Amén!' },
  prayAgain: { en: 'Pray again', es: 'Orar otra vez' },
  pause: { en: 'Pause', es: 'Pausa' },
  resume: { en: 'Keep going', es: 'Seguir' },
};

export const COUNT = {
  en: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
  es: ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'],
};

export const PRAISE = [
  { en: 'Great job!', es: '¡Muy bien!' },
  { en: 'Wonderful!', es: '¡Maravilloso!' },
  { en: 'You did it!', es: '¡Lo lograste!' },
  { en: 'Amazing!', es: '¡Increíble!' },
  { en: 'Yay!', es: '¡Bravo!' },
];

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const cap = (w) => w[0].toUpperCase() + w.slice(1);
export const countWord = (n) => ({ en: `${cap(COUNT.en[n - 1])}!`, es: `¡${cap(COUNT.es[n - 1])}!` });
