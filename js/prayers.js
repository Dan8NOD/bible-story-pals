// Voice-guided prayers a family says together. The voice reads a line, then waits
// while everyone says it back ("echo" steps). Guide steps are spoken only.
// Scenes use the same [art, x, y, scale, opts, anim] items as story pages.
// In the App Store build the first two are free and the third is a one-time
// purchase at the same price as one story (see unlocks.js).

const PARENT = { robe: '#7986cb', sash: '#ffd54f', hair: '#4e342e', beard: '#4e342e', arms: 'pray' };
const MAMA = { scarf: '#ab47bc', robe: '#ce93d8', arms: 'pray' };
const BIG_KID = { robe: '#ffb74d', hair: '#3e2723', arms: 'pray' };
const LITTLE = { robe: '#81c784', hair: '#5d4037', arms: 'pray' };

// The family praying side by side, centred on x.
const family = (x = 500, y = 440, s = 1, anim = '') => [
  ['person', x - 235, y - 10, 1.45 * s, PARENT, anim],
  ['person', x - 80, y - 10, 1.4 * s, MAMA, anim],
  ['person', x + 75, y + 25, 1.1 * s, BIG_KID, anim],
  ['person', x + 210, y + 40, 0.92 * s, LITTLE, anim],
];
// A soft warm glow around the family: God's care, not magic.
const warmth = (x = 500, y = 420, s = 3.2) => ['glow', x, y, s, {}, 'pulse'];
const hearts = (y = 140) => [['heart', 300, y, 0.45, {}, 'bob'], ['heart', 500, y - 30, 0.55, {}, 'pulse'], ['heart', 700, y, 0.45, {}, 'bob']];
const sparkles = [['sparkle', 220, 150, 0.8, {}, 'twinkle'], ['sparkle', 780, 130, 0.9, {}, 'twinkle'], ['sparkle', 500, 90, 0.7, {}, 'twinkle']];
const stars = [['star', 140, 110, 0.35, {}, 'twinkle'], ['star', 330, 70, 0.28, {}, 'twinkle'], ['star', 640, 90, 0.3, {}, 'twinkle'], ['star', 880, 160, 0.32, {}, 'twinkle']];

const DEAR_GOD = { en: 'Dear God,', es: 'Querido Dios,' };
const AMEN = { en: 'Amen!', es: '¡Amén!' };

export const PRAYERS = [
  {
    id: 'thanks',
    color: '#ffe082',
    title: { en: 'Thank You, God', es: 'Gracias, Dios' },
    ref: 'Psalm 100:4 · Salmo 100:4',
    cover: 2,
    steps: [
      { text: { en: "Let's say thank you to God together. Fold your hands, and say each line after me.", es: 'Vamos a darle gracias a Dios juntos. Junten sus manos y repitan después de mí.' },
        scene: { bg: 'day', items: [['sun', 840, 110, 0.9], ['cloud', 200, 120, 0.9, {}, 'drift'], warmth(), ...family()] } },
      { echo: true, text: DEAR_GOD,
        scene: { bg: 'day', items: [['heavenLight', 500, 0, 1, { h: 420 }], warmth(), ...family()] } },
      { echo: true, text: { en: 'Thank you for the sun and the flowers.', es: 'Gracias por el sol y las flores.' },
        scene: { bg: 'day', items: [['sun', 500, 120, 1.2, {}, 'pulse'], ['flower', 160, 520, 1.2, {}, 'sway'], ['flower', 300, 545, 1, { color: '#ffb300' }, 'sway'], ['flower', 700, 545, 1, { color: '#ab47bc' }, 'sway'], ['flower', 850, 520, 1.2, {}, 'sway'], ['bird', 760, 230, 0.6, {}, 'drift'], ...family(500, 440, 0.85)] } },
      { echo: true, text: { en: 'Thank you for my family.', es: 'Gracias por mi familia.' },
        scene: { bg: 'day', items: [warmth(500, 420, 3.6), ...hearts(), ...family(500, 450, 1, 'hop')] } },
      { echo: true, text: { en: 'Thank you for my food.', es: 'Gracias por mi comida.' },
        scene: { bg: 'day', items: [['bread', 380, 520, 1.1, {}, 'bob'], ['fish', 620, 525, 0.9, {}, 'bob'], ['cup', 500, 515, 0.8, {}, 'pulse'], ...family(500, 400, 0.85)] } },
      { echo: true, text: { en: 'Thank you for loving me.', es: 'Gracias por amarme.' },
        scene: { bg: 'day', items: [['heavenLight', 500, 0, 1, { h: 420 }], ['heart', 500, 170, 1.1, {}, 'pulse'], warmth(500, 420, 3.8), ...family()] } },
      { echo: true, text: AMEN,
        scene: { bg: 'day', items: [['rainbow', 500, 330, 1.6], ...sparkles, ...family(500, 440, 1, 'hop').map((p) => { p[4] = { ...p[4], arms: 'up' }; return p; })] } },
    ],
    closing: { en: 'God loves to hear you say thank you!', es: '¡A Dios le encanta oírte dar gracias!' },
  },
  {
    id: 'bedtime',
    color: '#9fa8da',
    title: { en: 'Goodnight, God', es: 'Buenas noches, Dios' },
    ref: 'Psalm 4:8 · Salmo 4:8',
    cover: 4,
    steps: [
      { text: { en: "It's time to rest. Let's pray together before we sleep. Say each line after me.", es: 'Es hora de descansar. Vamos a orar juntos antes de dormir. Repitan después de mí.' },
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['lantern', 500, 300, 1, {}, 'sway'], warmth(500, 430, 3), ...family()] } },
      { echo: true, text: DEAR_GOD,
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['heavenLight', 500, 0, 1, { h: 420 }], warmth(), ...family()] } },
      { echo: true, text: { en: 'Thank you for today.', es: 'Gracias por este día.' },
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['sun', 180, 140, 0.55, {}, 'pulse'], ['heart', 500, 170, 0.6, {}, 'pulse'], ...family()] } },
      { echo: true, text: { en: 'Please stay with us tonight.', es: 'Por favor, acompáñanos esta noche.' },
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['glow', 500, 420, 4.2, { color: '#ffb300', strength: 2 }, 'pulse'], ...family()] } },
      { echo: true, text: { en: 'Help us sleep in peace.', es: 'Ayúdanos a dormir en paz.' },
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['glow', 500, 470, 3.4, { color: '#ffb300', strength: 2 }, 'pulse'], ['blanket', 500, 500, 2.6], ['lying', 420, 470, 0.8, { robe: '#ffb74d', hair: '#3e2723' }, 'bob'], ['lying', 580, 480, 0.7, { robe: '#81c784', hair: '#5d4037' }, 'bob'], ['sheep', 820, 480, 0.6, {}, 'bob']] } },
      { echo: true, text: { en: 'I love you, God.', es: 'Te amo, Dios.' },
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['heart', 500, 200, 1.1, {}, 'pulse'], warmth(500, 430, 3.4), ...family()] } },
      { echo: true, text: AMEN,
        scene: { bg: 'night', items: [['moon', 820, 120, 0.9], ...stars, ['star', 260, 200, 0.5, {}, 'pulse'], ['star', 500, 150, 0.6, {}, 'pulse'], ['star', 740, 220, 0.5, {}, 'pulse'], ['glow', 500, 470, 3.4, { color: '#ffb300', strength: 2 }, 'pulse'], ['blanket', 500, 500, 2.6], ['lying', 420, 470, 0.8, { robe: '#ffb74d', hair: '#3e2723' }, ''], ['lying', 580, 480, 0.7, { robe: '#81c784', hair: '#5d4037' }, '']] } },
    ],
    closing: { en: 'Goodnight! God is with you while you sleep.', es: '¡Buenas noches! Dios está contigo mientras duermes.' },
  },
  {
    id: 'blessing',
    color: '#f8bbd0',
    title: { en: 'God Bless the People I Love', es: 'Dios bendiga a quienes amo' },
    ref: 'Numbers 6:24 · Números 6:24',
    cover: 2,
    steps: [
      { text: { en: "Let's ask God to bless the people we love. Hold hands, and say each line after me.", es: 'Vamos a pedirle a Dios que bendiga a las personas que amamos. Tómense de las manos y repitan después de mí.' },
        scene: { bg: 'day', items: [['tree', 140, 430, 2], ['tree', 870, 440, 1.8], warmth(500, 420, 3.6), ...family(500, 440, 1).map((p) => { p[4] = { ...p[4], arms: 'hold' }; return p; })] } },
      { echo: true, text: DEAR_GOD,
        scene: { bg: 'day', items: [['heavenLight', 500, 0, 1, { h: 420 }], warmth(), ...family()] } },
      { echo: true, text: { en: 'Please bless my family.', es: 'Por favor, bendice a mi familia.' },
        scene: { bg: 'day', items: [['heavenLight', 500, 0, 1, { h: 420 }], warmth(500, 420, 4), ...hearts(130), ...family(500, 450, 1, 'hop')] } },
      { echo: true, text: { en: 'Bless my friends and my teachers.', es: 'Bendice a mis amigos y a mis maestros.' },
        scene: { bg: 'day', items: [['person', 150, 420, 1, { robe: '#4db6ac', hair: '#212121', arms: 'up' }, 'hop'], ['person', 300, 425, 0.9, { robe: '#ef9a9a', hair: '#6d4c41', arms: 'up' }, 'hop'], ['person', 700, 410, 1.2, { robe: '#a1887f', scarf: '#ffcc80', arms: 'up' }, ''], ['person', 860, 425, 0.9, { robe: '#90caf9', hair: '#3e2723', arms: 'up' }, 'hop'], ['heart', 500, 200, 0.8, {}, 'pulse'], ...sparkles] } },
      { text: { en: 'Now, say the names of people you love.', es: 'Ahora, digan los nombres de las personas que aman.' }, names: true,
        scene: { bg: 'day', items: [warmth(500, 420, 3.6), ['heart', 180, 170, 0.5, {}, 'bob'], ['heart', 340, 110, 0.4, { color: '#ec407a' }, 'pulse'], ['heart', 500, 150, 0.6, {}, 'bob'], ['heart', 660, 110, 0.4, { color: '#ec407a' }, 'pulse'], ['heart', 820, 170, 0.5, {}, 'bob'], ...family(500, 450)] } },
      { echo: true, text: { en: 'Help them feel your love.', es: 'Que sientan tu amor.' },
        scene: { bg: 'day', items: [['heavenLight', 500, 0, 1, { h: 420 }], ['cup', 500, 210, 1, {}, 'pulse'], warmth(500, 420, 4), ...family()] } },
      { echo: true, text: AMEN,
        scene: { bg: 'day', items: [['rainbow', 500, 330, 1.6], ...sparkles, ...hearts(150), ...family(500, 440, 1, 'hop').map((p) => { p[4] = { ...p[4], arms: 'up' }; return p; })] } },
    ],
    closing: { en: 'God loves your family so much!', es: '¡Dios ama muchísimo a tu familia!' },
  },
];

export const FREE_PRAYERS = ['thanks', 'bedtime'];
export const prayerById = (id) => PRAYERS.find((p) => p.id === id);
