import { getPayloadClient } from '@/collections/lib/payload'
import { BasePayload } from 'payload'

type TagSeed = {
  name: string
  products: string[]
}

const TAGS: TagSeed[] = [
  {
    name: 'Gaming',
    products: ['6996c805852f40127c44cee9', '6996c805852f40127c44cedd', '6996c805852f40127c44ced9'],
  },
  {
    name: 'Accessories',
    products: ['6996c805852f40127c44ced9', '6996c804852f40127c44ced1'],
  },
  {
    name: 'Travel',
    products: ['6996c805852f40127c44cee5', '6996c804852f40127c44ced5'],
  },
  {
    name: 'Home Decor',
    products: ['6996c805852f40127c44cee1'],
  },
  {
    name: 'Workspace',
    products: ['6996c804852f40127c44cec5'],
  },
]

export const seedTags = async (payload: BasePayload) => {
  console.log('🌱 Seeding tags...')

  for (const tag of TAGS) {
    const existing = await payload.find({
      collection: 'tags',
      where: {
        name: {
          equals: tag.name,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`⚠️  Tag "${tag.name}" already exists, skipping`)
      continue
    }

    await payload.create({
      collection: 'tags',
      data: {
        name: tag.name,
        products: tag.products,
      },
    })

    console.log(`✅ Created tag: ${tag.name}`)
  }

  console.log('🎉 Tags seeded successfully')
}

const run = async () => {
  const payload = await getPayloadClient()

  await seedTags(payload)
  process.exit(0)
}

run()
