import { getPayloadClient } from '@/collections/lib/payload'
import { BasePayload } from 'payload'

const REFUND_POLICIES = ['30-days', '15-days', '10-days', '5-days'] as const

const randomPrice = () => Math.floor(Math.random() * (5000 - 199 + 1)) + 199

const randomRefund = () => REFUND_POLICIES[Math.floor(Math.random() * REFUND_POLICIES.length)]

export async function seedProducts(payload: BasePayload) {
  console.log('🌱 Seeding products...')

  // 1️⃣ fetch all subcategories (leaf categories)
  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
    where: {
      parent: { exists: true }, // 👈 only subcategories
    },
  })

  if (!categories.docs.length) {
    throw new Error('❌ No subcategories found')
  }

  // 2️⃣ product name templates
  const PRODUCT_NAMES = [
    'Premium Canvas Art',
    'Handcrafted Wall Poster',
    'Gaming Mouse Pro',
    'Mechanical Keyboard RGB',
    'Travel Backpack 45L',
    'Noise Cancelling Headphones',
    'Organic Grocery Pack',
    'Smart LED Strip',
    'Desk Organizer Minimal',
    'Wireless Controller',
  ]

  let created = 0

  // 3️⃣ create products
  for (let i = 0; i < 30; i++) {
    const category = categories.docs[Math.floor(Math.random() * categories.docs.length)]

    const name = PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)] + ` #${i + 1}`

    await payload.create({
      collection: 'products',
      data: {
        name,
        description: `Dummy description for ${name}. Perfect for testing UI, filters, and pricing.`,
        price: randomPrice(),
        category: category.id, // 🔗 relationship
        refundpolicy: randomRefund(),
        medias: [], // optional (can add later)
      },
    })

    created++
  }

  console.log(`✅ ${created} products seeded successfully`)
}
const run = async () => {
  const payload = await getPayloadClient()

  await seedProducts(payload)
  process.exit(0)
}

run()
