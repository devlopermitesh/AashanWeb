import mongoose from 'mongoose'

type UserDoc = {
  _id: unknown
  email?: string
  clerkId?: string
  clerkUserId?: string
}

async function run() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error(
      'Missing DATABASE_URL. Run with environment loaded (for example: node --env-file=.env --import tsx seeds/fix-clerk-user-id.ts).'
    )
  }

  await mongoose.connect(databaseUrl)

  try {
    const users = mongoose.connection.db.collection<UserDoc>('users')

    const beforeCount = await users.countDocuments({ clerkId: { $exists: true } })
    console.log(`Found ${beforeCount} user docs with legacy clerkId field`)

    if (beforeCount === 0) {
      console.log('No migration needed')
      return
    }

    const sample = await users
      .find(
        { clerkId: { $exists: true } },
        { projection: { _id: 1, email: 1, clerkId: 1, clerkUserId: 1 } }
      )
      .limit(5)
      .toArray()

    console.log('Sample legacy docs:', sample)

    const moveResult = await users.updateMany(
      {
        clerkId: { $exists: true },
        clerkUserId: { $exists: false },
      },
      [{ $set: { clerkUserId: '$clerkId' } }, { $unset: 'clerkId' }]
    )

    const unsetResult = await users.updateMany(
      { clerkId: { $exists: true } },
      { $unset: { clerkId: '' } }
    )

    const afterCount = await users.countDocuments({ clerkId: { $exists: true } })

    console.log('Migration complete')
    console.log({
      movedToClerkUserId: moveResult.modifiedCount,
      removedLegacyField: unsetResult.modifiedCount,
      remainingLegacyDocs: afterCount,
    })
  } finally {
    await mongoose.disconnect()
  }
}

run()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to run clerk field migration', error)
    process.exit(1)
  })
