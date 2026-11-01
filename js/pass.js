// Play time in the App Store build: the first 20 minutes are free, then a grown-up
// can buy a 12-hour pass. The website has nothing to buy with, so it stays free.
//
// The pass is an App Store non-renewing subscription sold by the native Pass plugin
// (ios/App/App/PassPlugin.swift). The plugin works out when paid time ends from the
// App Store's own signed transactions, so a pass survives a reinstall and follows the
// family's Apple ID to their other devices. Free minutes are counted on the device.

import { store } from './store.js';

export const FREE_MINUTES = 20;
export const PASS_HOURS = 12;
export const PRODUCT_ID = 'com.dancruz.biblestorypals.pass12h';

const cap = typeof window !== 'undefined' ? window.Capacitor : null;
export const paywalled = !!(cap?.isNativePlatform?.() && cap.PluginHeaders?.some((h) => h.name === 'Pass'));

let until = 0; // when paid play ends, in ms
let price = ''; // the App Store's localized price, e.g. "$1.99"
const call = (method) => cap.nativePromise('Pass', method, {});
const keep = (r) => {
  if (typeof r?.until === 'number') until = r.until;
  return r;
};

export const freeLeft = () => Math.max(0, FREE_MINUTES * 60 - (store.get('played') || 0));
export const passUntil = () => until;
export const passLeft = () => Math.max(0, until - Date.now());
export const canPlay = () => !paywalled || passLeft() > 0 || freeLeft() > 0;
export const priceLabel = () => price || '$1.99';

export async function refresh() {
  if (!paywalled) return;
  try { keep(await call('status')); } catch { /* keep what we had */ }
}

export async function loadPrice() {
  if (!paywalled || price) return;
  try { price = (await call('product')).price || ''; } catch { /* the fallback label is fine */ }
}

// Resolves to { until } once paid, { pending } while a parent's Ask to Buy approval
// is waiting, { cancelled }, or { error } when the App Store can't sell it right now.
export async function buy() {
  try { return keep(await call('buy')); } catch (e) { return { error: e?.message || String(e) }; }
}

export async function restore() {
  try { return keep(await call('restore')); } catch (e) { return { error: e?.message || String(e) }; }
}

// Spends free seconds while the app is on screen and `playing()` says a child is in
// a story or game. A tablet left asleep doesn't use up free time.
export function startClock(playing) {
  if (!paywalled) return;
  let last = Date.now();
  setInterval(() => {
    const now = Date.now();
    const dt = Math.min(15, (now - last) / 1000);
    last = now;
    if (document.visibilityState !== 'visible' || !playing() || passLeft() > 0 || freeLeft() <= 0) return;
    store.set('played', (store.get('played') || 0) + dt);
  }, 5000);
  // An Ask to Buy approval or a purchase on another device can land while the app is away.
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') refresh(); });
}
