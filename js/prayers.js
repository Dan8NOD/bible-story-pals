// Voice-guided prayers a family says together. The voice reads a line, then waits
// while everyone says it back ("echo" steps). Guide steps are spoken only.
// Every line is { en, es, he }. The family stands with open hands: nobody folds them.
// Scenes use the same [art, x, y, scale, opts, anim] items as story pages.
// In the App Store build the first two are free and the third is a one-time
// purchase at the same price as one story (see unlocks.js).

const PARENT = { robe: '#7986cb', sash: '#ffd54f', hair: '#4e342e', beard: '#4e342e' };
const MAMA = { scarf: '#ab47bc', robe: '#ce93d8' };
const BIG_KID = { robe: '#ffb74d', hair: '#3e2723' };
const LITTLE = { robe: '#81c784', hair: '#5d4037' };

// The family praying side by side, centred on x.
const family = (x = 500, y = 440, s = 1, anim = '') => [
  ['person', x - 235, y - 10, 1.45 * s, PARENT, anim],
  ['person', x - 80, y - 10, 1.4 * s, MAMA, anim],
  ['person', x + 75, y + 25, 1.1 * s, BIG_KID, anim],
  ['person', x + 210, y + 40, 0.92 * s, LITTLE, anim],
];
// A soft warm glow around the family: Hashem's care, not magic.
const warmth = (x = 500, y = 420, s = 3.2) => ['glow', x, y, s, {}, 'pulse'];
const hearts = (y = 140) => [['heart', 300, y, 0.45, {}, 'bob'], ['heart', 500, y - 30, 0.55, {}, 'pulse'], ['heart', 700, y, 0.45, {}, 'bob']];
const sparkles = [['sparkle', 220, 150, 0.8, {}, 'twinkle'], ['sparkle', 780, 130, 0.9, {}, 'twinkle'], ['sparkle', 500, 90, 0.7, {}, 'twinkle']];
const stars = [['star', 140, 110, 0.35, {}, 'twinkle'], ['star', 330, 70, 0.28, {}, 'twinkle'], ['star', 640, 90, 0.3, {}, 'twinkle'], ['star', 880, 160, 0.32, {}, 'twinkle']];

const DEAR_HASHEM = { en: 'Dear Hashem,', es: 'Querido Hashem,', he: 'השם הטוב,' };
const AMEN = { en: 'Amen!', es: '¡Amén!', he: 'אמן!' };

export const PRAYERS = [
  {
    id: 'thanks',
    color: '#ffe082',
    title: { en: 'Thank You, Hashem', es: 'Gracias, Hashem', he: 'תודה, השם' },
    ref: { en: 'Psalm 100:4', es: 'Salmo 100:4', he: 'תהילים ק, ד' },
    cover: 2,
    steps: [
      { text: { en: "Let's say thank you to Hashem together. Say each line after me.", es: 'Vamos a darle gracias a Hashem juntos. Repitan después de mí.', he: 'בואו נאמר תודה להשם ביחד. חזרו אחריי על כל שורה.' },
        scene: { bg: 'day', items: [['sun', 840, 110, 0.9], ['cloud', 200, 120, 0.9, {}, 'drift'], warmth(), ...family()] } },
      { echo: true, text: DEAR_HASHEM,
        scene: { bg: 'day', items: [['heavenLight', 500, 0, 1, { h: 420 }], warmth(), ...family()] } },
      { echo: true, text: { en: 'Thank you for the sun and the flowers.', es: 'Gracias por el sol y las flores.', he: 'תודה על השמש ועל הפרחים.' },
        scene: { bg: 'day', items: [['sun', 500, 120, 1.2, {}, 'pulse'], ['flower', 160, 520, 1.2, {}, 'sway'], ['flower', 300, 545, 1, { color: '#ffb300' }, 'sway'], ['flower', 700, 545, 1, { color: '#ab47bc' }, 'sway'], ['flower', 850, 520, 1.2, {}, 'sway'], ['bird', 760, 230, 0.6, {}, 'drift'], ...family(500, 440, 0.85)] } },
      { echo: true, text: { en: 'Thank you for my family.', es: 'Gracias por mi familia.', he: 'תודה על המשפחה שלי.' },
        scene: { bg: 'day', items: [warmth(500, 420, 3.6), ...hearts(), ...family(500, 450, 1, 'hop')] } },
      { echo: true, text: { en: 'Thank you for my food.', es: 'Gracias por mi comida.', he: 'תודה על האוכל שלי.' },
        scene: { bg: 'day', items: [['bread', 380, 520, 1.1, {}, 'bob'], ['fish', 620, 525, 0.9, {}, 'bob'], ['cup', 500, 515, 0.8, {}, 'pulse'], ...family(500, 400, 0.85)] } },
      { echo: true, text: { en: 'Thank you for loving me.', es: 'Gracias por amarme.', he: 'תודה שאתה אוהב אותי.' },
        scene: { bg: 'day', items: [['heavenLight', 500, 0, 1, { h: 420 }], ['heart', 500, 170, 1.1, {}, 'pulse'], warmth(500, 420, 3.8), ...family()] } },
      { echo: true, text: AMEN,
        scene: { bg: 'day', items: [['rainbow', 500, 330, 1.6], ...sparkles, ...family(500, 440, 1, 'hop').map((p) => { p[4] = { ...p[4], arms: 'up' }; return p; })] } },
    ],
    closing: { en: 'Hashem loves to hear you say thank you!', es: '¡A Hashem le encanta oírte dar gracias!', he: 'השם אוהב לשמוע אתכם אומרים תודה!' },
  },
  {
    id: 'bedtime',
    color: '#9fa8da',
    title: { en: 'Goodnight, Hashem', es: 'Buenas noches, Hashem', he: 'לילה טוב, השם' },
    // The Hebrew Bible counts a psalm's heading as its first verse, so this is 4:9 (4:8 in church Bibles).
    ref: { en: 'Psalm 4:9', es: 'Salmo 4:9', he: 'תהילים ד, ט' },
    cover: 4,
    steps: [
      { text: { en: "It's time to rest. Let's pray together before we sleep. Say each line after me.", es: 'Es hora de descansar. Vamos a rezar juntos antes de dormir. Repitan después de mí.', he: 'הגיע הזמן לנוח. בואו נתפלל יחד לפני השינה. חזרו אחריי על כל שורה.' },
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['lantern', 500, 300, 1, {}, 'sway'], warmth(500, 430, 3), ...family()] } },
      { echo: true, text: DEAR_HASHEM,
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['heavenLight', 500, 0, 1, { h: 420 }], warmth(), ...family()] } },
      { echo: true, text: { en: 'Thank you for today.', es: 'Gracias por este día.', he: 'תודה על היום הזה.' },
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['sun', 180, 140, 0.55, {}, 'pulse'], ['heart', 500, 170, 0.6, {}, 'pulse'], ...family()] } },
      { echo: true, text: { en: 'Please stay with us tonight.', es: 'Por favor, acompáñanos esta noche.', he: 'בבקשה, שמור עלינו הלילה.' },
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['glow', 500, 420, 4.2, { color: '#ffb300', strength: 2 }, 'pulse'], ...family()] } },
      { echo: true, text: { en: 'Help us sleep in peace.', es: 'Ayúdanos a dormir en paz.', he: 'עזור לנו לישון בשלום.' },
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['glow', 500, 470, 3.4, { color: '#ffb300', strength: 2 }, 'pulse'], ['blanket', 500, 500, 2.6], ['lying', 420, 470, 0.8, { robe: '#ffb74d', hair: '#3e2723' }, 'bob'], ['lying', 580, 480, 0.7, { robe: '#81c784', hair: '#5d4037' }, 'bob'], ['sheep', 820, 480, 0.6, {}, 'bob']] } },
      { echo: true, text: { en: 'I love you, Hashem.', es: 'Te amo, Hashem.', he: 'אנחנו אוהבים אותך, השם.' },
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['heart', 500, 200, 1.1, {}, 'pulse'], warmth(500, 430, 3.4), ...family()] } },
      { echo: true, text: AMEN,
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['star', 260, 200, 0.5, {}, 'pulse'], ['star', 500, 150, 0.6, {}, 'pulse'], ['star', 740, 220, 0.5, {}, 'pulse'], ['glow', 500, 470, 3.4, { color: '#ffb300', strength: 2 }, 'pulse'], ['blanket', 500, 500, 2.6], ['lying', 420, 470, 0.8, { robe: '#ffb74d', hair: '#3e2723' }, ''], ['lying', 580, 480, 0.7, { robe: '#81c784', hair: '#5d4037' }, '']] } },
    ],
    closing: { en: 'Goodnight! Hashem is with you while you sleep.', es: '¡Buenas noches! Hashem está contigo mientras duermes.', he: 'לילה טוב! השם איתכם גם כשאתם ישנים.' },
  },
  {
    id: 'blessing',
    color: '#f8bbd0',
    title: { en: 'Hashem Bless the People I Love', es: 'Hashem bendiga a quienes amo', he: 'ברכה לאהובים שלנו' },
    ref: { en: 'Numbers 6:24', es: 'Números 6:24', he: 'במדבר ו, כד' },
    cover: 2,
    steps: [
      { text: { en: "Let's ask Hashem to bless the people we love. Hold hands, and say each line after me.", es: 'Vamos a pedirle a Hashem que bendiga a las personas que amamos. Tómense de las manos y repitan después de mí.', he: 'בואו נבקש מהשם לברך את האנשים שאנחנו אוהבים. תנו ידיים וחזרו אחריי על כל שורה.' },
        scene: { bg: 'day', items: [['tree', 140, 430, 2], ['tree', 870, 440, 1.8], warmth(500, 420, 3.6), ...family(500, 440, 1).map((p) => { p[4] = { ...p[4], arms: 'hold' }; return p; })] } },
      { echo: true, text: DEAR_HASHEM,
        scene: { bg: 'day', items: [['heavenLight', 500, 0, 1, { h: 420 }], warmth(), ...family()] } },
      { echo: true, text: { en: 'Please bless my family.', es: 'Por favor, bendice a mi familia.', he: 'בבקשה, ברך את המשפחה שלי.' },
        scene: { bg: 'day', items: [['heavenLight', 500, 0, 1, { h: 420 }], warmth(500, 420, 4), ...hearts(130), ...family(500, 450, 1, 'hop')] } },
      { echo: true, text: { en: 'Bless my friends and my teachers.', es: 'Bendice a mis amigos y a mis maestros.', he: 'ברך את החברים שלי ואת המורים שלי.' },
        scene: { bg: 'day', items: [['person', 150, 420, 1, { robe: '#4db6ac', hair: '#212121', arms: 'up' }, 'hop'], ['person', 300, 425, 0.9, { robe: '#ef9a9a', hair: '#6d4c41', arms: 'up' }, 'hop'], ['person', 700, 410, 1.2, { robe: '#a1887f', scarf: '#ffcc80', arms: 'up' }, ''], ['person', 860, 425, 0.9, { robe: '#90caf9', hair: '#3e2723', arms: 'up' }, 'hop'], ['heart', 500, 200, 0.8, {}, 'pulse'], ...sparkles] } },
      { text: { en: 'Now, say the names of people you love.', es: 'Ahora, digan los nombres de las personas que aman.', he: 'עכשיו, אמרו את השמות של האנשים שאתם אוהבים.' }, names: true,
        scene: { bg: 'day', items: [warmth(500, 420, 3.6), ['heart', 180, 170, 0.5, {}, 'bob'], ['heart', 340, 110, 0.4, { color: '#ec407a' }, 'pulse'], ['heart', 500, 150, 0.6, {}, 'bob'], ['heart', 660, 110, 0.4, { color: '#ec407a' }, 'pulse'], ['heart', 820, 170, 0.5, {}, 'bob'], ...family(500, 450)] } },
      { echo: true, text: { en: 'Help them feel your love.', es: 'Que sientan tu amor.', he: 'עזור להם להרגיש את האהבה שלך.' },
        scene: { bg: 'day', items: [['heavenLight', 500, 0, 1, { h: 420 }], ['cup', 500, 210, 1, {}, 'pulse'], warmth(500, 420, 4), ...family()] } },
      { echo: true, text: AMEN,
        scene: { bg: 'day', items: [['rainbow', 500, 330, 1.6], ...sparkles, ...hearts(150), ...family(500, 440, 1, 'hop').map((p) => { p[4] = { ...p[4], arms: 'up' }; return p; })] } },
    ],
    closing: { en: 'Hashem loves your family so much!', es: '¡Hashem ama muchísimo a tu familia!', he: 'השם אוהב מאוד את המשפחה שלכם!' },
  },
];

export const FREE_PRAYERS = ['thanks', 'bedtime'];
export const prayerById = (id) => PRAYERS.find((p) => p.id === id);
