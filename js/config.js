// Settings you're expected to edit.

// Donation page (Ko-fi, Buy Me a Coffee, PayPal.me, Stripe payment link…).
// Leave empty to hide the "Support" section. It only appears in the grown-ups
// area, behind the hold-to-open gate, and never inside the native store apps,
// where Apple and Google restrict donation links.
export const DONATE_URL = '';

// Tester builds open every story and prayer and hide everything about buying, the way the
// website does. The in-app purchases don't exist in App Store Connect yet, so without this
// a tester could only reach the three free stories. Set it to false for the build that goes
// to the App Store, once those purchases exist.
export const OPEN_FOR_TESTERS = true;

// Where the privacy policy lives on the web. The in-app policy names this address, so the
// page has to be published there before a build goes to the App Store.
export const POLICY_URL = 'dan8nod.github.io/torah-story-pals/privacy.html';
