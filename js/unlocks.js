// What's open in the store builds: the app is free, the first three stories and two
// voice-guided prayers are free, and a grown-up can buy the rest once: a world's stories as
// a pack, the third prayer, or the Everything Pack. docs/product-sheet.md lists the products
// and prices. The website has nothing to buy with, so everything stays open there.
//
// Products are sold by the native Unlocks plugin: ios/App/App/UnlocksPlugin.swift (StoreKit 2)
// and android/.../UnlocksPlugin.java (Google Play Billing). Each reads what a family owns
// from the store's own signed records. The last answer is kept on the device so stories stay
// open while that answer is on its way. An Android build without the Play licensing key has
// no Unlocks plugin, so nothing is locked or sold there.

import { store } from './store.js';
import { WORLDS, worldOf } from './stories.js';
import { PRAYERS, FREE_PRAYERS } from './prayers.js';

export const FREE_STORIES = ['creation', 'noah', 'moses'];
const BASE = 'com.dancruz.biblestorypals';
export const storyProduct = (id) => `${BASE}.story.${id}`;
export const worldProduct = (id) => `${BASE}.world.${id}`;
export const prayerProduct = (id) => `${BASE}.prayer.${id}`;
export const bundleProduct = `${BASE}.bundle.everything`;

// Single stories were $1 each, below the $2 floor Dan set on 2026-11-26, so they are no longer
// offered. Their product ids are permanent in App Store Connect: a family that owns one keeps it.
export const SELL_SINGLE_STORIES = false;

const cap = typeof window !== 'undefined' ? window.Capacitor : null;
// Which store sells here, for the wording on the buy screens: 'play' or 'apple'.
export const STORE = cap?.getPlatform?.() === 'android' ? 'play' : 'apple';
export const paywalled = !!(cap?.isNativePlatform?.() && cap.PluginHeaders?.some((h) => h.name === 'Unlocks'));

let prices = {}; // the store's localized prices, e.g. "$0.99"
const call = (method, options = {}) => cap.nativePromise('Unlocks', method, options);
const keep = (r) => {
  if (Array.isArray(r?.owned)) store.set('owned', r.owned);
  return r;
};
const owns = (product) => (store.get('owned') || []).includes(product);

export const isOpen = (storyId) => !paywalled
  || FREE_STORIES.includes(storyId)
  || owns(storyProduct(storyId))
  || owns(worldProduct(worldOf(storyId).id))
  || owns(bundleProduct);
export const prayerOpen = (id) => !paywalled || FREE_PRAYERS.includes(id) || owns(prayerProduct(id)) || owns(bundleProduct);
export const lockedIn = (world) => world.stories.filter((id) => !isOpen(id));
// The Everything Pack is offered while anything is still locked.
export const offerBundle = () => paywalled
  && (WORLDS.some((w) => lockedIn(w).length) || PRAYERS.some((p) => !prayerOpen(p.id)));

// The store's own price once it has answered, otherwise the list price (docs/product-sheet.md).
const LIST_PRICE = { 'world.island': '$4.99', 'world.sea': '$2.99', 'bundle.everything': '$6.49' };
export const priceOf = (product) => prices[product] || LIST_PRICE[product.slice(BASE.length + 1)] || '$2.00';

export async function refresh() {
  if (!paywalled) return;
  try { keep(await call('status')); } catch { /* keep what we had */ }
}

export async function loadPrices() {
  if (!paywalled) return;
  const ids = [
    ...WORLDS.flatMap((w) => [worldProduct(w.id), ...(SELL_SINGLE_STORIES ? w.stories.filter((id) => !FREE_STORIES.includes(id)).map(storyProduct) : [])]),
    ...PRAYERS.filter((p) => !FREE_PRAYERS.includes(p.id)).map((p) => prayerProduct(p.id)),
    bundleProduct,
  ];
  try { prices = { ...prices, ...(await call('products', { ids })).prices }; } catch { /* the list prices are fine */ }
}

// Resolves to { owned } once paid, { pending } while a parent's approval or a slow payment
// (cash, pay later) is still waiting, { cancelled }, or { error } when the store can't sell
// it right now. Nothing opens while a purchase is pending.
export async function buy(product) {
  try { return keep(await call('buy', { id: product })); } catch (e) { return { error: e?.message || String(e) }; }
}

export async function restore() {
  try { return keep(await call('restore')); } catch (e) { return { error: e?.message || String(e) }; }
}
