// Writes ios/App/App/Unlocks.storekit, the list of products Xcode uses to test purchases
// in the simulator, from the game's own stories, worlds and prayers. Run it after adding
// or renaming anything that can be bought: node tools/make-storekit.mjs
// App Store Connect needs the same products created by hand; --table prints them for that.
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WORLDS, byId } from '../js/stories.js';
import { PRAYERS, FREE_PRAYERS } from '../js/prayers.js';
import { FREE_STORIES, storyProduct, worldProduct, prayerProduct } from '../js/unlocks.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = { en: 'en_US', es: 'es_MX', he: 'he' };
const WORDS = {
  world: { en: (t) => `All of ${t}`, es: (t) => `Todo: ${t}`, he: (t) => `כל הסיפורים: ${t}` },
  story: { en: (t) => `Story: ${t}`, es: (t) => `Historia: ${t}`, he: (t) => `סיפור: ${t}` },
  prayer: { en: (t) => `Prayer: ${t}`, es: (t) => `Oración: ${t}`, he: (t) => `תפילה: ${t}` },
  about: { en: (n) => `Unlocks ${n}. One-time purchase.`, es: (n) => `Desbloquea ${n}. Compra única.`, he: (n) => `פותח את ${n}. רכישה חד-פעמית.` },
};

const items = [
  ...WORLDS.map((w) => ({ id: worldProduct(w.id), kind: 'world', title: w.title, price: '2.00' })),
  ...WORLDS.flatMap((w) => w.stories).filter((id) => !FREE_STORIES.includes(id))
    .map((id) => ({ id: storyProduct(id), kind: 'story', title: byId(id).title, price: '1.00' })),
  ...PRAYERS.filter((p) => !FREE_PRAYERS.includes(p.id)).map((p) => ({ id: prayerProduct(p.id), kind: 'prayer', title: p.title, price: '1.00' })),
];
const name = (it, l) => WORDS[it.kind][l](it.title[l]);

if (process.argv.includes('--table')) {
  console.log('| Product ID | Price | English name | Spanish name | Hebrew name |\n|---|---|---|---|---|');
  for (const it of items) console.log(`| \`${it.id}\` | $${it.price} | ${name(it, 'en')} | ${name(it, 'es')} | ${name(it, 'he')} |`);
  process.exit(0);
}

const file = {
  identifier: '70AA5701',
  nonRenewingSubscriptions: [],
  products: items.map((it, i) => ({
    displayPrice: it.price,
    familyShareable: true,
    internalID: String(6770000100 + i),
    localizations: Object.keys(LOCALES).map((l) => ({ description: WORDS.about[l](name(it, l)), displayName: name(it, l), locale: LOCALES[l] })),
    productID: it.id,
    referenceName: name(it, 'en'),
    type: 'NonConsumable',
  })),
  settings: { _failTransactionsEnabled: false, _locale: 'en_US', _storefront: 'USA' },
  subscriptionGroups: [],
  version: { major: 3, minor: 0 },
};
writeFileSync(join(root, 'ios/App/App/Unlocks.storekit'), `${JSON.stringify(file, null, 2)}\n`);
console.log(`Wrote ${items.length} products to ios/App/App/Unlocks.storekit`);
