// Story data. Scene items are [art, x, y, scale, opts, anim] on a 1000x600 stage.
// Text is short and simple on purpose: it is read aloud to children who can't read yet.

const NOAH = { beard: '#eeeeee', hair: '#eeeeee', robe: '#8d6e63', sash: '#ffcc80' };
const DAVID = { robe: '#81c784', hair: '#8d4f2a', sash: '#a1744a' };
const GOLIATH = { helmet: true, robe: '#90a4ae', beard: '#5d4037', mood: 'grumpy', sash: '#795548' };
const JONAH = { robe: '#8d6e63', beard: '#5d4037', hair: '#5d4037', sash: '#ffb74d' };
const DANIEL = { robe: '#7986cb', sash: '#ffd54f', hair: '#3e2723', beard: '#3e2723' };
const JESUS = { robe: '#ffffff', sash: '#e53935', hair: '#5d4037', beard: '#5d4037' };
const MARY = { scarf: '#42a5f5', robe: '#90caf9' };
const JOSEPH = { robe: '#a1887f', beard: '#5d4037', hair: '#5d4037', staff: true };
const MOM = { scarf: '#ab47bc', robe: '#ce93d8' };
const PRINCESS = { crown: true, robe: '#f8bbd0', hair: '#212121', sash: '#ffd54f' };
const KID = (robe, hair = '#3e2723') => ({ robe, hair });

const JOHN = { robe: '#a1887f', sash: '#6d4c41', hair: '#3e2723', beard: '#3e2723' };
const SHEPHERD = { robe: '#4db6ac', sash: '#ffcc80', hair: '#6d4c41', beard: '#6d4c41', staff: true };
const FRIEND = { robe: '#ffb74d', hair: '#4e342e', beard: '#4e342e' };
const FRIEND2 = { robe: '#90caf9', hair: '#212121' };
// River water drawn over people's legs so they look like they're standing in the Jordan.
const IN_RIVER = { svg: '<rect x="-3000" y="466" width="7000" height="64" fill="#4fa3e0" opacity=".92"/><path d="M-3000 466 H4000" stroke="#81c4f0" stroke-width="6"/>' };
const DOVE = { color: '#ffffff' };

const NIGHT_HALF = { svg: '<rect x="500" y="-3000" width="3500" height="3452" fill="#1d2b5c"/>' };
const rainCloud = { rain: true, color: '#cfd8dc' };

const ALL = [
  {
    id: 'creation',
    color: '#ffd54f',
    title: { en: 'God Made the World', es: 'Dios Creó el Mundo' },
    lesson: { en: 'God made everything, and He made you too!', es: '¡Dios hizo todo, y también te hizo a ti!' },
    cover: 2,
    pages: [
      {
        text: { en: "In the beginning, it was dark. God said, 'Let there be light!' And there was light.", es: "Al principio, todo estaba oscuro. Dios dijo: '¡Que haya luz!' Y hubo luz." },
        scene: { bg: 'dark', items: [['sparkle', 500, 270, 3, {}, 'pulse'], ['sparkle', 220, 140, 0.8, {}, 'twinkle'], ['sparkle', 790, 180, 1, {}, 'twinkle'], ['sparkle', 300, 450, 0.6, {}, 'twinkle'], ['sparkle', 740, 470, 0.7, {}, 'twinkle']] },
      },
      {
        text: { en: 'God made the blue sky, the land, and green trees.', es: 'Dios hizo el cielo azul, la tierra y los árboles verdes.' },
        scene: { bg: 'day', items: [['cloud', 260, 120, 1.2, {}, 'drift'], ['cloud', 760, 90, 0.9, {}, 'drift'], ['tree', 180, 390, 1.6, { fruit: true }, 'sway'], ['tree', 820, 400, 1.3, {}, 'sway'], ['flower', 380, 440, 1, {}, 'sway'], ['flower', 620, 450, 1, { color: '#ba68c8' }, 'sway'], ['grass', 500, 470, 1.4]] },
      },
      {
        text: { en: 'God made the sun for the day, and the moon and stars for the night.', es: 'Dios hizo el sol para el día, y la luna y las estrellas para la noche.' },
        scene: { bg: 'day', items: [['raw', 0, 0, 1, NIGHT_HALF], ['sun', 260, 210, 1.8, {}, 'bob'], ['moon', 760, 220, 1.6, {}, 'bob'], ['star', 620, 110, 0.4, {}, 'twinkle'], ['star', 900, 110, 0.5, {}, 'twinkle'], ['star', 880, 380, 0.35, {}, 'twinkle'], ['star', 600, 380, 0.3, {}, 'twinkle']] },
      },
      {
        text: { en: 'God made fish to swim, birds to fly, and animals of every kind.', es: 'Dios hizo peces que nadan, aves que vuelan y animales de todo tipo.' },
        scene: { bg: 'beach', items: [['fish', 110, 410, 0.8, {}, 'drift'], ['fish', 230, 450, 0.7, { color: '#ffd54f' }, 'drift'], ['bird', 330, 130, 0.9, { color: '#f06292' }, 'bob'], ['bird', 620, 170, 0.7, {}, 'bob'], ['elephant', 560, 420, 1.2, {}, 'bob'], ['giraffe', 790, 380, 1.5, {}, 'sway'], ['bunny', 420, 470, 0.7, {}, 'hop'], ['lion', 930, 450, 0.8, {}, 'bob']] },
      },
      {
        text: { en: "Then God made people. God looked at everything and said, 'It is very good!'", es: "Luego Dios hizo a las personas. Dios miró todo y dijo: '¡Es muy bueno!'" },
        scene: { bg: 'day', items: [['sun', 860, 110, 1, {}, ''], ['tree', 150, 390, 1.6, { fruit: true }, 'sway'], ['person', 420, 390, 1.6, { robe: '#81c784', hair: '#5d4037', arms: 'up' }, 'bob'], ['person', 580, 390, 1.6, { robe: '#ffb74d', hair: '#3e2723', skin: '#c68e5e', arms: 'up' }, 'bob'], ['heart', 500, 160, 1, {}, 'pulse'], ['bunny', 760, 460, 0.6, {}, 'hop']] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'reveal',
      bg: 'day',
      prompt: { en: 'Tap the sparkles to help make the world!', es: '¡Toca las chispitas para crear el mundo!' },
      decor: [['grass', 500, 470, 1.4], ['grass', 250, 500, 1]],
      items: [
        { art: 'sun', x: 140, y: 120, s: 1.1, anim: 'bob', word: { en: 'Sun', es: 'Sol' } },
        { art: 'cloud', x: 420, y: 110, s: 1, anim: 'drift', word: { en: 'Cloud', es: 'Nube' } },
        { art: 'bird', x: 720, y: 140, s: 0.9, opts: { color: '#f06292' }, anim: 'bob', word: { en: 'Bird', es: 'Pájaro' } },
        { art: 'tree', x: 160, y: 380, s: 1.5, opts: { fruit: true }, anim: 'sway', word: { en: 'Tree', es: 'Árbol' } },
        { art: 'flower', x: 330, y: 450, s: 1, anim: 'sway', word: { en: 'Flower', es: 'Flor' } },
        { art: 'lion', x: 540, y: 410, s: 1.1, anim: 'bob', word: { en: 'Lion', es: 'León' } },
        { art: 'bunny', x: 720, y: 440, s: 0.9, anim: 'hop', word: { en: 'Bunny', es: 'Conejo' } },
        { art: 'elephant', x: 890, y: 410, s: 1.1, anim: 'bob', word: { en: 'Elephant', es: 'Elefante' } },
      ],
    },
  },
  {
    id: 'noah',
    color: '#81d4fa',
    title: { en: "Noah's Big Boat", es: 'El Gran Barco de Noé' },
    lesson: { en: 'God keeps His promises.', es: 'Dios cumple sus promesas.' },
    cover: 4,
    pages: [
      {
        text: { en: "God told Noah, 'Build a big boat called an ark.'", es: "Dios le dijo a Noé: 'Construye un barco grande llamado arca.'" },
        scene: { bg: 'day', items: [['cloud', 660, 150, 1.6, {}, ''], ['sparkle', 660, 140, 1.3, {}, 'pulse'], ['person', 360, 390, 1.6, { ...NOAH, arms: 'up' }, 'bob'], ['tree', 140, 400, 1.2, {}, 'sway'], ['sheep', 860, 450, 0.7, {}, 'hop']] },
      },
      {
        text: { en: 'Noah worked and worked. Bang, bang, bang!', es: 'Noé trabajó y trabajó. ¡Pum, pum, pum!' },
        scene: { bg: 'day', items: [['ark', 680, 380, 1.7], ['person', 260, 390, 1.6, NOAH, 'hop'], ['hammer', 310, 420, 0.8, {}, 'wiggle'], ['sun', 120, 100, 0.9, {}, '']] },
      },
      {
        text: { en: 'The animals came two by two!', es: '¡Los animales llegaron de dos en dos!' },
        scene: { bg: 'day', items: [['ark', 780, 350, 1.6], ['giraffe', 120, 360, 1.1, {}, 'sway'], ['giraffe', 210, 360, 1.1, {}, 'sway'], ['elephant', 360, 380, 0.9, {}, 'bob'], ['elephant', 470, 380, 0.9, {}, 'bob'], ['lion', 150, 480, 0.8, {}, 'hop'], ['lion', 250, 480, 0.8, {}, 'hop'], ['sheep', 400, 490, 0.8, {}, 'hop'], ['sheep', 500, 490, 0.8, {}, 'hop'], ['person', 620, 430, 1.1, { ...NOAH, arms: 'up' }, '']] },
      },
      {
        text: { en: 'It rained and rained! But everyone was safe inside the ark.', es: '¡Llovió y llovió! Pero todos estaban a salvo dentro del arca.' },
        scene: { bg: 'storm', items: [['ark', 500, 330, 2, {}, 'rock'], ['cloud', 240, 90, 1.4, rainCloud, 'drift'], ['cloud', 720, 80, 1.6, rainCloud, 'drift'], ['waves', 300, 420, 1, { color: '#5aa8e6', w: 700 }, 'drift'], ['waves', 700, 470, 1, { color: '#5aa8e6', w: 700 }, 'drift']] },
      },
      {
        text: { en: 'Then God put a rainbow in the sky. It is His promise!', es: 'Luego Dios puso un arcoíris en el cielo. ¡Es su promesa!' },
        scene: { bg: 'day', items: [['rainbow', 500, 330, 4.2], ['ark', 560, 400, 1.5], ['bird', 280, 170, 0.9, { color: '#ffffff', branch: true }, 'bob'], ['person', 200, 390, 1.4, { ...NOAH, arms: 'up' }, 'hop'], ['sun', 880, 100, 0.9, {}, '']] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'fly',
      bg: 'day',
      prompt: { en: 'Tap the animals to help them into the ark!', es: '¡Toca los animales para ayudarlos a subir al arca!' },
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
    id: 'moses',
    color: '#a5d6a7',
    title: { en: 'Baby Moses', es: 'El Bebé Moisés' },
    lesson: { en: 'God takes care of us.', es: 'Dios nos cuida.' },
    cover: 1,
    pages: [
      {
        text: { en: 'A mommy loved her baby boy very much. She wanted to keep him safe.', es: 'Una mamá amaba mucho a su bebé. Ella quería protegerlo.' },
        scene: { bg: 'day', items: [['palm', 150, 380, 1.6, {}, 'sway'], ['palm', 860, 390, 1.4, {}, 'sway'], ['person', 500, 390, 1.6, { ...MOM, arms: 'hold' }, ''], ['baby', 510, 395, 0.9, {}, 'bob'], ['heart', 500, 150, 0.8, {}, 'pulse']] },
      },
      {
        text: { en: 'She made a little basket boat and put him in the river.', es: 'Ella hizo una canastita que flota y lo puso en el río.' },
        scene: { bg: 'river', items: [['person', 140, 315, 1.2, { ...MOM, arms: 'up' }, ''], ['reeds', 260, 420, 1.4, {}, 'sway'], ['reeds', 820, 410, 1.3, {}, 'sway'], ['basketBoat', 520, 455, 1.3, {}, 'bob'], ['sun', 860, 100, 0.9, {}, '']] },
      },
      {
        text: { en: 'His big sister Miriam watched the basket float.', es: 'Su hermana mayor, Miriam, vigilaba la canasta.' },
        scene: { bg: 'river', items: [['person', 170, 330, 1, { scarf: '#ef9a9a', robe: '#ffcc80' }, 'bob'], ['reeds', 250, 410, 1.4, {}, 'sway'], ['basketBoat', 620, 460, 1.2, {}, 'bob'], ['reeds', 860, 410, 1.2, {}, 'sway'], ['bird', 560, 140, 0.6, {}, 'drift']] },
      },
      {
        text: { en: 'A princess found the baby. She named him Moses!', es: 'Una princesa encontró al bebé. ¡Lo llamó Moisés!' },
        scene: { bg: 'river', items: [['palm', 870, 330, 1.6, {}, 'sway'], ['person', 620, 310, 1.3, { ...PRINCESS, arms: 'up' }, 'bob'], ['basketBoat', 440, 460, 1.2, {}, 'bob'], ['heart', 530, 140, 0.8, {}, 'pulse'], ['reeds', 200, 420, 1.3, {}, 'sway']] },
      },
    ],
    game: {
      type: 'steer',
      goal: 5,
      prompt: { en: 'Help the basket float down the river! Catch five flowers.', es: '¡Ayuda a la canasta a flotar por el río! Atrapa cinco flores.' },
    },
  },
  {
    id: 'david',
    color: '#c5e1a5',
    title: { en: 'David the Brave', es: 'David el Valiente' },
    lesson: { en: "With God's help, you can be brave too!", es: '¡Con la ayuda de Dios, tú también puedes ser valiente!' },
    cover: 1,
    pages: [
      {
        text: { en: 'David was a shepherd boy. He took care of his sheep.', es: 'David era un pastorcito. Él cuidaba a sus ovejas.' },
        scene: { bg: 'day', items: [['person', 280, 400, 1.3, { ...DAVID, staff: true }, ''], ['sheep', 500, 440, 0.9, {}, 'hop'], ['sheep', 650, 450, 0.8, {}, 'hop'], ['sheep', 800, 440, 0.9, {}, 'hop'], ['sun', 860, 100, 0.9, {}, ''], ['cloud', 400, 100, 0.8, {}, 'drift']] },
      },
      {
        text: { en: 'A giant named Goliath was scaring everyone.', es: 'Un gigante llamado Goliat asustaba a todos.' },
        scene: { bg: 'desert', items: [['person', 660, 330, 2.6, GOLIATH, 'sway'], ['person', 180, 420, 0.9, { robe: '#e57373', mood: 'open', arms: 'up' }, 'hop'], ['person', 290, 425, 0.9, { robe: '#64b5f6', mood: 'open', arms: 'up' }, 'hop']] },
      },
      {
        text: { en: "But David said, 'God will help me!'", es: "Pero David dijo: '¡Dios me ayudará!'" },
        scene: { bg: 'day', items: [['sparkle', 500, 170, 1.3, {}, 'pulse'], ['person', 500, 400, 1.5, { ...DAVID, arms: 'up' }, 'hop'], ['heart', 330, 220, 0.6, {}, 'pulse'], ['heart', 680, 230, 0.6, {}, 'pulse'], ['sheep', 840, 450, 0.7, {}, 'hop']] },
      },
      {
        text: { en: 'David picked five smooth stones from the stream.', es: 'David tomó cinco piedras lisas del arroyo.' },
        scene: { bg: 'river', items: [['person', 200, 330, 1.2, DAVID, ''], ['stone', 420, 470, 0.9], ['stone', 540, 455, 0.8, { color: '#cfd8dc' }], ['stone', 650, 480, 0.9], ['stone', 760, 460, 0.8, { color: '#d7ccc8' }], ['stone', 870, 478, 0.9], ['bag', 280, 380, 0.6]] },
      },
      {
        text: { en: 'Plop! The giant fell down. God helped David be brave!', es: '¡Pum! El gigante se cayó. ¡Dios ayudó a David a ser valiente!' },
        scene: { bg: 'desert', items: [['person', 700, 330, 2.4, { ...GOLIATH, mood: 'sleep' }, 'fall-over'], ['person', 240, 400, 1.4, { ...DAVID, arms: 'up' }, 'hop'], ['star', 760, 200, 0.3, {}, 'twinkle'], ['star', 820, 240, 0.25, {}, 'twinkle']] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'fly',
      bg: 'river',
      prompt: { en: 'Tap five smooth stones for David!', es: '¡Toca cinco piedras lisas para David!' },
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
    id: 'jonah',
    color: '#80deea',
    title: { en: 'Jonah and the Big Fish', es: 'Jonás y el Gran Pez' },
    lesson: { en: 'God hears us when we pray.', es: 'Dios nos escucha cuando oramos.' },
    cover: 2,
    pages: [
      {
        text: { en: 'God asked Jonah to go to the city of Nineveh. But Jonah ran away on a boat.', es: 'Dios le pidió a Jonás que fuera a la ciudad de Nínive. Pero Jonás huyó en un barco.' },
        scene: { bg: 'sea', items: [['city', 140, 330, 0.9], ['person', 610, 312, 0.8, JONAH, ''], ['boat', 600, 360, 1.6, {}, 'rock'], ['sun', 880, 100, 0.9, {}, ''], ['bird', 380, 140, 0.6, {}, 'drift']] },
      },
      {
        text: { en: 'A big storm came! Splash! Jonah fell into the sea.', es: '¡Vino una gran tormenta! ¡Splash! Jonás cayó al mar.' },
        scene: { bg: 'storm', items: [['boat', 420, 350, 1.6, {}, 'rock'], ['cloud', 240, 90, 1.4, rainCloud, 'drift'], ['cloud', 720, 80, 1.5, rainCloud, 'drift'], ['person', 760, 430, 0.9, { ...JONAH, mood: 'open', arms: 'up' }, 'sink'], ['waves', 760, 470, 1, { color: '#81c4f0', w: 300 }, '']] },
      },
      {
        text: { en: 'Gulp! A big fish swallowed Jonah. Inside the fish, Jonah prayed to God.', es: '¡Glup! Un gran pez se tragó a Jonás. Dentro del pez, Jonás oró a Dios.' },
        scene: { bg: 'under', items: [['bigFish', 500, 300, 2.3, { jonah: true }, 'bob'], ['fish', 130, 480, 0.6, { color: '#ffd54f' }, 'drift'], ['fish', 870, 140, 0.5, {}, 'drift'], ['bubble', 860, 420, 0.25, { color: '#e1f5fe' }, 'bob'], ['bubble', 900, 360, 0.15, { color: '#e1f5fe' }, 'bob']] },
      },
      {
        text: { en: 'After three days, the fish put Jonah on the beach. This time, Jonah obeyed God!', es: 'Después de tres días, el pez dejó a Jonás en la playa. ¡Esta vez, Jonás obedeció a Dios!' },
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
        { key: 'red', say: { en: 'Pop the red bubble!', es: '¡Revienta la burbuja roja!' } },
        { key: 'blue', say: { en: 'Pop the blue bubble!', es: '¡Revienta la burbuja azul!' } },
        { key: 'green', say: { en: 'Pop the green bubble!', es: '¡Revienta la burbuja verde!' } },
        { key: 'yellow', say: { en: 'Pop the yellow bubble!', es: '¡Revienta la burbuja amarilla!' } },
        { key: 'purple', say: { en: 'Pop the purple bubble!', es: '¡Revienta la burbuja morada!' } },
        { key: 'orange', say: { en: 'Pop the orange bubble!', es: '¡Revienta la burbuja anaranjada!' } },
      ],
    },
  },
  {
    id: 'daniel',
    color: '#ffcc80',
    title: { en: 'Daniel and the Lions', es: 'Daniel y los Leones' },
    lesson: { en: 'God is always with us.', es: 'Dios siempre está con nosotros.' },
    cover: 2,
    pages: [
      {
        text: { en: 'Daniel loved God. He prayed every day.', es: 'Daniel amaba a Dios. Él oraba todos los días.' },
        scene: { bg: 'desert', items: [['city', 500, 360, 2], ['person', 500, 410, 1.5, { ...DANIEL, arms: 'pray' }, ''], ['sun', 120, 100, 0.9, {}, ''], ['heart', 640, 220, 0.6, {}, 'pulse']] },
      },
      {
        text: { en: 'Some men did not like that. They put Daniel in a den of lions!', es: 'A unos hombres no les gustó eso. ¡Pusieron a Daniel en un foso de leones!' },
        scene: { bg: 'cave', items: [['lion', 200, 430, 1.1, { mood: 'roar' }, 'bob'], ['lion', 800, 430, 1.1, { mood: 'roar' }, 'bob'], ['person', 500, 400, 1.4, { ...DANIEL, mood: 'open' }, '']] },
      },
      {
        text: { en: "Roar! But God sent an angel to shut the lions' mouths.", es: '¡Grrr! Pero Dios envió un ángel para cerrar la boca de los leones.' },
        scene: { bg: 'cave', items: [['angel', 500, 190, 1.3, {}, 'bob'], ['lion', 220, 440, 1, { mood: 'sleep' }, ''], ['lion', 780, 440, 1, { mood: 'sleep' }, ''], ['person', 500, 420, 1.2, { ...DANIEL, arms: 'pray' }, '']] },
      },
      {
        text: { en: 'In the morning, Daniel was safe! God protected him.', es: '¡En la mañana, Daniel estaba a salvo! Dios lo protegió.' },
        scene: { bg: 'day', items: [['sun', 860, 110, 1.1, {}, ''], ['person', 430, 390, 1.5, { ...DANIEL, arms: 'up' }, 'hop'], ['person', 640, 390, 1.5, { crown: true, robe: '#c62828', beard: '#6d4c41', sash: '#ffd54f', arms: 'up' }, ''], ['lion', 160, 440, 0.8, { mood: 'sleep' }, '']] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'transform',
      bg: 'cave',
      prompt: { en: 'Tap each lion to help it go to sleep!', es: '¡Toca cada león para ayudarlo a dormir!' },
      decor: [['person', 500, 390, 1.2, { ...DANIEL, arms: 'pray' }, '']],
      items: [
        { art: 'lion', x: 130, y: 290, s: 0.95, opts: { mood: 'roar' }, after: { mood: 'sleep' }, anim: 'bob' },
        { art: 'lion', x: 290, y: 470, s: 0.95, opts: { mood: 'roar' }, after: { mood: 'sleep' }, anim: 'bob' },
        { art: 'lion', x: 710, y: 470, s: 0.95, opts: { mood: 'roar' }, after: { mood: 'sleep' }, anim: 'bob' },
        { art: 'lion', x: 870, y: 290, s: 0.95, opts: { mood: 'roar' }, after: { mood: 'sleep' }, anim: 'bob' },
        { art: 'lion', x: 500, y: 130, s: 0.85, opts: { mood: 'roar' }, after: { mood: 'sleep' }, anim: 'bob' },
      ],
    },
  },
  {
    id: 'loaves',
    color: '#ffab91',
    title: { en: 'Jesus Feeds Everyone', es: 'Jesús Alimenta a Todos' },
    lesson: { en: 'Jesus cares for us, and we can share too!', es: '¡Jesús nos cuida, y nosotros también podemos compartir!' },
    cover: 2,
    pages: [
      {
        text: { en: 'Lots and lots of people came to hear Jesus.', es: 'Muchísimas personas vinieron a escuchar a Jesús.' },
        scene: { bg: 'day', items: [['person', 500, 370, 1.6, { ...JESUS, arms: 'up' }, ''], ['person', 120, 450, 0.9, KID('#ef9a9a'), 'bob'], ['person', 230, 460, 0.9, { robe: '#90caf9', beard: '#6d4c41' }, 'bob'], ['person', 340, 470, 0.8, { scarf: '#ffcc80', robe: '#ffe082' }, 'bob'], ['person', 660, 470, 0.8, KID('#a5d6a7', '#212121'), 'bob'], ['person', 770, 460, 0.9, { scarf: '#b39ddb', robe: '#d1c4e9' }, 'bob'], ['person', 880, 450, 0.9, { robe: '#ffab91', bald: true, beard: '#bdbdbd' }, 'bob']] },
      },
      {
        text: { en: 'Everyone was hungry, but there was no food.', es: 'Todos tenían hambre, pero no había comida.' },
        scene: { bg: 'day', items: [['person', 220, 410, 1.2, { robe: '#90caf9', beard: '#6d4c41', mood: 'open' }, ''], ['person', 380, 420, 1.1, { scarf: '#ffcc80', robe: '#ffe082', mood: 'open' }, ''], ['person', 640, 420, 1.1, { ...KID('#a5d6a7', '#212121'), mood: 'open' }, ''], ['person', 800, 410, 1.2, { scarf: '#b39ddb', robe: '#d1c4e9', mood: 'open' }, ''], ['basket', 510, 470, 1.1, {}, 'wiggle']] },
      },
      {
        text: { en: 'A boy shared his lunch: five loaves of bread and two fish.', es: 'Un niño compartió su almuerzo: cinco panes y dos peces.' },
        scene: { bg: 'day', items: [['person', 650, 380, 1.6, { ...JESUS, arms: 'down' }, ''], ['person', 360, 410, 1.2, { ...KID('#4fc3f7'), arms: 'hold' }, 'hop'], ['basket', 360, 462, 0.75], ['bread', 342, 446, 0.42], ['bread', 380, 444, 0.42], ['fish', 362, 432, 0.36, { color: '#90a4ae' }]] },
      },
      {
        text: { en: 'Jesus thanked God, and there was food for everyone! Yum!', es: 'Jesús dio gracias a Dios, ¡y hubo comida para todos! ¡Qué rico!' },
        scene: { bg: 'day', items: [['person', 500, 370, 1.5, { ...JESUS, arms: 'up' }, ''], ['basket', 200, 470, 1], ['bread', 180, 450, 0.5], ['bread', 220, 446, 0.5], ['basket', 800, 470, 1], ['fish', 800, 446, 0.5, { color: '#90a4ae' }], ['person', 330, 450, 0.9, KID('#ef9a9a'), 'hop'], ['person', 670, 455, 0.9, KID('#a5d6a7', '#212121'), 'hop'], ['heart', 300, 180, 0.6, {}, 'pulse'], ['heart', 700, 170, 0.6, {}, 'pulse']] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'fly',
      bg: 'day',
      prompt: { en: 'Put the bread and the fish in the basket!', es: '¡Pon los panes y los peces en la canasta!' },
      decor: [['person', 120, 400, 1.1, { ...KID('#4fc3f7'), arms: 'up' }, 'hop'], ['person', 880, 380, 1.3, { ...JESUS, arms: 'up' }, '']],
      target: ['basket', 500, 480, 1.4],
      targetPoint: [500, 470],
      items: [
        { art: 'bread', x: 260, y: 140, s: 1.1, anim: 'bob' },
        { art: 'bread', x: 420, y: 100, s: 1.1, anim: 'bob' },
        { art: 'bread', x: 580, y: 100, s: 1.1, anim: 'bob' },
        { art: 'bread', x: 740, y: 140, s: 1.1, anim: 'bob' },
        { art: 'bread', x: 300, y: 300, s: 1.1, anim: 'bob' },
        { art: 'fish', x: 500, y: 250, s: 1, opts: { color: '#90a4ae' }, anim: 'bob' },
        { art: 'fish', x: 700, y: 300, s: 1, opts: { color: '#90a4ae' }, anim: 'bob' },
      ],
    },
  },
  {
    id: 'nativity',
    color: '#9fa8da',
    title: { en: 'Baby Jesus Is Born', es: 'Nace el Niño Jesús' },
    lesson: { en: "Jesus is God's gift of love to us.", es: 'Jesús es el regalo de amor de Dios para nosotros.' },
    cover: 2,
    pages: [
      {
        text: { en: 'Mary and Joseph traveled to the little town of Bethlehem.', es: 'María y José viajaron al pueblito de Belén.' },
        scene: { bg: 'desert', items: [['city', 860, 380, 1.1], ['palm', 120, 370, 1.5, {}, 'sway'], ['person', 400, 400, 1.4, MARY, 'hop'], ['person', 560, 395, 1.5, JOSEPH, 'hop'], ['sun', 700, 100, 0.8, {}, '']] },
      },
      {
        text: { en: 'There was no room at the inn, so they stayed where the animals sleep.', es: 'No había lugar en el mesón, así que se quedaron donde duermen los animales.' },
        scene: { bg: 'night', items: [['stable', 520, 380, 1.8], ['sheep', 220, 450, 0.9, {}, 'bob'], ['person', 440, 410, 1.2, MARY, ''], ['person', 600, 405, 1.3, JOSEPH, ''], ['moon', 860, 110, 0.8, {}, '']] },
      },
      {
        text: { en: 'Baby Jesus was born! Mary laid Him in a manger.', es: '¡Nació el niño Jesús! María lo acostó en un pesebre.' },
        scene: { bg: 'night', items: [['stable', 500, 380, 2], ['star', 500, 90, 0.9, { mood: 'happy' }, 'pulse'], ['person', 360, 410, 1.2, { ...MARY, arms: 'pray' }, ''], ['person', 650, 405, 1.3, JOSEPH, ''], ['manger', 500, 455, 1.1], ['sheep', 160, 460, 0.8, {}, 'bob'], ['sheep', 850, 460, 0.8, {}, 'bob']] },
      },
      {
        text: { en: 'Angels sang, and a bright star shone in the sky!', es: '¡Los ángeles cantaron, y una estrella brillante alumbró el cielo!' },
        scene: { bg: 'night', items: [['angel', 220, 190, 1.1, {}, 'bob'], ['angel', 780, 190, 1.1, {}, 'bob'], ['star', 500, 110, 1.3, { mood: 'happy' }, 'pulse'], ['stable', 500, 430, 1.4], ['manger', 500, 490, 0.8], ['sheep', 250, 480, 0.7, {}, 'hop'], ['sheep', 760, 480, 0.7, {}, 'hop']] },
      },
    ],
    game: {
      type: 'prompt',
      bg: 'night',
      keep: true,
      connect: true,
      decor: [['stable', 500, 470, 1.3], ['manger', 500, 530, 0.7], ['sheep', 200, 500, 0.7, {}, 'bob'], ['sheep', 800, 500, 0.7, {}, 'bob']],
      items: [
        { key: '4', art: 'star', x: 720, y: 230, s: 1, opts: { label: 4, color: '#fff59d' }, anim: 'pulse' },
        { key: '1', art: 'star', x: 140, y: 130, s: 1, opts: { label: 1, color: '#fff59d' }, anim: 'pulse' },
        { key: '5', art: 'star', x: 880, y: 110, s: 1, opts: { label: 5, color: '#fff59d' }, anim: 'pulse' },
        { key: '2', art: 'star', x: 340, y: 240, s: 1, opts: { label: 2, color: '#fff59d' }, anim: 'pulse' },
        { key: '3', art: 'star', x: 530, y: 100, s: 1, opts: { label: 3, color: '#fff59d' }, anim: 'pulse' },
      ],
      rounds: [
        { key: '1', say: { en: 'Tap star number one!', es: '¡Toca la estrella número uno!' } },
        { key: '2', say: { en: 'Tap star number two!', es: '¡Toca la estrella número dos!' } },
        { key: '3', say: { en: 'Tap star number three!', es: '¡Toca la estrella número tres!' } },
        { key: '4', say: { en: 'Tap star number four!', es: '¡Toca la estrella número cuatro!' } },
        { key: '5', say: { en: 'Tap star number five!', es: '¡Toca la estrella número cinco!' } },
      ],
    },
  },

  {
    id: 'baptism',
    color: '#b3e5fc',
    title: { en: 'Jesus Is Baptized', es: 'El Bautismo de Jesús' },
    lesson: { en: 'God the Father, Jesus the Son, and the Holy Spirit love you!', es: '¡Dios Padre, Jesús el Hijo y el Espíritu Santo te aman!' },
    cover: 2,
    pages: [
      {
        text: { en: 'John baptized people in the Jordan River.', es: 'Juan bautizaba a la gente en el río Jordán.' },
        scene: { bg: 'river', items: [['person', 140, 318, 1, { robe: '#ef9a9a', scarf: '#ffcc80' }, 'bob'], ['person', 250, 322, 0.95, { robe: '#a5d6a7', hair: '#212121' }, 'bob'], ['person', 580, 410, 1.3, { ...JOHN, arms: 'up' }, ''], ['raw', 0, 0, 1, IN_RIVER], ['reeds', 880, 410, 1.2, {}, 'sway'], ['sun', 860, 100, 0.9, {}, '']] },
      },
      {
        text: { en: 'Jesus came to the river and asked John to baptize Him.', es: 'Jesús llegó al río y le pidió a Juan que lo bautizara.' },
        scene: { bg: 'river', items: [['person', 420, 405, 1.35, JESUS, ''], ['person', 610, 410, 1.3, JOHN, ''], ['raw', 0, 0, 1, IN_RIVER], ['reeds', 160, 410, 1.3, {}, 'sway'], ['bird', 820, 150, 0.5, {}, 'drift']] },
      },
      {
        text: { en: 'When Jesus came up out of the water, the Holy Spirit came down like a dove.', es: 'Cuando Jesús salió del agua, el Espíritu Santo descendió como una paloma.' },
        scene: { bg: 'river', items: [['heavenLight', 470, 20, 1, { h: 380 }], ['cloud', 470, 40, 1.3, {}, ''], ['bird', 470, 190, 1, DOVE, 'bob'], ['person', 470, 405, 1.35, { ...JESUS, arms: 'up' }, ''], ['person', 680, 410, 1.25, { ...JOHN, mood: 'open' }, ''], ['raw', 0, 0, 1, IN_RIVER]] },
      },
      {
        text: { en: "A voice from heaven said, 'This is my Son, whom I love!'", es: "Una voz del cielo dijo: '¡Este es mi Hijo amado!'" },
        scene: { bg: 'river', items: [['heavenLight', 500, 20, 1, { h: 400 }], ['cloud', 500, 40, 1.4, {}, ''], ['sparkle', 360, 120, 0.6, {}, 'twinkle'], ['sparkle', 640, 110, 0.7, {}, 'twinkle'], ['bird', 500, 200, 0.9, DOVE, 'bob'], ['person', 500, 405, 1.35, { ...JESUS, arms: 'up' }, ''], ['heart', 620, 300, 0.6, {}, 'pulse'], ['raw', 0, 0, 1, IN_RIVER]] },
      },
    ],
    game: {
      type: 'memory',
      bg: 'river',
      prompt: { en: 'Find the matching pairs!', es: '¡Encuentra las parejas!' },
      pairs: [
        { key: 'father', art: 'sparkle', s: 1.1, say: { en: 'God the Father', es: 'Dios Padre' } },
        { key: 'son', art: 'person', opts: JESUS, s: 0.85, y: 6, say: { en: "Jesus, God's Son", es: 'Jesús, el Hijo de Dios' } },
        { key: 'spirit', art: 'bird', opts: DOVE, s: 1.2, say: { en: 'The Holy Spirit', es: 'El Espíritu Santo' } },
      ],
    },
  },
  {
    id: 'storm',
    color: '#90a4ae',
    title: { en: 'Jesus Calms the Storm', es: 'Jesús Calma la Tormenta' },
    lesson: { en: 'When we are scared, Jesus is with us.', es: 'Cuando tenemos miedo, Jesús está con nosotros.' },
    cover: 3,
    pages: [
      {
        text: { en: 'Jesus and His friends got into a boat to cross the lake.', es: 'Jesús y sus amigos subieron a una barca para cruzar el lago.' },
        scene: { bg: 'sea', items: [['person', 398, 312, 0.8, JESUS, ''], ['person', 598, 316, 0.75, FRIEND, ''], ['boat', 500, 360, 1.6, {}, 'rock'], ['sun', 160, 110, 0.9, {}, ''], ['bird', 760, 150, 0.5, {}, 'drift']] },
      },
      {
        text: { en: 'Jesus was very tired, so He fell asleep.', es: 'Jesús estaba muy cansado y se quedó dormido.' },
        scene: { bg: 'sea', items: [['person', 398, 314, 0.8, { ...JESUS, mood: 'sleep', arms: 'pray' }, ''], ['person', 598, 316, 0.75, FRIEND2, ''], ['boat', 500, 360, 1.6, {}, 'rock'], ['moon', 830, 110, 0.7, {}, '']] },
      },
      {
        text: { en: 'Whoosh! A big storm came. The friends were scared!', es: '¡Fuuu! Vino una gran tormenta. ¡Los amigos tenían miedo!' },
        scene: { bg: 'storm', items: [['cloud', 230, 90, 1.4, { rain: true, color: '#90a4ae' }, 'drift'], ['cloud', 760, 80, 1.5, { rain: true, color: '#90a4ae' }, 'drift'], ['person', 398, 314, 0.8, { ...JESUS, mood: 'sleep', arms: 'pray' }, ''], ['person', 598, 314, 0.75, { ...FRIEND, mood: 'open', arms: 'up' }, 'hop'], ['boat', 500, 360, 1.6, {}, 'rock'], ['waves', 300, 420, 1, { color: '#5aa8e6', w: 700 }, 'drift'], ['waves', 700, 470, 1, { color: '#5aa8e6', w: 700 }, 'drift']] },
      },
      {
        text: { en: "Jesus said, 'Quiet! Be still!' The wind stopped, and the sea was calm.", es: "Jesús dijo: '¡Calla! ¡Quédate quieto!' El viento se detuvo y el mar se calmó." },
        scene: { bg: 'sea', items: [['sun', 820, 110, 1, {}, ''], ['rainbow', 500, 330, 3.4], ['person', 398, 312, 0.8, { ...JESUS, arms: 'up' }, ''], ['person', 598, 316, 0.75, { ...FRIEND, arms: 'up' }, 'hop'], ['boat', 500, 360, 1.6], ['heart', 300, 200, 0.5, {}, 'pulse']] },
      },
    ],
    game: {
      type: 'collect',
      mode: 'transform',
      bg: 'storm',
      prompt: { en: 'Tap the storm clouds to calm the storm!', es: '¡Toca las nubes de tormenta para calmar la tormenta!' },
      decor: [['person', 398, 412, 0.8, { ...JESUS, arms: 'up' }, ''], ['person', 598, 416, 0.75, FRIEND, ''], ['boat', 500, 460, 1.6, {}, 'rock'], ['waves', 500, 540, 1, { color: '#5aa8e6', w: 900 }, 'drift']],
      items: [
        { art: 'cloud', x: 130, y: 110, s: 1, opts: { rain: true, color: '#78909c' }, after: { rain: false, color: '#ffffff' }, anim: 'drift' },
        { art: 'cloud', x: 360, y: 80, s: 1, opts: { rain: true, color: '#78909c' }, after: { rain: false, color: '#ffffff' }, anim: 'drift' },
        { art: 'cloud', x: 620, y: 90, s: 1, opts: { rain: true, color: '#78909c' }, after: { rain: false, color: '#ffffff' }, anim: 'drift' },
        { art: 'cloud', x: 860, y: 120, s: 1, opts: { rain: true, color: '#78909c' }, after: { rain: false, color: '#ffffff' }, anim: 'drift' },
        { art: 'cloud', x: 240, y: 260, s: 0.9, opts: { rain: true, color: '#78909c' }, after: { rain: false, color: '#ffffff' }, anim: 'drift' },
        { art: 'cloud', x: 770, y: 270, s: 0.9, opts: { rain: true, color: '#78909c' }, after: { rain: false, color: '#ffffff' }, anim: 'drift' },
      ],
    },
  },
  {
    id: 'sheep',
    color: '#c5e1a5',
    title: { en: 'The Lost Sheep', es: 'La Oveja Perdida' },
    lesson: { en: 'Jesus is our Good Shepherd. He always looks for you!', es: 'Jesús es nuestro Buen Pastor. ¡Él siempre te busca!' },
    cover: 3,
    pages: [
      {
        text: { en: 'A shepherd had one hundred sheep. He loved every one of them.', es: 'Un pastor tenía cien ovejas. Las amaba a todas.' },
        scene: { bg: 'day', items: [['person', 180, 400, 1.3, SHEPHERD, ''], ['sheep', 380, 430, 0.8, {}, 'hop'], ['sheep', 500, 450, 0.75, {}, 'bob'], ['sheep', 620, 425, 0.8, {}, 'hop'], ['sheep', 740, 455, 0.75, {}, 'bob'], ['sheep', 860, 430, 0.8, {}, 'hop'], ['sun', 860, 100, 0.9, {}, ''], ['cloud', 420, 110, 0.8, {}, 'drift']] },
      },
      {
        text: { en: 'One little sheep wandered away and got lost.', es: 'Una ovejita se alejó y se perdió.' },
        scene: { bg: 'day', items: [['tree', 700, 390, 1.4, {}, 'sway'], ['bush', 560, 450, 1.1], ['sheep', 880, 440, 0.6, {}, 'hop'], ['person', 120, 420, 0.9, SHEPHERD, ''], ['sheep', 240, 455, 0.55, {}, 'bob'], ['sheep', 310, 450, 0.55, {}, 'bob'], ['cloud', 400, 100, 0.9, {}, 'drift']] },
      },
      {
        text: { en: 'The shepherd looked and looked, behind the rocks and under the trees.', es: 'El pastor buscó y buscó, detrás de las rocas y debajo de los árboles.' },
        scene: { bg: 'day', items: [['rock', 200, 460, 1.1], ['tree', 800, 390, 1.5, {}, 'sway'], ['bush', 640, 460, 1], ['person', 430, 400, 1.3, { ...SHEPHERD, arms: 'up', mood: 'open' }, 'hop'], ['sun', 120, 100, 0.8, {}, '']] },
      },
      {
        text: { en: 'He found it! He carried it home, and everyone celebrated!', es: '¡La encontró! La llevó a casa, ¡y todos celebraron!' },
        scene: { bg: 'day', items: [['person', 430, 400, 1.4, { ...SHEPHERD, arms: 'hold' }, ''], ['sheep', 432, 432, 0.6, {}, 'bob'], ['person', 650, 410, 1, FRIEND2, 'hop'], ['person', 760, 415, 0.95, { scarf: '#f48fb1', robe: '#f8bbd0', arms: 'up' }, 'hop'], ['heart', 430, 180, 0.8, {}, 'pulse'], ['sheep', 220, 455, 0.6, {}, 'hop']] },
      },
    ],
    game: {
      type: 'seek',
      bg: 'day',
      finds: 3,
      prompt: { en: 'Where is the little sheep? Tap the bushes to look!', es: '¿Dónde está la ovejita? ¡Toca los arbustos para buscar!' },
      notHere: { en: 'Not here! Keep looking!', es: '¡Aquí no! ¡Sigue buscando!' },
      found: { en: 'You found the sheep!', es: '¡Encontraste la oveja!' },
      decoys: ['bunny', 'bird'],
      decor: [['person', 90, 410, 1, SHEPHERD, ''], ['sun', 900, 90, 0.8, {}, ''], ['cloud', 500, 90, 0.8, {}, 'drift']],
      spots: [[270, 375], [510, 355], [750, 375], [310, 510], [550, 520], [800, 510]],
    },
  },
];

// Bible order on the home screen.
const ORDER = ['creation', 'noah', 'moses', 'david', 'jonah', 'daniel', 'nativity', 'baptism', 'storm', 'loaves', 'sheep'];
export const STORIES = ORDER.map((id) => ALL.find((s) => s.id === id));

export const byId = (id) => STORIES.find((s) => s.id === id);
