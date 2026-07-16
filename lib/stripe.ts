import Stripe from 'stripe'
const secret = process.env.STRIPE_SECRET_KEY!
if (!secret) {
  throw new Error('Strip Secret key is missing')
}
export const stripe = new Stripe(secret, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
})
