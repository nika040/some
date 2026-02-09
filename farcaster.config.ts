const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const farcasterConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjI0MzIxNzIsInR5cGUiOiJhdXRoIiwia2V5IjoiMHhkODFlRjkyQjkwNTMyQWI4NTdDZThjRTE3RWNjZTEyMzYyNzk4M0YxIn0",
    payload: "eyJkb21haW4iOiJzb21lLWxpYXJkLnZlcmNlbC5hcHAifQ",
    signature: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGFA0KzXyyT8L1_i89KQqJtNPcWSxBWzFU9Uz_YmqgX9VQ0qyXKwwRMmcnhMenaQqaWw8rzeJg8_bq3ztYSTavaGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  },
  miniapp: {
    version: "1",
    name: "Word Sprint",
    subtitle: "A fast mini game of words",
    description: "Unscramble words, keep the streak, and rack up points.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["word", "game", "miniapp", "base"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`,
    tagline: "Unscramble, score, repeat.",
    ogTitle: "Word Sprint",
    ogDescription: "A fast-paced word scramble mini game.",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;

