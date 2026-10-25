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
  sound: { en: 'Sound', es: 'Sonido' },
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
