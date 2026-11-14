// Story data. Scene items are [art, x, y, scale, opts, anim] on a 1000x600 stage.
// Text is short and simple on purpose: it is read aloud to children who can't read yet.
// Every line is { en, es, he }. Hebrew speaks to "you" in the plural (see i18n.js). It has no vowel
// points, except on a word a voice could read two ways (עֵלִי is Eli, not "on me"; הַמָּן is the manna, not Haman).

import { COAT_COLORS } from './art.js';

const NOAH = { beard: '#eeeeee', hair: '#eeeeee', robe: '#8d6e63', sash: '#ffcc80' };
const DAVID = { robe: '#81c784', hair: '#8d4f2a', sash: '#a1744a' };
const GOLIATH = { helmet: true, robe: '#90a4ae', beard: '#5d4037', mood: 'grumpy', sash: '#795548' };
const JONAH = { robe: '#8d6e63', beard: '#5d4037', hair: '#5d4037', sash: '#ffb74d' };
const DANIEL = { robe: '#7986cb', sash: '#ffd54f', hair: '#3e2723', beard: '#3e2723' };
const MOM = { scarf: '#ab47bc', robe: '#ce93d8' };
const PRINCESS = { crown: true, robe: '#f8bbd0', hair: '#212121', sash: '#ffd54f' };
const KID = (robe, hair = '#3e2723') => ({ robe, hair });
const SHEPHERD = { robe: '#4db6ac', sash: '#ffcc80', hair: '#6d4c41', beard: '#6d4c41', staff: true };

const ABRAHAM = { robe: '#5c6bc0', sash: '#ffd54f', hair: '#cfd8dc', beard: '#cfd8dc', staff: true };
const SARAH = { scarf: '#fff3e0', robe: '#e57373' };
const JACOB = { robe: '#6d8f6b', sash: '#ffcc80', hair: '#eeeeee', beard: '#eeeeee', staff: true };
const JOSEPH = { robe: '#fff3e0', hair: '#3e2723', stripes: COAT_COLORS };
const JOSEPH_FAR = { robe: '#d7ccc8', hair: '#3e2723' };
const JOSEPH_GROWN = { robe: '#ffffff', sash: '#26a69a', hair: '#3e2723' };
const BROTHER = (robe) => ({ robe, hair: '#4e342e', beard: '#4e342e' });
const PHARAOH = { crown: true, robe: '#26a69a', sash: '#ffd54f', hair: '#212121', beard: '#212121' };
// Moses grown up, and his sister Miriam in the same colors she wears beside the river.
const MOSES = { robe: '#b0413e', sash: '#ffe082', hair: '#5d4037', beard: '#5d4037', staff: true };
const MIRIAM = { scarf: '#ef9a9a', robe: '#ffcc80' };
const GRANDPA = { robe: '#a1887f', hair: '#eeeeee', beard: '#eeeeee' };
const AUNT = { scarf: '#ce93d8', robe: '#f8bbd0' };
const UNCLE = { robe: '#64b5f6', hair: '#4e342e', beard: '#4e342e' };
const ELI = { robe: '#ffffff', sash: '#5c6bc0', hair: '#eeeeee', beard: '#eeeeee' };
const SAMUEL = KID('#4fc3f7', '#5d4037');
const ELIJAH = { robe: '#a1744a', sash: '#4e342e', hair: '#3e2723', beard: '#3e2723', staff: true };
const RAVEN = { color: '#455a64', bread: true };
const NAOMI = { scarf: '#b39ddb', robe: '#9575cd' };
const RUTH = { scarf: '#ffcc80', robe: '#ff8a65' };
const BOAZ = { robe: '#558b2f', sash: '#ffd54f', hair: '#4e342e', beard: '#4e342e' };
const ESTHER = { crown: true, scarf: '#f8bbd0', robe: '#7e57c2', sash: '#ffd54f' };
const KING = { crown: true, robe: '#c62828', beard: '#6d4c41', hair: '#6d4c41', sash: '#ffd54f' };
const MORDECAI = { robe: '#455a64', sash: '#90caf9', hair: '#5d4037', beard: '#5d4037' };
const PALACE = { color: '#f3e5ab' };

const NIGHT_HALF = { svg: '<rect x="500" y="-3000" width="3500" height="3452" fill="#1d2b5c"/>' };
const rainCloud = { rain: true, color: '#cfd8dc' };

// Every seek game says the same thing when a hiding place is empty.
const NOT_HERE = { en: 'Not here! Keep looking!', es: '¡Aquí no! ¡Sigue buscando!', he: 'לא כאן! המשיכו לחפש!' };
const SEEK_SPOTS = [[270, 375], [510, 355], [750, 375], [310, 510], [550, 520], [800, 510]];

const ALL = [
  {
    id: 'creation',
    color: '#ffd54f',
    title: { en: 'Hashem Made the World', es: 'Hashem Creó el Mundo', he: 'השם ברא את העולם' },
    lesson: { en: 'Hashem made everything, and He made you too!', es: '¡Hashem hizo todo, y también te hizo a ti!', he: 'השם ברא את הכול, וגם אתכם!' },
    cover: 2,
    pages: [
      {
        text: { en: "In the beginning, it was dark. Hashem said, 'Let there be light!' And there was light.", es: "Al principio, todo estaba oscuro. Hashem dijo: '¡Que haya luz!' Y hubo luz.", he: 'בהתחלה היה חושך. השם אמר: "יהי אור!" ויהי אור.' },
        scene: { bg: 'dark', items: [['sparkle', 500, 270, 3, {}, 'pulse'], ['sparkle', 220, 140, 0.8, {}, 'twinkle'], ['sparkle', 790, 180, 1, {}, 'twinkle'], ['sparkle', 300, 450, 0.6, {}, 'twinkle'], ['sparkle', 740, 470, 0.7, {}, 'twinkle']] },
      },
      {
        text: { en: 'Hashem made the blue sky, the land, and green trees.', es: 'Hashem hizo el cielo azul, la tierra y los árboles verdes.', he: 'השם ברא את השמיים הכחולים, את האדמה ואת העצים הירוקים.' },
        scene: { bg: 'day', items: [['cloud', 260, 120, 1.2, {}, 'drift'], ['cloud', 760, 90, 0.9, {}, 'drift'], ['tree', 180, 390, 1.6, { fruit: true }, 'sway'], ['tree', 820, 400, 1.3, {}, 'sway'], ['flower', 380, 440, 1, {}, 'sway'], ['flower', 620, 450, 1, { color: '#ba68c8' }, 'sway'], ['grass', 500, 470, 1.4]] },
      },
      {
        text: { en: 'Hashem made the sun for the day, and the moon and stars for the night.', es: 'Hashem hizo el sol para el día, y la luna y las estrellas para la noche.', he: 'השם ברא את השמש ליום, ואת הירח והכוכבים ללילה.' },
        scene: { bg: 'day', items: [['raw', 0, 0, 1, NIGHT_HALF], ['sun', 260, 210, 1.8, {}, 'bob'], ['moon', 760, 220, 1.6, {}, 'bob'], ['star', 620, 110, 0.4, {}, 'twinkle'], ['star', 900, 110, 0.5, {}, 'twinkle'], ['star', 880, 380, 0.35, {}, 'twinkle'], ['star', 600, 380, 0.3, {}, 'twinkle']] },
      },
      {
        text: { en: 'Hashem made fish to swim, birds to fly, and animals of every kind.', es: 'Hashem hizo peces que nadan, aves que vuelan y animales de todo tipo.', he: 'השם ברא דגים ששוחים, ציפורים שעפות וחיות מכל הסוגים.' },
        scene: { bg: 'beach', items: [['fish', 110, 410, 0.8, {}, 'drift'], ['fish', 230, 450, 0.7, { color: '#ffd54f' }, 'drift'], ['bird', 330, 130, 0.9, { color: '#f06292' }, 'bob'], ['bird', 620, 170, 0.7, {}, 'bob'], ['elephant', 560, 420, 1.2, {}, 'bob'], ['giraffe', 790, 380, 1.5, {}, 'sway'], ['bunny', 420, 470, 0.7, {}, 'hop'], ['lion', 930, 450, 0.8, {}, 'bob']] },
      },
      {
        text: { en: "Then Hashem made people. Hashem looked at everything and said, 'It is very good!'", es: "Luego Hashem hizo a las personas. Hashem miró todo y dijo: '¡Es muy bueno!'", he: 'ואז השם ברא את האדם. השם הביט בכול ואמר: "טוב מאוד!"' },
        scene: { bg: 'day', items: [['sun', 860, 110, 1, {}, ''], ['tree', 150, 390, 1.6, { fruit: true }, 'sway'], ['person', 420, 390, 1.6, { robe: '#81c784', hair: '#5d4037', arms: 'up' }, 'bob'], ['person', 580, 390, 1.6, { robe: '#ffb74d', hair: '#3e2723', skin: '#c68e5e', arms: 'up' }, 'bob'], ['heart', 500, 160, 1, {}, 'pulse'], ['bunny', 760, 460, 0.6, {}, 'hop']] },
      },
      {
        text: { en: 'On the seventh day, Hashem rested. That special day is Shabbat!', es: 'El séptimo día, Hashem descansó. ¡Ese día especial es Shabat!', he: 'ביום השביעי השם נָח. היום המיוחד הזה הוא שבת!' },
        scene: { bg: 'night', items: [['star', 240, 110, 0.35, {}, 'twinkle'], ['star', 770, 100, 0.4, {}, 'twinkle'], ['glow', 500, 440, 3.6, { color: '#ffb300', strength: 2 }, 'pulse'], ['person', 190, 410, 1.3, { robe: '#81c784', hair: '#5d4037' }, ''], ['person', 810, 410, 1.3, { robe: '#ffb74d', hair: '#3e2723', skin: '#c68e5e' }, ''], ['candles', 500, 420, 1.5], ['challah', 345, 480, 1.1], ['cup', 655, 462, 0.9, { wine: true }]] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'reveal',
      bg: 'day',
      prompt: { en: 'Tap the sparkles to help make the world!', es: '¡Toca las chispitas para crear el mundo!', he: 'לחצו על הנצנוצים וגלו את העולם!' },
      decor: [['grass', 500, 470, 1.4], ['grass', 250, 500, 1]],
      items: [
        { art: 'sun', x: 140, y: 120, s: 1.1, anim: 'bob', word: { en: 'Sun', es: 'Sol', he: 'שמש' } },
        { art: 'cloud', x: 420, y: 110, s: 1, anim: 'drift', word: { en: 'Cloud', es: 'Nube', he: 'ענן' } },
        { art: 'bird', x: 720, y: 140, s: 0.9, opts: { color: '#f06292' }, anim: 'bob', word: { en: 'Bird', es: 'Pájaro', he: 'ציפור' } },
        { art: 'tree', x: 160, y: 380, s: 1.5, opts: { fruit: true }, anim: 'sway', word: { en: 'Tree', es: 'Árbol', he: 'עץ' } },
        { art: 'flower', x: 330, y: 450, s: 1, anim: 'sway', word: { en: 'Flower', es: 'Flor', he: 'פרח' } },
        { art: 'lion', x: 540, y: 410, s: 1.1, anim: 'bob', word: { en: 'Lion', es: 'León', he: 'אריה' } },
        { art: 'bunny', x: 720, y: 440, s: 0.9, anim: 'hop', word: { en: 'Bunny', es: 'Conejo', he: 'ארנב' } },
        { art: 'elephant', x: 890, y: 410, s: 1.1, anim: 'bob', word: { en: 'Elephant', es: 'Elefante', he: 'פיל' } },
      ],
    },
  },
  {
    id: 'noah',
    color: '#81d4fa',
    title: { en: "Noah's Big Boat", es: 'El Gran Barco de Noé', he: 'התיבה הגדולה של נֹחַ' },
    lesson: { en: 'Hashem keeps His promises.', es: 'Hashem cumple sus promesas.', he: 'השם מקיים את ההבטחות שלו.' },
    cover: 4,
    pages: [
      {
        text: { en: "Hashem told Noah, 'Build a big boat called an ark.'", es: "Hashem le dijo a Noé: 'Construye un barco grande llamado arca.'", he: 'השם אמר לְנֹחַ: "בְּנֵה סירה גדולה שנקראת תיבה."' },
        scene: { bg: 'day', items: [['cloud', 660, 150, 1.6, {}, ''], ['sparkle', 660, 140, 1.3, {}, 'pulse'], ['person', 360, 390, 1.6, { ...NOAH, arms: 'up' }, 'bob'], ['tree', 140, 400, 1.2, {}, 'sway'], ['sheep', 860, 450, 0.7, {}, 'hop']] },
      },
      {
        text: { en: 'Noah worked and worked. Bang, bang, bang!', es: 'Noé trabajó y trabajó. ¡Pum, pum, pum!', he: 'נֹחַ עבד ועבד. טוק, טוק, טוק!' },
        scene: { bg: 'day', items: [['ark', 680, 380, 1.7], ['person', 260, 390, 1.6, NOAH, 'hop'], ['hammer', 310, 420, 0.8, {}, 'wiggle'], ['sun', 120, 100, 0.9, {}, '']] },
      },
      {
        text: { en: 'The animals came two by two!', es: '¡Los animales llegaron de dos en dos!', he: 'החיות באו שניים שניים!' },
        scene: { bg: 'day', items: [['ark', 780, 350, 1.6], ['giraffe', 120, 360, 1.1, {}, 'sway'], ['giraffe', 210, 360, 1.1, {}, 'sway'], ['elephant', 360, 380, 0.9, {}, 'bob'], ['elephant', 470, 380, 0.9, {}, 'bob'], ['lion', 150, 480, 0.8, {}, 'hop'], ['lion', 250, 480, 0.8, {}, 'hop'], ['sheep', 400, 490, 0.8, {}, 'hop'], ['sheep', 500, 490, 0.8, {}, 'hop'], ['person', 620, 430, 1.1, { ...NOAH, arms: 'up' }, '']] },
      },
      {
        text: { en: 'It rained and rained! But everyone was safe inside the ark.', es: '¡Llovió y llovió! Pero todos estaban a salvo dentro del arca.', he: 'ירד גשם, ועוד גשם! אבל כולם היו מוגנים בתוך התיבה.' },
        scene: { bg: 'storm', items: [['ark', 500, 330, 2, {}, 'rock'], ['cloud', 240, 90, 1.4, rainCloud, 'drift'], ['cloud', 720, 80, 1.6, rainCloud, 'drift'], ['waves', 300, 420, 1, { color: '#5aa8e6', w: 700 }, 'drift'], ['waves', 700, 470, 1, { color: '#5aa8e6', w: 700 }, 'drift']] },
      },
      {
        text: { en: 'Then Hashem put a rainbow in the sky. It is His promise!', es: 'Luego Hashem puso un arcoíris en el cielo. ¡Es su promesa!', he: 'ואז השם נתן קשת בענן. זאת ההבטחה שלו!' },
        scene: { bg: 'day', items: [['rainbow', 500, 330, 4.2], ['ark', 560, 400, 1.5], ['bird', 280, 170, 0.9, { color: '#ffffff', branch: true }, 'bob'], ['person', 200, 390, 1.4, { ...NOAH, arms: 'up' }, 'hop'], ['sun', 880, 100, 0.9, {}, '']] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'fly',
      bg: 'day',
      prompt: { en: 'Tap the animals to help them into the ark!', es: '¡Toca los animales para ayudarlos a subir al arca!', he: 'לחצו על החיות ועזרו להן להיכנס לתיבה!' },
      decor: [['sun', 90, 80, 0.7, {}, ''], ['cloud', 460, 80, 0.8, {}, 'drift']],
      target: ['ark', 780, 330, 1.7],
      targetPoint: [780, 300],
      items: [
        { art: 'lion', x: 90, y: 300, s: 0.75, anim: 'hop' },
        { art: 'lion', x: 210, y: 300, s: 0.75, anim: 'hop' },
        { art: 'elephant', x: 360, y: 300, s: 0.8, anim: 'bob' },
        { art: 'elephant', x: 490, y: 300, s: 0.8, anim: 'bob' },
        { art: 'giraffe', x: 90, y: 470, s: 0.9, anim: 'sway' },
        { art: 'giraffe', x: 210, y: 470, s: 0.9, anim: 'sway' },
        { art: 'sheep', x: 360, y: 480, s: 0.8, anim: 'hop' },
        { art: 'sheep', x: 490, y: 480, s: 0.8, anim: 'hop' },
      ],
    },
  },
  {
    id: 'abraham',
    color: '#9fa8da',
    title: { en: 'Abraham Counts the Stars', es: 'Abraham Cuenta las Estrellas', he: 'אברהם סופר כוכבים' },
    lesson: { en: 'We can trust Hashem.', es: 'Podemos confiar en Hashem.', he: 'אפשר לסמוך על השם.' },
    cover: 3,
    pages: [
      {
        text: { en: 'Abraham and Sarah lived in a tent. They loved Hashem.', es: 'Abraham y Sara vivían en una tienda de campaña. Ellos amaban a Hashem.', he: 'אברהם ושרה גרו באוהל. הם אהבו את השם.' },
        scene: { bg: 'desert', items: [['sun', 120, 100, 0.9, {}, ''], ['tent', 700, 370, 2.2], ['palm', 930, 380, 1.4, {}, 'sway'], ['person', 290, 400, 1.5, ABRAHAM, ''], ['person', 440, 405, 1.4, SARAH, ''], ['sheep', 140, 465, 0.7, {}, 'hop']] },
      },
      {
        text: { en: "Hashem said, 'Go to a new land. I will show you the way.'", es: "Hashem dijo: 'Ve a una tierra nueva. Yo te mostraré el camino.'", he: 'השם אמר: "לֶךְ לְךָ אל ארץ חדשה. אני אראה לְךָ את הדרך."' },
        scene: { bg: 'desert', items: [['heavenLight', 520, 0, 1, { h: 430 }], ['tent', 170, 390, 1.6], ['person', 520, 400, 1.6, { ...ABRAHAM, staff: false, arms: 'up' }, 'bob'], ['sheep', 820, 465, 0.7, {}, 'hop']] },
      },
      {
        text: { en: 'So they packed up and walked a long, long way.', es: 'Así que empacaron y caminaron muy, muy lejos.', he: 'אז הם ארזו הכול והלכו דרך ארוכה, ארוכה מאוד.' },
        scene: { bg: 'desert', items: [['sun', 860, 100, 0.9, {}, ''], ['sheep', 150, 465, 0.65, {}, 'hop'], ['person', 320, 400, 1.4, ABRAHAM, 'bob'], ['person', 460, 405, 1.3, SARAH, 'bob'], ['donkey', 690, 415, 1.2, {}, 'bob']] },
      },
      {
        text: { en: "One night Hashem said, 'Look up! Count the stars, if you can.'", es: "Una noche Hashem dijo: '¡Mira hacia arriba! Cuenta las estrellas, si puedes.'", he: 'לילה אחד השם אמר: "הבט השמיימה! ספור את הכוכבים, אם תוכל."' },
        scene: { bg: 'night', items: [['tent', 190, 420, 1.8], ['star', 330, 120, 0.4, {}, 'twinkle'], ['star', 470, 70, 0.3, {}, 'twinkle'], ['star', 640, 130, 0.45, {}, 'twinkle'], ['star', 790, 80, 0.35, {}, 'twinkle'], ['star', 900, 200, 0.4, {}, 'twinkle'], ['star', 730, 240, 0.28, {}, 'twinkle'], ['person', 540, 410, 1.6, { ...ABRAHAM, staff: false, arms: 'up' }, '']] },
      },
      {
        text: { en: "'Your family will be as many as the stars!' And Hashem kept His promise.", es: "'¡Tu familia será tan numerosa como las estrellas!' Y Hashem cumplió su promesa.", he: '"המשפחה שֶׁלְּךָ תהיה גדולה כמו כוכבי השמיים!" והשם קיים את ההבטחה שלו.' },
        scene: { bg: 'night', items: [['star', 200, 120, 0.4, {}, 'twinkle'], ['star', 350, 70, 0.3, {}, 'twinkle'], ['star', 680, 80, 0.35, {}, 'twinkle'], ['star', 840, 150, 0.45, {}, 'twinkle'], ['heavenLight', 500, 0, 1, { h: 440 }], ['person', 420, 410, 1.5, { ...ABRAHAM, staff: false, arms: 'up' }, 'hop'], ['person', 580, 415, 1.4, { ...SARAH, arms: 'hold' }, ''], ['baby', 590, 425, 0.8, {}, 'bob'], ['heart', 500, 200, 0.7, {}, 'pulse']] },
      },
    ],
    game: {
      type: 'prompt',
      bg: 'night',
      keep: true,
      connect: true,
      decor: [['tent', 180, 490, 1.5], ['person', 500, 490, 1.2, { ...ABRAHAM, staff: false, arms: 'up' }, '']],
      items: [
        { key: '4', art: 'star', x: 720, y: 230, s: 1, opts: { label: 4, color: '#fff59d' }, anim: 'pulse' },
        { key: '1', art: 'star', x: 140, y: 130, s: 1, opts: { label: 1, color: '#fff59d' }, anim: 'pulse' },
        { key: '5', art: 'star', x: 880, y: 110, s: 1, opts: { label: 5, color: '#fff59d' }, anim: 'pulse' },
        { key: '2', art: 'star', x: 340, y: 240, s: 1, opts: { label: 2, color: '#fff59d' }, anim: 'pulse' },
        { key: '3', art: 'star', x: 530, y: 100, s: 1, opts: { label: 3, color: '#fff59d' }, anim: 'pulse' },
      ],
      rounds: [
        { key: '1', say: { en: 'Tap star number one!', es: '¡Toca la estrella número uno!', he: 'לחצו על כוכב מספר אחת!' } },
        { key: '2', say: { en: 'Tap star number two!', es: '¡Toca la estrella número dos!', he: 'לחצו על כוכב מספר שתיים!' } },
        { key: '3', say: { en: 'Tap star number three!', es: '¡Toca la estrella número tres!', he: 'לחצו על כוכב מספר שלוש!' } },
        { key: '4', say: { en: 'Tap star number four!', es: '¡Toca la estrella número cuatro!', he: 'לחצו על כוכב מספר ארבע!' } },
        { key: '5', say: { en: 'Tap star number five!', es: '¡Toca la estrella número cinco!', he: 'לחצו על כוכב מספר חמש!' } },
      ],
    },
  },
  {
    id: 'joseph',
    color: '#ffcc80',
    title: { en: "Joseph's Colorful Coat", es: 'La Túnica de Colores de José', he: 'כתונת הפסים של יוסף' },
    lesson: { en: 'Hashem is with us, and we can forgive.', es: 'Hashem está con nosotros, y podemos perdonar.', he: 'השם איתנו, ואנחנו יכולים לסלוח.' },
    cover: 0,
    pages: [
      {
        text: { en: 'Jacob loved his son Joseph. He gave him a coat with many colors.', es: 'Jacob amaba a su hijo José. Le regaló una túnica de muchos colores.', he: 'יעקב אהב את בנו יוסף. הוא נתן לו כתונת פסים צבעונית.' },
        scene: { bg: 'day', items: [['sun', 880, 100, 0.9, {}, ''], ['tent', 160, 390, 1.8], ['person', 410, 395, 1.6, JACOB, ''], ['person', 600, 400, 1.5, { ...JOSEPH, arms: 'up' }, 'hop'], ['heart', 505, 190, 0.7, {}, 'pulse'], ['sheep', 820, 455, 0.8, {}, 'hop']] },
      },
      {
        text: { en: "Joseph's brothers were jealous. They were not kind to him.", es: 'Los hermanos de José sintieron celos. No fueron buenos con él.', he: 'האחים של יוסף קינאו בו. הם לא היו נחמדים אליו.' },
        scene: { bg: 'day', items: [['cloud', 300, 110, 1.1, { color: '#cfd8dc' }, 'drift'], ['person', 180, 400, 1.4, { ...BROTHER('#90a4ae'), mood: 'grumpy' }, ''], ['person', 320, 405, 1.4, { ...BROTHER('#a1887f'), mood: 'grumpy' }, ''], ['person', 460, 400, 1.4, { ...BROTHER('#81a1c1'), mood: 'grumpy' }, ''], ['person', 760, 400, 1.5, { ...JOSEPH, mood: 'sad' }, '']] },
      },
      {
        text: { en: 'Joseph was taken far away to Egypt. But Hashem was with him.', es: 'A José se lo llevaron lejos, a Egipto. Pero Hashem estaba con él.', he: 'יוסף נלקח רחוק, למצרים. אבל השם היה איתו.' },
        scene: { bg: 'desert', items: [['sun', 880, 90, 0.9, {}, ''], ['pyramid', 760, 380, 2.8], ['pyramid', 560, 420, 1.6], ['palm', 140, 380, 1.5, {}, 'sway'], ['glow', 350, 400, 2.2, {}, 'pulse'], ['person', 350, 400, 1.5, JOSEPH_FAR, '']] },
      },
      {
        text: { en: 'Joseph helped the king save food, so everyone had enough to eat.', es: 'José ayudó al rey a guardar comida, y así todos tuvieron qué comer.', he: 'יוסף עזר למלך לשמור אוכל, וכך לכולם היה מה לאכול.' },
        scene: { bg: 'desert', items: [['pyramid', 870, 390, 2], ['person', 250, 400, 1.5, PHARAOH, ''], ['person', 420, 400, 1.5, { ...JOSEPH_GROWN, arms: 'up' }, 'bob'], ['wheat', 580, 420, 1.2, {}, 'sway'], ['wheat', 680, 430, 1.1, {}, 'sway'], ['bag', 600, 500, 0.9], ['bag', 710, 505, 0.8], ['bread', 500, 520, 0.8]] },
      },
      {
        text: { en: 'His brothers came, and Joseph forgave them. They were a family again!', es: 'Sus hermanos llegaron, y José los perdonó. ¡Volvieron a ser una familia!', he: 'האחים שלו הגיעו, ויוסף סלח להם. הם חזרו להיות משפחה!' },
        scene: { bg: 'day', items: [['sun', 110, 100, 0.8, {}, ''], ['person', 180, 410, 1.3, { ...BROTHER('#a1887f'), arms: 'up' }, 'hop'], ['person', 320, 405, 1.4, { ...BROTHER('#90a4ae'), arms: 'up' }, 'hop'], ['person', 500, 395, 1.6, { ...JOSEPH_GROWN, arms: 'up' }, 'hop'], ['person', 680, 405, 1.4, { ...BROTHER('#81a1c1'), arms: 'up' }, 'hop'], ['person', 830, 400, 1.5, { ...JACOB, staff: false, arms: 'up' }, ''], ['heart', 410, 190, 0.7, {}, 'pulse'], ['heart', 600, 180, 0.8, {}, 'pulse']] },
      },
    ],
    game: {
      type: 'memory',
      bg: 'desert',
      prompt: { en: 'Find the matching pairs!', es: '¡Encuentra las parejas!', he: 'מצאו את הזוגות!' },
      pairs: [
        { key: 'red', art: 'coat', opts: { color: '#ef5350' }, s: 1.2, say: { en: 'A red coat!', es: '¡Una túnica roja!', he: 'כתונת אדומה!' } },
        { key: 'blue', art: 'coat', opts: { color: '#42a5f5' }, s: 1.2, say: { en: 'A blue coat!', es: '¡Una túnica azul!', he: 'כתונת כחולה!' } },
        { key: 'yellow', art: 'coat', opts: { color: '#ffee58' }, s: 1.2, say: { en: 'A yellow coat!', es: '¡Una túnica amarilla!', he: 'כתונת צהובה!' } },
      ],
    },
  },
  {
    id: 'moses',
    color: '#a5d6a7',
    title: { en: 'Baby Moses', es: 'El Bebé Moisés', he: 'משה התינוק' },
    lesson: { en: 'Hashem takes care of us.', es: 'Hashem nos cuida.', he: 'השם שומר עלינו.' },
    cover: 1,
    pages: [
      {
        text: { en: 'A mommy loved her baby boy very much. She wanted to keep him safe.', es: 'Una mamá amaba mucho a su bebé. Ella quería protegerlo.', he: 'אימא אחת אהבה מאוד את התינוק שלה. היא רצתה לשמור עליו.' },
        scene: { bg: 'day', items: [['palm', 150, 380, 1.6, {}, 'sway'], ['palm', 860, 390, 1.4, {}, 'sway'], ['person', 500, 390, 1.6, { ...MOM, arms: 'hold' }, ''], ['baby', 510, 395, 0.9, {}, 'bob'], ['heart', 500, 150, 0.8, {}, 'pulse']] },
      },
      {
        text: { en: 'She made a little basket boat and put him in the river.', es: 'Ella hizo una canastita que flota y lo puso en el río.', he: 'היא הכינה לו תיבה קטנה, כמו סירה, והניחה אותה על הנהר.' },
        scene: { bg: 'river', items: [['person', 140, 315, 1.2, { ...MOM, arms: 'up' }, ''], ['reeds', 260, 420, 1.4, {}, 'sway'], ['reeds', 820, 410, 1.3, {}, 'sway'], ['basketBoat', 520, 455, 1.3, {}, 'bob'], ['sun', 860, 100, 0.9, {}, '']] },
      },
      {
        text: { en: 'His big sister Miriam watched the basket float.', es: 'Su hermana mayor, Miriam, vigilaba la canasta.', he: 'אחותו הגדולה מרים שמרה על התיבה מרחוק.' },
        scene: { bg: 'river', items: [['person', 170, 330, 1, { scarf: '#ef9a9a', robe: '#ffcc80' }, 'bob'], ['reeds', 250, 410, 1.4, {}, 'sway'], ['basketBoat', 620, 460, 1.2, {}, 'bob'], ['reeds', 860, 410, 1.2, {}, 'sway'], ['bird', 560, 140, 0.6, {}, 'drift']] },
      },
      {
        text: { en: 'A princess found the baby. She named him Moses!', es: 'Una princesa encontró al bebé. ¡Lo llamó Moisés!', he: 'נסיכה מצאה את התינוק. היא קראה לו משה!' },
        scene: { bg: 'river', items: [['palm', 870, 330, 1.6, {}, 'sway'], ['person', 620, 310, 1.3, { ...PRINCESS, arms: 'up' }, 'bob'], ['basketBoat', 440, 460, 1.2, {}, 'bob'], ['heart', 530, 140, 0.8, {}, 'pulse'], ['reeds', 200, 420, 1.3, {}, 'sway']] },
      },
    ],
    game: {
      type: 'steer',
      goal: 5,
      prompt: { en: 'Help the basket float down the river! Catch five flowers.', es: '¡Ayuda a la canasta a flotar por el río! Atrapa cinco flores.', he: 'עזרו לתיבה לשוט בנהר! תפסו חמישה פרחים.' },
    },
  },
  {
    id: 'redsea',
    color: '#4fc3f7',
    title: { en: 'Crossing the Sea', es: 'El Cruce del Mar', he: 'קריעת ים סוף' },
    lesson: { en: 'Hashem makes a way for us.', es: 'Hashem nos abre camino.', he: 'השם פותח לנו דרך.' },
    cover: 3,
    pages: [
      {
        text: { en: 'In Egypt, the people had to work hard all day. They wanted to be free.', es: 'En Egipto, el pueblo tenía que trabajar muy duro todo el día. Querían ser libres.', he: 'במצרים, העם עבד קשה כל היום. הם רצו להיות חופשיים.' },
        scene: { bg: 'desert', items: [['sun', 120, 100, 1, {}, ''], ['pyramid', 790, 380, 2.8], ['person', 240, 410, 1.4, { robe: '#a1887f', hair: '#4e342e', arms: 'hold', mood: 'sad' }, ''], ['bag', 240, 436, 0.6], ['person', 420, 415, 1.3, { robe: '#90a4ae', scarf: '#cfd8dc', arms: 'hold', mood: 'sad' }, ''], ['bag', 420, 438, 0.55]] },
      },
      {
        text: { en: "Hashem told Moses, 'Lead My people out of Egypt.'", es: "Hashem le dijo a Moisés: 'Saca a mi pueblo de Egipto.'", he: 'השם אמר למשה: "הוֹצֵא את העם שלי ממצרים."' },
        scene: { bg: 'desert', items: [['heavenLight', 500, 0, 1, { h: 430 }], ['bush', 790, 450, 1.1, { color: '#558b2f' }], ['sparkle', 790, 410, 1.5, { color: '#ffb74d' }, 'pulse'], ['person', 500, 400, 1.6, { ...MOSES, staff: false, arms: 'up' }, ''], ['sheep', 200, 465, 0.8, {}, 'hop']] },
      },
      {
        text: { en: 'They came to a big sea. There was no way to cross!', es: 'Llegaron a un mar muy grande. ¡No había por dónde cruzar!', he: 'הם הגיעו לים גדול. לא הייתה דרך לעבור!' },
        scene: { bg: 'beach', items: [['waves', 190, 395, 1, { color: '#bfe3fb', w: 340 }, 'drift'], ['person', 470, 385, 1.4, MOSES, ''], ['person', 630, 400, 1.2, { ...MIRIAM, mood: 'open' }, ''], ['person', 760, 405, 1.1, { ...KID('#81c784'), mood: 'open', arms: 'up' }, 'hop'], ['person', 880, 405, 1.1, { ...UNCLE, mood: 'open', arms: 'up' }, 'hop']] },
      },
      {
        text: { en: 'Moses lifted his staff, and Hashem opened a path through the sea!', es: '¡Moisés levantó su vara, y Hashem abrió un camino en medio del mar!', he: 'משה הֵרִים את המטה, והשם פתח דרך בתוך הים!' },
        scene: { bg: 'split', items: [['fish', 150, 330, 0.7, {}, 'bob'], ['fish', 860, 310, 0.6, { color: '#ffd54f' }, 'bob'], ['sparkle', 500, 170, 1.2, {}, 'pulse'], ['person', 500, 400, 1.6, { ...MOSES, arms: 'up' }, '']] },
      },
      {
        text: { en: 'Everyone walked across on dry land. Miriam and all the people sang and danced!', es: 'Todos cruzaron por tierra seca. ¡Miriam y todo el pueblo cantaron y bailaron!', he: 'כולם עברו ביבשה. מרים וכל העם שרו ורקדו!' },
        scene: { bg: 'beach', items: [['sun', 880, 100, 0.9, {}, ''], ['note', 300, 230, 0.6, {}, 'bob'], ['note', 470, 200, 0.5, { color: '#ec407a' }, 'bob'], ['person', 390, 390, 1.5, { ...MIRIAM, arms: 'up' }, 'hop'], ['tambourine', 342, 330, 0.55, {}, 'wiggle'], ['person', 560, 395, 1.4, { ...MOSES, staff: false, arms: 'up' }, 'hop'], ['person', 710, 405, 1.1, { ...KID('#81c784'), arms: 'up' }, 'hop'], ['person', 840, 405, 1.2, { ...UNCLE, arms: 'up' }, 'hop'], ['heart', 640, 210, 0.7, {}, 'pulse']] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'fly',
      bg: 'split',
      prompt: { en: 'Tap the people to help them cross the sea!', es: '¡Toca a las personas para ayudarlas a cruzar el mar!', he: 'לחצו על האנשים ועזרו להם לחצות את הים!' },
      target: ['person', 500, 290, 0.9, { ...MOSES, arms: 'up' }],
      targetPoint: [500, 320],
      items: [
        { art: 'person', x: 190, y: 525, s: 0.9, opts: MIRIAM, anim: 'hop' },
        { art: 'person', x: 340, y: 445, s: 0.85, opts: KID('#81c784'), anim: 'hop' },
        { art: 'person', x: 500, y: 520, s: 0.9, opts: UNCLE, anim: 'hop' },
        { art: 'person', x: 660, y: 445, s: 0.85, opts: AUNT, anim: 'hop' },
        { art: 'person', x: 810, y: 525, s: 0.9, opts: GRANDPA, anim: 'hop' },
        { art: 'person', x: 500, y: 410, s: 0.7, opts: KID('#ffb74d'), anim: 'hop' },
      ],
    },
  },
  {
    id: 'manna',
    color: '#ffe0b2',
    title: { en: 'Bread from Heaven', es: 'Pan del Cielo', he: 'לחם מן השמיים' },
    lesson: { en: 'Hashem gives us what we need.', es: 'Hashem nos da lo que necesitamos.', he: 'השם נותן לנו את מה שאנחנו צריכים.' },
    cover: 2,
    pages: [
      {
        text: { en: 'The people walked in the desert. Soon their tummies were hungry.', es: 'El pueblo caminaba por el desierto. Pronto tuvieron mucha hambre.', he: 'העם הלך במדבר. מהר מאוד כולם היו רעבים.' },
        scene: { bg: 'desert', items: [['sun', 880, 100, 1, {}, ''], ['tent', 170, 400, 1.6], ['person', 410, 405, 1.4, MOSES, ''], ['person', 580, 410, 1.2, { ...MIRIAM, mood: 'sad' }, ''], ['person', 710, 420, 1, { ...KID('#81c784'), mood: 'sad' }, ''], ['person', 820, 425, 0.9, { ...KID('#ffb74d'), mood: 'sad' }, '']] },
      },
      {
        text: { en: "Hashem said, 'I will send you bread from heaven.'", es: "Hashem dijo: 'Les enviaré pan del cielo.'", he: 'השם אמר: "אני אוריד לכם לחם מן השמיים."' },
        scene: { bg: 'desert', items: [['heavenLight', 500, 0, 1, { h: 430 }], ['tent', 150, 400, 1.5], ['tent', 860, 410, 1.3], ['person', 500, 400, 1.6, { ...MOSES, staff: false, arms: 'up' }, '']] },
      },
      {
        text: { en: 'In the morning, manna covered the ground! It tasted sweet, like honey.', es: '¡Por la mañana, el maná cubría el suelo! Sabía dulce, como la miel.', he: 'בבוקר, הַמָּן כיסה את האדמה! היה לו טעם מתוק, כמו דבש.' },
        scene: { bg: 'desert', items: [['sun', 130, 110, 1, {}, 'bob'], ['tent', 860, 390, 1.7], ['person', 400, 385, 1.3, { ...KID('#81c784'), arms: 'up' }, 'hop'], ['person', 570, 385, 1.4, { ...MIRIAM, arms: 'up' }, 'hop'], ['manna', 190, 490, 1], ['manna', 330, 530, 0.9], ['manna', 480, 500, 1], ['manna', 630, 535, 0.9], ['manna', 750, 495, 0.8]] },
      },
      {
        text: { en: 'Every day they gathered just enough. On Friday they gathered extra for Shabbat!', es: 'Cada día recogían justo lo necesario. ¡El viernes recogían más para Shabat!', he: 'בכל יום הם אספו בדיוק מה שצריך. ביום שישי הם אספו מנה כפולה לְשַׁבָּת!' },
        scene: { bg: 'desert', items: [['tent', 170, 395, 1.7], ['person', 420, 390, 1.4, { ...MIRIAM, arms: 'up' }, ''], ['person', 570, 400, 1.2, { ...KID('#ffb74d'), arms: 'up' }, 'hop'], ['basket', 700, 480, 1.1, { full: true }], ['basket', 840, 490, 1.1, { full: true }], ['sparkle', 770, 380, 0.8, {}, 'twinkle']] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'transform',
      bg: 'desert',
      prompt: { en: 'Tap each basket to fill it with manna!', es: '¡Toca cada canasta para llenarla de maná!', he: 'לחצו על כל סל ומלאו אותו בְּמָן!' },
      decor: [['sun', 880, 90, 0.8, {}, ''], ['tent', 500, 370, 1.3]],
      items: [
        { art: 'basket', x: 150, y: 410, s: 1.1, after: { full: true }, anim: 'bob' },
        { art: 'basket', x: 380, y: 400, s: 1.1, after: { full: true }, anim: 'bob' },
        { art: 'basket', x: 620, y: 400, s: 1.1, after: { full: true }, anim: 'bob' },
        { art: 'basket', x: 850, y: 410, s: 1.1, after: { full: true }, anim: 'bob' },
        { art: 'basket', x: 265, y: 530, s: 1.1, after: { full: true }, anim: 'bob' },
        { art: 'basket', x: 735, y: 530, s: 1.1, after: { full: true }, anim: 'bob' },
      ],
    },
  },
  {
    id: 'samuel',
    color: '#b3e5fc',
    title: { en: 'Samuel Hears a Voice', es: 'Samuel Escucha una Voz', he: 'שמואל שומע קול' },
    lesson: { en: 'We can listen, just like Samuel.', es: 'Podemos escuchar, igual que Samuel.', he: 'גם אנחנו יכולים להקשיב, כמו שמואל.' },
    cover: 4,
    pages: [
      {
        text: { en: 'Samuel was a boy who helped Eli in the house of Hashem.', es: 'Samuel era un niño que ayudaba a Elí en la casa de Hashem.', he: 'שמואל היה ילד שעזר לְעֵלִי במשכן השם.' },
        scene: { bg: 'day', items: [['sun', 120, 100, 0.9, {}, ''], ['tent', 720, 370, 2.4, { color: '#f3e5ab', trim: '#7e57c2', door: '#5c6bc0' }], ['person', 300, 395, 1.6, ELI, ''], ['person', 450, 420, 1.1, { ...SAMUEL, arms: 'up' }, 'hop'], ['lantern', 545, 455, 0.8, {}, 'sway']] },
      },
      {
        text: { en: "One night, Samuel heard a voice call, 'Samuel! Samuel!'", es: "Una noche, Samuel oyó una voz que llamaba: '¡Samuel! ¡Samuel!'", he: 'לילה אחד, שמואל שמע קול קורא: "שמואל! שמואל!"' },
        scene: { bg: 'night', items: [['moon', 850, 110, 0.8], ['star', 190, 120, 0.35, {}, 'twinkle'], ['sparkle', 610, 200, 1.4, {}, 'pulse'], ['blanket', 420, 505, 2.2], ['lying', 420, 478, 0.9, { ...SAMUEL, mood: 'open' }, ''], ['lantern', 650, 460, 1, {}, 'sway']] },
      },
      {
        text: { en: "He ran to Eli. 'Here I am!' But Eli said, 'I did not call you.'", es: "Corrió hacia Elí. '¡Aquí estoy!' Pero Elí dijo: 'Yo no te llamé.'", he: 'הוא רץ אל עֵלִי. "הנני!" אבל עֵלִי אמר: "לא קראתי לְךָ."' },
        scene: { bg: 'night', items: [['moon', 850, 110, 0.8], ['person', 380, 425, 1.2, { ...SAMUEL, arms: 'up' }, 'hop'], ['lantern', 500, 465, 0.9, {}, 'sway'], ['person', 640, 405, 1.6, { ...ELI, mood: 'sleep' }, '']] },
      },
      {
        text: { en: "Then Eli understood. 'It is Hashem who is calling you!'", es: "Entonces Elí comprendió. '¡Es Hashem quien te llama!'", he: 'אז עֵלִי הבין. "זה השם שקורא לְךָ!"' },
        scene: { bg: 'night', items: [['moon', 850, 110, 0.8], ['sparkle', 500, 180, 1.2, {}, 'pulse'], ['person', 400, 425, 1.2, SAMUEL, ''], ['person', 620, 405, 1.6, { ...ELI, arms: 'up' }, '']] },
      },
      {
        text: { en: "The voice called again. Samuel said, 'Speak, Hashem. I am listening!'", es: "La voz llamó otra vez. Samuel dijo: 'Habla, Hashem. ¡Te escucho!'", he: 'הקול קרא שוב. שמואל אמר: "דַּבֵּר, השם, אני מקשיב!"' },
        scene: { bg: 'night', items: [['moon', 870, 110, 0.7], ['heavenLight', 500, 0, 1, { h: 440 }], ['glow', 500, 425, 2.4, { color: '#ffb300', strength: 2 }, 'pulse'], ['blanket', 240, 520, 1.6], ['person', 500, 415, 1.4, { ...SAMUEL, arms: 'up' }, ''], ['lantern', 760, 465, 0.9, {}, 'sway']] },
      },
    ],
    game: {
      type: 'prompt',
      bg: 'night',
      keep: true,
      shuffleRounds: true,
      decor: [['person', 500, 480, 1.2, { ...SAMUEL, arms: 'up' }, '']],
      items: [
        { key: 'moon', art: 'moon', x: 150, y: 150, s: 1, anim: 'bob' },
        { key: 'star', art: 'star', x: 420, y: 130, s: 1, opts: { color: '#fff59d' }, anim: 'pulse' },
        { key: 'lamp', art: 'lantern', x: 720, y: 190, s: 1.7, anim: 'sway' },
        { key: 'sheep', art: 'sheep', x: 220, y: 450, s: 1, anim: 'hop' },
        { key: 'blanket', art: 'blanket', x: 800, y: 470, s: 1.1, anim: 'bob' },
      ],
      rounds: [
        { key: 'moon', say: { en: 'Listen! Tap the moon.', es: '¡Escucha! Toca la luna.', he: 'הקשיבו! לחצו על הירח.' } },
        { key: 'star', say: { en: 'Listen! Tap the star.', es: '¡Escucha! Toca la estrella.', he: 'הקשיבו! לחצו על הכוכב.' } },
        { key: 'lamp', say: { en: 'Listen! Tap the lamp.', es: '¡Escucha! Toca la lámpara.', he: 'הקשיבו! לחצו על המנורה.' } },
        { key: 'sheep', say: { en: 'Listen! Tap the sheep.', es: '¡Escucha! Toca la oveja.', he: 'הקשיבו! לחצו על הכבשה.' } },
        { key: 'blanket', say: { en: 'Listen! Tap the blanket.', es: '¡Escucha! Toca la cobija.', he: 'הקשיבו! לחצו על השמיכה.' } },
      ],
    },
  },
  {
    id: 'david',
    color: '#c5e1a5',
    title: { en: 'David the Brave', es: 'David el Valiente', he: 'דָּוִד האמיץ' },
    lesson: { en: "With Hashem's help, you can be brave too!", es: '¡Con la ayuda de Hashem, tú también puedes ser valiente!', he: 'בעזרת השם, גם אתם יכולים להיות אמיצים!' },
    cover: 1,
    pages: [
      {
        text: { en: 'David was a shepherd boy. He took care of his sheep.', es: 'David era un pastorcito. Él cuidaba a sus ovejas.', he: 'דָּוִד היה רועה צאן צעיר. הוא שמר על הכבשים שלו.' },
        scene: { bg: 'day', items: [['person', 280, 400, 1.3, { ...DAVID, staff: true }, ''], ['sheep', 500, 440, 0.9, {}, 'hop'], ['sheep', 650, 450, 0.8, {}, 'hop'], ['sheep', 800, 440, 0.9, {}, 'hop'], ['sun', 860, 100, 0.9, {}, ''], ['cloud', 400, 100, 0.8, {}, 'drift']] },
      },
      {
        text: { en: 'A giant named Goliath was scaring everyone.', es: 'Un gigante llamado Goliat asustaba a todos.', he: 'ענק בשם גוליית הפחיד את כולם.' },
        scene: { bg: 'desert', items: [['person', 660, 330, 2.6, GOLIATH, 'sway'], ['person', 180, 420, 0.9, { robe: '#e57373', mood: 'open', arms: 'up' }, 'hop'], ['person', 290, 425, 0.9, { robe: '#64b5f6', mood: 'open', arms: 'up' }, 'hop']] },
      },
      {
        text: { en: "But David said, 'Hashem will help me!'", es: "Pero David dijo: '¡Hashem me ayudará!'", he: 'אבל דָּוִד אמר: "השם יעזור לי!"' },
        scene: { bg: 'day', items: [['sparkle', 500, 170, 1.3, {}, 'pulse'], ['person', 500, 400, 1.5, { ...DAVID, arms: 'up' }, 'hop'], ['heart', 330, 220, 0.6, {}, 'pulse'], ['heart', 680, 230, 0.6, {}, 'pulse'], ['sheep', 840, 450, 0.7, {}, 'hop']] },
      },
      {
        text: { en: 'David picked five smooth stones from the stream.', es: 'David tomó cinco piedras lisas del arroyo.', he: 'דָּוִד בחר חמש אבנים חֲלָקוֹת מהנחל.' },
        scene: { bg: 'river', items: [['person', 200, 330, 1.2, DAVID, ''], ['stone', 420, 470, 0.9], ['stone', 540, 455, 0.8, { color: '#cfd8dc' }], ['stone', 650, 480, 0.9], ['stone', 760, 460, 0.8, { color: '#d7ccc8' }], ['stone', 870, 478, 0.9], ['bag', 280, 380, 0.6]] },
      },
      {
        text: { en: 'Plop! The giant fell down. Hashem helped David be brave!', es: '¡Pum! El gigante se cayó. ¡Hashem ayudó a David a ser valiente!', he: 'בום! הענק נפל. השם עזר לְדָוִד להיות אמיץ!' },
        scene: { bg: 'desert', items: [['person', 700, 330, 2.4, { ...GOLIATH, mood: 'sleep' }, 'fall-over'], ['person', 240, 400, 1.4, { ...DAVID, arms: 'up' }, 'hop'], ['star', 760, 200, 0.3, {}, 'twinkle'], ['star', 820, 240, 0.25, {}, 'twinkle']] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'fly',
      bg: 'river',
      prompt: { en: 'Tap five smooth stones for David!', es: '¡Toca cinco piedras lisas para David!', he: 'לחצו על חמש אבנים חֲלָקוֹת בשביל דָּוִד!' },
      decor: [['person', 110, 330, 1.1, DAVID, ''], ['reeds', 930, 410, 1.2, {}, 'sway'], ['sun', 880, 90, 0.8, {}, '']],
      target: ['bag', 230, 545, 1.2],
      targetPoint: [230, 540],
      items: [
        { art: 'stone', x: 380, y: 455, s: 1 },
        { art: 'stone', x: 520, y: 490, s: 1, opts: { color: '#cfd8dc' } },
        { art: 'stone', x: 640, y: 445, s: 1, opts: { color: '#d7ccc8' } },
        { art: 'stone', x: 760, y: 495, s: 1 },
        { art: 'stone', x: 860, y: 450, s: 1, opts: { color: '#cfd8dc' } },
      ],
    },
  },
  {
    id: 'elijah',
    color: '#bcaaa4',
    title: { en: 'Elijah and the Ravens', es: 'Elías y los Cuervos', he: 'אליהו והעורבים' },
    lesson: { en: 'Hashem can send help in surprising ways!', es: '¡Hashem puede enviar ayuda de maneras sorprendentes!', he: 'השם יכול לשלוח עזרה בדרכים מפתיעות!' },
    cover: 3,
    pages: [
      {
        text: { en: 'For a long time, no rain fell. The land was dry.', es: 'Durante mucho tiempo no llovió. La tierra estaba seca.', he: 'במשך הרבה זמן לא ירד גשם. האדמה הייתה יבשה.' },
        scene: { bg: 'desert', items: [['sun', 500, 150, 1.9, {}, 'pulse'], ['rock', 190, 480, 1], ['rock', 820, 490, 0.8, { color: '#bcaaa4' }], ['person', 500, 415, 1.4, { ...ELIJAH, mood: 'sad' }, '']] },
      },
      {
        text: { en: "Hashem told Elijah, 'Go to the little brook. I will take care of you there.'", es: "Hashem le dijo a Elías: 'Ve al arroyo. Allí yo te cuidaré.'", he: 'השם אמר לאליהו: "לֵךְ אל הנחל הקטן. שם אדאג לְךָ."' },
        scene: { bg: 'day', items: [['heavenLight', 480, 0, 1, { h: 430 }], ['tree', 150, 400, 1.4, {}, 'sway'], ['bush', 850, 455, 1, {}], ['person', 480, 400, 1.6, { ...ELIJAH, arms: 'up' }, '']] },
      },
      {
        text: { en: 'Elijah drank cool water from the brook.', es: 'Elías bebió agua fresca del arroyo.', he: 'אליהו שתה מים קרירים מהנחל.' },
        scene: { bg: 'river', items: [['sun', 880, 90, 0.8, {}, ''], ['tree', 720, 300, 1.3, {}, 'sway'], ['person', 320, 325, 1.3, ELIJAH, ''], ['reeds', 150, 420, 1.3, {}, 'sway'], ['reeds', 860, 410, 1.2, {}, 'sway'], ['fish', 560, 470, 0.5, {}, 'drift']] },
      },
      {
        text: { en: 'Every morning and every evening, ravens brought him bread!', es: '¡Cada mañana y cada tarde, los cuervos le traían pan!', he: 'בכל בוקר ובכל ערב, העורבים הביאו לו לחם!' },
        scene: { bg: 'river', items: [['bird', 230, 150, 1, { ...RAVEN, flip: true }, 'bob'], ['bird', 730, 120, 0.9, RAVEN, 'bob'], ['bird', 870, 240, 0.7, RAVEN, 'bob'], ['person', 480, 320, 1.4, { ...ELIJAH, staff: false, arms: 'up' }, 'hop'], ['bread', 610, 375, 0.6], ['reeds', 140, 420, 1.3, {}, 'sway']] },
      },
    ],
    game: {
      type: 'seek',
      bg: 'day',
      finds: 3,
      prompt: { en: 'Where is the raven with the bread? Tap the bushes to look!', es: '¿Dónde está el cuervo con el pan? ¡Toca los arbustos para buscar!', he: 'איפה העורב עם הלחם? לחצו על השיחים וחפשו!' },
      notHere: NOT_HERE,
      found: { en: 'You found the raven!', es: '¡Encontraste el cuervo!', he: 'מצאתם את העורב!' },
      hide: { art: 'bird', opts: RAVEN, s: 0.8 },
      decoys: ['bunny', 'sheep'],
      decor: [['person', 90, 410, 1, ELIJAH, ''], ['sun', 900, 90, 0.8, {}, ''], ['cloud', 500, 90, 0.8, {}, 'drift']],
      spots: SEEK_SPOTS,
    },
  },
  {
    id: 'jonah',
    color: '#80deea',
    title: { en: 'Jonah and the Big Fish', es: 'Jonás y el Gran Pez', he: 'יונה והדג הגדול' },
    lesson: { en: 'Hashem hears us when we pray.', es: 'Hashem nos escucha cuando rezamos.', he: 'השם שומע אותנו כשאנחנו מתפללים.' },
    cover: 2,
    pages: [
      {
        text: { en: 'Hashem asked Jonah to go to the city of Nineveh. But Jonah ran away on a boat.', es: 'Hashem le pidió a Jonás que fuera a la ciudad de Nínive. Pero Jonás huyó en un barco.', he: 'השם ביקש מיונה ללכת לעיר נינוה. אבל יונה ברח באונייה.' },
        scene: { bg: 'sea', items: [['city', 140, 330, 0.9], ['person', 498, 312, 0.8, JONAH, ''], ['boat', 600, 360, 1.6, {}, 'rock'], ['sun', 880, 100, 0.9, {}, ''], ['bird', 380, 140, 0.6, {}, 'drift']] },
      },
      {
        text: { en: 'A big storm came! Splash! Jonah fell into the sea.', es: '¡Vino una gran tormenta! ¡Splash! Jonás cayó al mar.', he: 'באה סערה גדולה! פלופ! יונה נפל לים.' },
        scene: { bg: 'storm', items: [['boat', 420, 350, 1.6, {}, 'rock'], ['cloud', 240, 90, 1.4, rainCloud, 'drift'], ['cloud', 720, 80, 1.5, rainCloud, 'drift'], ['person', 760, 430, 0.9, { ...JONAH, mood: 'open', arms: 'up' }, 'sink'], ['waves', 760, 470, 1, { color: '#81c4f0', w: 300 }, '']] },
      },
      {
        text: { en: 'Gulp! A big fish swallowed Jonah. Inside the fish, Jonah prayed to Hashem.', es: '¡Glup! Un gran pez se tragó a Jonás. Dentro del pez, Jonás le rezó a Hashem.', he: 'גלופ! דג גדול בלע את יונה. בתוך הדג, יונה התפלל אל השם.' },
        scene: { bg: 'under', items: [['bigFish', 500, 300, 2.3, { jonah: true }, 'bob'], ['fish', 130, 480, 0.6, { color: '#ffd54f' }, 'drift'], ['fish', 870, 140, 0.5, {}, 'drift'], ['bubble', 860, 420, 0.25, { color: '#e1f5fe' }, 'bob'], ['bubble', 900, 360, 0.15, { color: '#e1f5fe' }, 'bob']] },
      },
      {
        text: { en: 'After three days, the fish put Jonah on the beach. This time, Jonah obeyed Hashem!', es: 'Después de tres días, el pez dejó a Jonás en la playa. ¡Esta vez, Jonás obedeció a Hashem!', he: 'אחרי שלושה ימים, הדג הוציא את יונה אל החוף. הפעם יונה שמע בקול השם!' },
        scene: { bg: 'beach', items: [['bigFish', 180, 380, 1.1, {}, 'bob'], ['person', 600, 370, 1.4, { ...JONAH, arms: 'up' }, 'hop'], ['palm', 870, 350, 1.5, {}, 'sway'], ['sun', 760, 100, 0.9, {}, '']] },
      },
    ],
    game: {
      type: 'prompt',
      bg: 'under',
      decor: [['fish', 120, 520, 0.6, { color: '#ffd54f' }, 'drift'], ['fish', 880, 530, 0.6, {}, 'drift'], ['bigFish', 500, 540, 0.7, {}, 'bob']],
      shuffleRounds: true,
      items: [
        { key: 'red', art: 'bubble', x: 150, y: 170, s: 1.2, opts: { color: '#ef5350' }, anim: 'bob' },
        { key: 'blue', art: 'bubble', x: 400, y: 120, s: 1.2, opts: { color: '#42a5f5' }, anim: 'bob' },
        { key: 'green', art: 'bubble', x: 650, y: 170, s: 1.2, opts: { color: '#66bb6a' }, anim: 'bob' },
        { key: 'yellow', art: 'bubble', x: 870, y: 130, s: 1.2, opts: { color: '#ffee58' }, anim: 'bob' },
        { key: 'purple', art: 'bubble', x: 280, y: 360, s: 1.2, opts: { color: '#ab47bc' }, anim: 'bob' },
        { key: 'orange', art: 'bubble', x: 740, y: 370, s: 1.2, opts: { color: '#ffa726' }, anim: 'bob' },
      ],
      rounds: [
        { key: 'red', say: { en: 'Pop the red bubble!', es: '¡Revienta la burbuja roja!', he: 'פוצצו את הבועה האדומה!' } },
        { key: 'blue', say: { en: 'Pop the blue bubble!', es: '¡Revienta la burbuja azul!', he: 'פוצצו את הבועה הכחולה!' } },
        { key: 'green', say: { en: 'Pop the green bubble!', es: '¡Revienta la burbuja verde!', he: 'פוצצו את הבועה הירוקה!' } },
        { key: 'yellow', say: { en: 'Pop the yellow bubble!', es: '¡Revienta la burbuja amarilla!', he: 'פוצצו את הבועה הצהובה!' } },
        { key: 'purple', say: { en: 'Pop the purple bubble!', es: '¡Revienta la burbuja morada!', he: 'פוצצו את הבועה הסגולה!' } },
        { key: 'orange', say: { en: 'Pop the orange bubble!', es: '¡Revienta la burbuja anaranjada!', he: 'פוצצו את הבועה הכתומה!' } },
      ],
    },
  },
  {
    id: 'psalm23',
    color: '#dcedc8',
    title: { en: 'Hashem Is My Shepherd', es: 'Hashem Es Mi Pastor', he: 'השם רועי' },
    lesson: { en: 'Hashem is my shepherd. I am safe with Him.', es: 'Hashem es mi pastor. Con Él estoy seguro.', he: 'השם רועי. הוא שומר עליי תמיד.' },
    cover: 1,
    pages: [
      {
        text: { en: 'A shepherd watches over his sheep, day and night. Hashem is like that shepherd.', es: 'Un pastor cuida a sus ovejas de día y de noche. Hashem es como ese pastor.', he: 'רועה שומר על הכבשים שלו ביום ובלילה. השם הוא כמו הרועה הזה.' },
        scene: { bg: 'day', items: [['person', 230, 400, 1.3, SHEPHERD, ''], ['sheep', 470, 445, 0.8, {}, 'bob'], ['glow', 630, 440, 1.3, {}, 'pulse'], ['sheep', 630, 450, 0.7, {}, 'hop'], ['sheep', 790, 440, 0.8, {}, 'bob'], ['sun', 860, 100, 0.9, {}, '']] },
      },
      {
        text: { en: 'He takes his sheep to green grass and still water. They have all they need.', es: 'Él lleva a sus ovejas al pasto verde y al agua tranquila. Tienen todo lo que necesitan.', he: 'הוא מוביל את הכבשים לדשא ירוק ולמים שקטים. יש להן כל מה שהן צריכות.' },
        scene: { bg: 'river', items: [['person', 170, 325, 1.1, SHEPHERD, ''], ['sheep', 420, 360, 0.75, {}, 'bob'], ['sheep', 580, 365, 0.7, {}, 'bob'], ['grass', 300, 570, 1.6], ['grass', 640, 575, 1.4], ['flower', 820, 560, 0.9, {}, 'sway'], ['sun', 860, 100, 0.9, {}, '']] },
      },
      {
        text: { en: "Even when it is dark, the shepherd's light is there, so the little sheep is not afraid.", es: 'Aunque esté oscuro, la luz del pastor está ahí, y la ovejita no tiene miedo.', he: 'גם כשחשוך, האור של הרועה נמצא שם, והכבשה הקטנה לא מפחדת.' },
        scene: { bg: 'night', items: [['glow', 560, 430, 2.6, { color: '#ffb300', strength: 2 }, 'pulse'], ['person', 420, 400, 1.3, SHEPHERD, ''], ['lantern', 454, 448, 0.8, {}, 'sway'], ['sheep', 590, 450, 0.8, {}, 'bob'], ['moon', 850, 110, 0.7, {}, '']] },
      },
      {
        text: { en: "The cup is full! Hashem's goodness follows the little sheep all the way home.", es: '¡La copa está llena! La bondad de Hashem sigue a la ovejita hasta su casa.', he: 'הכוס מלאה! הטוב של השם מלווה את הכבשה הקטנה כל הדרך הביתה.' },
        scene: { bg: 'day', items: [['stable', 820, 400, 1.2], ['rock', 230, 480, 0.9], ['cup', 230, 425, 0.9], ['glow', 520, 440, 1.8, {}, 'pulse'], ['sheep', 480, 455, 0.7, {}, 'hop'], ['person', 570, 440, 0.85, KID('#f48fb1'), 'hop'], ['heart', 520, 300, 0.6, {}, 'pulse'], ['sun', 120, 100, 0.8, {}, '']] },
      },
    ],
    game: {
      type: 'prompt',
      bg: 'day',
      keep: true,
      connect: true,
      decor: [['raw', 0, 0, 1, { svg: '<path d="M90 470 Q160 420 230 430 T420 470 T600 420 T790 390" fill="none" stroke="#fff8e1" stroke-width="16" stroke-linecap="round" stroke-dasharray="2 30"/>' }], ['glow', 90, 450, 1.1, {}, 'pulse'], ['sheep', 90, 455, 0.65, {}, 'bob'], ['person', 900, 400, 1.2, { ...SHEPHERD, arms: 'up' }, '']],
      items: [
        { key: 'grass', art: 'grass', x: 230, y: 430, s: 2.4, anim: 'pulse' },
        { key: 'water', art: 'pond', x: 420, y: 475, s: 1.2, anim: 'pulse' },
        { key: 'cup', art: 'cup', x: 600, y: 420, s: 1.1, anim: 'pulse' },
        { key: 'hand', art: 'hand', x: 790, y: 380, s: 1.1, anim: 'pulse' },
      ],
      rounds: [
        { key: 'grass', say: { en: 'Grass', es: 'Pasto', he: 'דשא' } },
        { key: 'water', say: { en: 'Water', es: 'Agua', he: 'מים' } },
        { key: 'cup', say: { en: 'Cup', es: 'Copa', he: 'כוס' } },
        { key: 'hand', say: { en: "The shepherd's hand", es: 'La mano del pastor', he: 'היד של הרועה' } },
      ],
    },
  },
  {
    id: 'ruth',
    color: '#ffe082',
    title: { en: 'Ruth and Naomi', es: 'Rut y Noemí', he: 'רות ונעמי' },
    lesson: { en: 'We can be kind and loving, like Ruth.', es: 'Podemos ser buenos y cariñosos, como Rut.', he: 'גם אנחנו יכולים לעשות חסד, כמו רות.' },
    cover: 1,
    pages: [
      {
        text: { en: 'Naomi was sad. She was going back to her home, far away.', es: 'Noemí estaba triste. Iba a regresar a su hogar, muy lejos.', he: 'נעמי הייתה עצובה. היא החליטה לחזור אל הבית שלה, רחוק רחוק.' },
        scene: { bg: 'desert', items: [['cloud', 300, 110, 1, { color: '#e0e0e0' }, 'drift'], ['rock', 820, 490, 0.8], ['person', 450, 400, 1.6, { ...NAOMI, mood: 'sad' }, ''], ['bag', 580, 480, 0.8]] },
      },
      {
        text: { en: "Ruth loved Naomi. She said, 'Where you go, I will go.'", es: "Rut amaba a Noemí. Le dijo: 'A donde tú vayas, yo iré.'", he: 'רות אהבה את נעמי. היא אמרה: "אל אשר תלכי, אלך."' },
        scene: { bg: 'desert', items: [['person', 410, 400, 1.6, NAOMI, ''], ['person', 590, 400, 1.6, { ...RUTH, arms: 'up' }, 'bob'], ['heart', 500, 180, 0.9, {}, 'pulse']] },
      },
      {
        text: { en: 'So they walked together, all the way to Bethlehem.', es: 'Así que caminaron juntas hasta Belén.', he: 'וכך הן הלכו יחד, כל הדרך עד בית לחם.' },
        scene: { bg: 'day', items: [['sun', 130, 100, 0.9, {}, ''], ['city', 810, 345, 1.1], ['person', 290, 400, 1.4, NAOMI, 'bob'], ['person', 440, 400, 1.4, RUTH, 'bob'], ['flower', 610, 455, 0.9, {}, 'sway']] },
      },
      {
        text: { en: 'Ruth worked in a field. She picked up grain so they could eat.', es: 'Rut trabajó en un campo. Recogía espigas para que pudieran comer.', he: 'רות עבדה בשדה. היא אספה שיבולים כדי שיהיה להן מה לאכול.' },
        scene: { bg: 'day', items: [['sun', 860, 100, 0.9, {}, ''], ['bird', 330, 160, 0.6, {}, 'drift'], ['wheat', 140, 430, 1.3, {}, 'sway'], ['wheat', 260, 450, 1.2, {}, 'sway'], ['wheat', 780, 440, 1.3, {}, 'sway'], ['wheat', 900, 455, 1.2, {}, 'sway'], ['person', 500, 400, 1.6, RUTH, 'bob'], ['basket', 610, 480, 0.9, { full: '#f2c94c' }]] },
      },
      {
        text: { en: 'A kind man named Boaz owned the field. He made sure Ruth and Naomi had plenty!', es: 'Un hombre bondadoso llamado Boaz era el dueño del campo. ¡Él se aseguró de que a Rut y a Noemí no les faltara nada!', he: 'בועז, בעל השדה, היה איש טוב לב. הוא דאג שלרות ולנעמי לא יחסר דבר!' },
        scene: { bg: 'day', items: [['wheat', 130, 440, 1.3, {}, 'sway'], ['wheat', 890, 445, 1.2, {}, 'sway'], ['person', 320, 400, 1.6, { ...BOAZ, arms: 'up' }, ''], ['person', 520, 405, 1.5, { ...RUTH, arms: 'up' }, 'hop'], ['person', 700, 405, 1.5, { ...NAOMI, arms: 'up' }, 'hop'], ['basket', 610, 500, 1, { full: '#f2c94c' }], ['heart', 520, 190, 0.8, {}, 'pulse']] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'fly',
      bg: 'day',
      prompt: { en: 'Tap the grain to help Ruth fill her basket!', es: '¡Toca las espigas para ayudar a Rut a llenar su canasta!', he: 'לחצו על השיבולים ועזרו לרות למלא את הסל!' },
      decor: [['sun', 880, 90, 0.8, {}, ''], ['person', 120, 400, 1.2, { ...RUTH, arms: 'up' }, '']],
      target: ['basket', 250, 500, 1.3],
      targetPoint: [250, 480],
      items: [
        { art: 'wheat', x: 420, y: 385, s: 1, anim: 'sway' },
        { art: 'wheat', x: 560, y: 430, s: 1, anim: 'sway' },
        { art: 'wheat', x: 700, y: 385, s: 1, anim: 'sway' },
        { art: 'wheat', x: 850, y: 430, s: 1, anim: 'sway' },
        { art: 'wheat', x: 440, y: 520, s: 1, anim: 'sway' },
        { art: 'wheat', x: 720, y: 530, s: 1, anim: 'sway' },
      ],
    },
  },
  {
    id: 'esther',
    color: '#ce93d8',
    title: { en: 'Queen Esther', es: 'La Reina Ester', he: 'אסתר המלכה' },
    lesson: { en: 'We can be brave and help others.', es: 'Podemos ser valientes y ayudar a los demás.', he: 'גם אנחנו יכולים להיות אמיצים ולעזור לאחרים.' },
    cover: 0,
    pages: [
      {
        text: { en: 'Esther was kind and good. One day, the king chose her to be queen!', es: 'Ester era buena y amable. ¡Un día, el rey la eligió para ser reina!', he: 'אסתר הייתה טובה ונחמדה. יום אחד, המלך בחר בה להיות מלכה!' },
        scene: { bg: 'day', items: [['city', 500, 330, 2.2, PALACE], ['person', 400, 415, 1.5, { ...KING, arms: 'up' }, ''], ['person', 600, 415, 1.5, ESTHER, 'bob'], ['sparkle', 600, 250, 0.8, {}, 'twinkle']] },
      },
      {
        text: { en: "Her cousin Mordecai said, 'Our people are in danger. Please help!'", es: "Su primo Mordejai le dijo: 'Nuestro pueblo está en peligro. ¡Por favor, ayúdanos!'", he: 'בן הדוד שלה, מרדכי, אמר: "העם שלנו בסכנה. בבקשה, עזרי לנו!"' },
        scene: { bg: 'day', items: [['cloud', 720, 110, 1.1, { color: '#cfd8dc' }, 'drift'], ['city', 170, 345, 1.3, PALACE], ['person', 430, 400, 1.6, { ...MORDECAI, arms: 'up' }, ''], ['person', 620, 400, 1.6, { ...ESTHER, mood: 'open' }, '']] },
      },
      {
        text: { en: 'Esther felt afraid. But she took a deep breath and chose to be brave.', es: 'Ester sintió miedo. Pero respiró hondo y decidió ser valiente.', he: 'אסתר פחדה. אבל היא נשמה נשימה עמוקה והחליטה להיות אמיצה.' },
        scene: { bg: 'night', items: [['moon', 880, 120, 0.7], ['star', 240, 130, 0.4, {}, 'twinkle'], ['star', 740, 110, 0.45, {}, 'twinkle'], ['glow', 500, 420, 2.8, { color: '#ffb300', strength: 2 }, 'pulse'], ['person', 500, 410, 1.7, { ...ESTHER, arms: 'up' }, '']] },
      },
      {
        text: { en: "She went to the king and said, 'Please keep my people safe!'", es: "Fue a ver al rey y le dijo: '¡Por favor, protege a mi pueblo!'", he: 'היא הלכה אל המלך ואמרה: "בבקשה, שמור על העם שלי!"' },
        scene: { bg: 'day', items: [['city', 500, 330, 2.2, PALACE], ['person', 380, 415, 1.6, KING, ''], ['person', 610, 420, 1.5, { ...ESTHER, arms: 'up' }, ''], ['heart', 495, 230, 0.6, {}, 'pulse']] },
      },
      {
        text: { en: 'The king listened, and everyone was safe! Every year we celebrate on Purim.', es: '¡El rey la escuchó, y todos estuvieron a salvo! Cada año lo celebramos en Purim.', he: 'המלך הקשיב, וכולם ניצלו! בכל שנה אנחנו חוגגים את זה בפורים.' },
        scene: { bg: 'day', items: [['sparkle', 240, 150, 0.8, {}, 'twinkle'], ['sparkle', 770, 140, 0.9, {}, 'twinkle'], ['person', 180, 425, 1, { ...KID('#81c784'), arms: 'up' }, 'hop'], ['person', 320, 405, 1.4, { ...MORDECAI, arms: 'up' }, 'hop'], ['person', 500, 400, 1.6, { ...ESTHER, arms: 'up' }, 'hop'], ['person', 680, 425, 1, { ...KID('#ffb74d'), arms: 'up' }, 'hop'], ['person', 820, 410, 1.3, { scarf: '#90caf9', robe: '#64b5f6', arms: 'up' }, 'hop'], ['heart', 500, 170, 0.8, {}, 'pulse']] },
      },
    ],
    game: {
      type: 'seek',
      bg: 'day',
      finds: 3,
      prompt: { en: 'Queen Esther is hiding in the garden! Tap the bushes to find her.', es: '¡La reina Ester se esconde en el jardín! Toca los arbustos para encontrarla.', he: 'אסתר המלכה מתחבאת בגן! לחצו על השיחים ומצאו אותה.' },
      notHere: NOT_HERE,
      found: { en: 'You found Queen Esther!', es: '¡Encontraste a la reina Ester!', he: 'מצאתם את אסתר המלכה!' },
      hide: { art: 'person', opts: { ...ESTHER, arms: 'up' }, s: 0.55 },
      decoys: ['bunny', 'bird'],
      decor: [['city', 500, 380, 1.5, PALACE], ['person', 100, 430, 1.1, KING, ''], ['flower', 930, 520, 1, {}, 'sway']],
      spots: SEEK_SPOTS,
    },
  },
  {
    id: 'daniel',
    color: '#ffcc80',
    title: { en: 'Daniel and the Lions', es: 'Daniel y los Leones', he: 'דניאל והאריות' },
    lesson: { en: 'Hashem is always with us.', es: 'Hashem siempre está con nosotros.', he: 'השם תמיד איתנו.' },
    cover: 2,
    pages: [
      {
        text: { en: 'Daniel loved Hashem. He prayed every day.', es: 'Daniel amaba a Hashem. Él rezaba todos los días.', he: 'דניאל אהב את השם. הוא התפלל בכל יום.' },
        scene: { bg: 'desert', items: [['city', 500, 360, 2], ['person', 500, 410, 1.5, { ...DANIEL, arms: 'up' }, ''], ['sun', 120, 100, 0.9, {}, ''], ['heart', 640, 220, 0.6, {}, 'pulse']] },
      },
      {
        text: { en: 'Some men did not like that. They put Daniel in a den of lions!', es: 'A unos hombres no les gustó eso. ¡Pusieron a Daniel en un foso de leones!', he: 'היו אנשים שזה לא מצא חן בעיניהם. הם הכניסו את דניאל לגוב האריות!' },
        scene: { bg: 'cave', items: [['lion', 200, 430, 1.1, { mood: 'roar' }, 'bob'], ['lion', 800, 430, 1.1, { mood: 'roar' }, 'bob'], ['person', 500, 400, 1.4, { ...DANIEL, mood: 'open' }, '']] },
      },
      {
        text: { en: "Roar! But Hashem sent an angel to shut the lions' mouths.", es: '¡Grrr! Pero Hashem envió un ángel para cerrar la boca de los leones.', he: 'גררר! אבל השם שלח מלאך לסגור את הפה של האריות.' },
        scene: { bg: 'cave', items: [['glow', 500, 190, 2.2, { color: '#fff59d', strength: 2 }, 'pulse'], ['angel', 500, 190, 1.3, {}, 'bob'], ['lion', 220, 440, 1, { mood: 'sleep' }, ''], ['lion', 780, 440, 1, { mood: 'sleep' }, ''], ['person', 500, 420, 1.2, { ...DANIEL, arms: 'up' }, '']] },
      },
      {
        text: { en: 'In the morning, Daniel was safe! Hashem protected him.', es: '¡En la mañana, Daniel estaba a salvo! Hashem lo protegió.', he: 'בבוקר דניאל היה בריא ושלם! השם שמר עליו.' },
        scene: { bg: 'day', items: [['sun', 860, 110, 1.1, {}, ''], ['person', 430, 390, 1.5, { ...DANIEL, arms: 'up' }, 'hop'], ['person', 640, 390, 1.5, { crown: true, robe: '#c62828', beard: '#6d4c41', sash: '#ffd54f', arms: 'up' }, ''], ['lion', 160, 440, 0.8, { mood: 'sleep' }, '']] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'transform',
      bg: 'cave',
      prompt: { en: 'Tap each lion to help it go to sleep!', es: '¡Toca cada león para ayudarlo a dormir!', he: 'לחצו על כל אריה ועזרו לו להירדם!' },
      decor: [['person', 500, 390, 1.2, { ...DANIEL, arms: 'up' }, '']],
      items: [
        { art: 'lion', x: 130, y: 290, s: 0.95, opts: { mood: 'roar' }, after: { mood: 'sleep' }, anim: 'bob' },
        { art: 'lion', x: 290, y: 470, s: 0.95, opts: { mood: 'roar' }, after: { mood: 'sleep' }, anim: 'bob' },
        { art: 'lion', x: 710, y: 470, s: 0.95, opts: { mood: 'roar' }, after: { mood: 'sleep' }, anim: 'bob' },
        { art: 'lion', x: 870, y: 290, s: 0.95, opts: { mood: 'roar' }, after: { mood: 'sleep' }, anim: 'bob' },
        { art: 'lion', x: 500, y: 130, s: 0.85, opts: { mood: 'roar' }, after: { mood: 'sleep' }, anim: 'bob' },
      ],
    },
  },
];

// The map's two worlds. Torah Trail holds the stories from the five books of the Torah.
// Kings and Prophets holds the stories from the Prophets and the Writings, in the order
// those books come in the Hebrew Bible.
export const WORLDS = [
  {
    id: 'torah',
    title: { en: 'Torah Trail', es: 'Sendero de la Torá', he: 'שביל התורה' },
    stories: ['creation', 'noah', 'abraham', 'joseph', 'moses', 'redsea', 'manna'],
  },
  {
    id: 'prophets',
    title: { en: 'Kings and Prophets', es: 'Reyes y Profetas', he: 'מלכים ונביאים' },
    stories: ['samuel', 'david', 'elijah', 'jonah', 'psalm23', 'ruth', 'esther', 'daniel'],
  },
];
export const STORIES = WORLDS.flatMap((w) => w.stories).map((id) => ALL.find((s) => s.id === id));

export const byId = (id) => STORIES.find((s) => s.id === id);
export const worldById = (id) => WORLDS.find((w) => w.id === id);
export const worldOf = (storyId) => WORLDS.find((w) => w.stories.includes(storyId));
