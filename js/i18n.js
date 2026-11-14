// UI words. Every entry is { en, es, he }. Story text lives in stories.js.
// Hebrew speaks to "you" in the plural, so no line has to guess whether a child is a boy or a girl.

export const UI = {
  appName: { en: 'Torah Story Pals', es: 'Amiguitos de la Torá', he: 'חברים לסיפורי התורה' },
  play: { en: "Let's play!", es: '¡A jugar!', he: 'בואו נשחק!' },
  tryAgain: { en: 'Try again!', es: '¡Intenta otra vez!', he: 'נסו שוב!' },
  youEarned: { en: 'You earned a star!', es: '¡Ganaste una estrella!', he: 'זכיתם בכוכב!' },
  home: { en: 'Home', es: 'Inicio', he: 'בית' },
  next: { en: 'Next', es: 'Siguiente', he: 'הבא' },
  back: { en: 'Back', es: 'Atrás', he: 'חזרה' },
  listen: { en: 'Listen again', es: 'Escuchar otra vez', he: 'להקשיב שוב' },
  again: { en: 'Play again', es: 'Jugar otra vez', he: 'לשחק שוב' },
  nextStory: { en: 'Next story', es: 'Siguiente historia', he: 'הסיפור הבא' },
  parents: { en: 'For grown-ups', es: 'Para adultos', he: 'למבוגרים' },
  welcome: { en: 'Pick a story!', es: '¡Escoge una historia!', he: 'בחרו סיפור!' },
  tapMap: { en: 'Tap a place on the map', es: 'Toca un lugar en el mapa', he: 'לחצו על מקום במפה' },
  sound: { en: 'Sound', es: 'Sonido', he: 'קול' },
  worlds: { en: 'Choose a world', es: 'Escoge un mundo', he: 'בחרו עולם' },
  language: { en: 'Language', es: 'Idioma', he: 'שפה' },
  askGrownup: { en: 'Time to ask a grown-up!', es: '¡Hora de llamar a un adulto!', he: 'זה הזמן לקרוא למבוגר!' },
  // Voice-guided prayers (js/prayers.js).
  prayers: { en: 'Voice-Guided Prayers', es: 'Oraciones guiadas', he: 'תפילות מודרכות' },
  prayTogether: { en: "Let's pray together!", es: '¡Vamos a rezar juntos!', he: 'בואו נתפלל יחד!' },
  yourTurn: { en: 'Your turn!', es: '¡Ahora ustedes!', he: 'עכשיו אתם!' },
  sayNames: { en: 'Say their names!', es: '¡Digan sus nombres!', he: 'אמרו את השמות שלהם!' },
  amen: { en: 'Amen!', es: '¡Amén!', he: 'אָמֵן!' },
  prayAgain: { en: 'Pray again', es: 'Rezar otra vez', he: 'להתפלל שוב' },
  pause: { en: 'Pause', es: 'Pausa', he: 'השהיה' },
  resume: { en: 'Keep going', es: 'Seguir', he: 'להמשיך' },
};

// What each language calls itself on its chip.
export const LANG_NAMES = { en: 'English', es: 'Español', he: 'עברית' };

export const COUNT = {
  en: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
  es: ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'],
  he: ['אחת', 'שתיים', 'שלוש', 'ארבע', 'חמש', 'שש', 'שבע', 'שמונה', 'תשע', 'עשר'],
};

export const PRAISE = [
  { en: 'Great job!', es: '¡Muy bien!', he: 'כל הכבוד!' },
  { en: 'Wonderful!', es: '¡Maravilloso!', he: 'נפלא!' },
  { en: 'You did it!', es: '¡Lo lograste!', he: 'הצלחתם!' },
  { en: 'Amazing!', es: '¡Increíble!', he: 'מדהים!' },
  { en: 'Yay!', es: '¡Bravo!', he: 'יש!' },
];

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const cap = (w) => w[0].toUpperCase() + w.slice(1);
export const countWord = (n) => ({ en: `${cap(COUNT.en[n - 1])}!`, es: `¡${cap(COUNT.es[n - 1])}!`, he: `${COUNT.he[n - 1]}!` });
