export const CONVEX_URL = process.env.CONVEX_URL
if (!CONVEX_URL) {
  throw new Error('Missing CONVEX_URL')
}
