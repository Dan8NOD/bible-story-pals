// What's open in the App Store build: the first three stories are free, any other story
// is a one-time purchase, and one purchase can unlock everything left in a world. Two
// voice-guided prayers are free and each other one costs what a story does. The website
// has nothing to buy with, so every story and prayer stays open there.
//
// Products are sold by the native Unlocks plugin (ios/App/App/UnlocksPlugin.swift), which
// reads what a family owns from the App Store's signed transactions. The last answer is
// kept on the device so stories stay open while that answer is on its way.

import { store } from './store.js';
import { WORLDS, worldOf } from './stories.js';
import { PRAYERS, FREE_PRAYERS } from './prayers.js';

export const FREE_STORIES = ['creation', 'noah', 'moses'];
const BASE = 'com.dancruz.biblestorypals';
export const storyProduct = (id) => `${BASE}.story.${id}`;
export const worldProduct = (id) => `${BASE}.world.${id}`;
export const prayerProduct = (id) => `${BASE}.prayer.${id}`;

const cap = typeof window !== 'undefined' ? window.Capacitor : null;
export const paywalled = !!(cap?.isNativePlatform?.() && cap.PluginHeaders?.some((h) => h.name === 'Unlocks'));

let prices = {}; // the App Store's localized prices, e.g. "$0.99"
const call = (method, options = {}) => cap.nativePromise('Unlocks', method, options);
const keep = (r) => {
  if (Array.isArray(r?.owned)) store.set('owned', r.owned);
  return r;
};
const owns = (product) => (store.get('owned') || []).includes(product);

export const isOpen = (storyId) => !paywalled
  || FREE_STORIES.includes(storyId)
  || owns(storyProduct(storyId))
  || owns(worldProduct(worldOf(storyId).id));
export const prayerOpen = (id) => !paywalled || FREE_PRAYERS.includes(id) || owns(prayerProduct(id));
export const lockedIn = (world) => world.stories.filter((id) => !isOpen(id));

// The App Store's own price once it has answered, otherwise the plain list price.
export const priceOf = (product) => prices[product] || (product.includes('.world.') ? '$2' : '$1');

export async function refresh() {
  if (!paywalled) return;
  try { keep(await call('status')); } catch { /* keep what we had */ }
}

export async function loadPrices() {
  if (!paywalled) return;
  const ids = [
    ...WORLDS.flatMap((w) => [worldProduct(w.id), ...w.stories.filter((id) => !FREE_STORIES.includes(id)).map(storyProduct)]),
    ...PRAYERS.filter((p) => !FREE_PRAYERS.includes(p.id)).map((p) => prayerProduct(p.id)),
  ];
  try { prices = { ...prices, ...(await call('products', { ids })).prices }; } catch { /* the list prices are fine */ }
}

// Resolves to { owned } once paid, { pending } while a parent's Ask to Buy approval is
// waiting, { cancelled }, or { error } when the App Store can't sell it right now.
export async function buy(product) {
  try { return keep(await call('buy', { id: product })); } catch (e) { return { error: e?.message || String(e) }; }
}

export async function restore() {
  try { return keep(await call('restore')); } catch (e) { return { error: e?.message || String(e) }; }
}
