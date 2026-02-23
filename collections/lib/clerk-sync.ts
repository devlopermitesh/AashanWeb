import { clerkClient, type WebhookEvent } from '@clerk/nextjs/server'
import { getPayloadClient } from './payload'

type AppRole = 'org:shop_owner' | 'super-admin' | 'user'

type ClerkEmailAddress = {
  id?: string | null
  email_address?: string | null
}

type ClerkUserWebhookData = {
  id: string
  first_name?: string | null
  last_name?: string | null
  primary_email_address_id?: string | null
  email_addresses?: ClerkEmailAddress[]
  public_metadata?: {
    roles?: unknown
  }
}

type ClerkOrgWebhookData = {
  id: string
  name?: string | null
  slug?: string | null
}

type UserShopRelation = {
  id?: string | null
  shop: string
}

const DEFAULT_ROLE: AppRole = 'user'
const SHOP_OWNER_ROLE: AppRole = 'org:shop_owner'
const VALID_ROLES: readonly AppRole[] = ['org:shop_owner', 'super-admin', 'user']

const sanitizeRoles = (roles: unknown, fallback: AppRole[] = [DEFAULT_ROLE]): AppRole[] => {
  if (!Array.isArray(roles)) return fallback

  const filtered = roles.filter((role): role is AppRole => VALID_ROLES.includes(role as AppRole))
  return filtered.length ? Array.from(new Set(filtered)) : fallback
}

const extractIncomingRoles = (roles: unknown): AppRole[] | undefined => {
  if (!Array.isArray(roles)) return undefined
  const filtered = roles.filter((role): role is AppRole => VALID_ROLES.includes(role as AppRole))
  return filtered.length ? Array.from(new Set(filtered)) : undefined
}

const mergeRoles = (existingRoles: unknown, add: AppRole[]): AppRole[] => {
  const normalized = sanitizeRoles(existingRoles, [DEFAULT_ROLE])
  return Array.from(new Set([...normalized, ...add]))
}

const resolvePrimaryEmail = (user: ClerkUserWebhookData): string | undefined => {
  const byPrimaryId = user.email_addresses?.find(
    (emailAddress) => emailAddress.id === user.primary_email_address_id
  )?.email_address

  const fallback = user.email_addresses?.[0]?.email_address
  const email = (byPrimaryId || fallback || '').trim().toLowerCase()

  return email || undefined
}

async function upsertPayloadUserFromClerk(data: ClerkUserWebhookData) {
  const payload = await getPayloadClient()
  const email = resolvePrimaryEmail(data)
  const incomingRoles = extractIncomingRoles(data.public_metadata?.roles)
  const firstName = data.first_name || ''
  const lastName = data.last_name || ''

  if (!email) {
    return null
  }

  const existingByClerkId = await payload.find({
    collection: 'users',
    where: { clerkUserId: { equals: data.id } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingByClerkId.docs[0]) {
    const nextRoles =
      incomingRoles || sanitizeRoles(existingByClerkId.docs[0].roles, [DEFAULT_ROLE])

    return payload.update({
      collection: 'users',
      id: existingByClerkId.docs[0].id,
      overrideAccess: true,
      data: {
        email,
        firstName,
        lastName,
        roles: nextRoles,
      },
    })
  }

  const existingByEmail = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingByEmail.docs[0]) {
    const nextRoles = incomingRoles || sanitizeRoles(existingByEmail.docs[0].roles, [DEFAULT_ROLE])

    return payload.update({
      collection: 'users',
      id: existingByEmail.docs[0].id,
      overrideAccess: true,
      data: {
        clerkUserId: data.id,
        firstName,
        lastName,
        roles: nextRoles,
      },
    })
  }

  return payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      clerkUserId: data.id,
      email,
      firstName,
      lastName,
      roles: incomingRoles || [DEFAULT_ROLE],
    },
  })
}

async function addShopToUser(clerkUserId: string, shopId: string) {
  const payload = await getPayloadClient()

  const existingUser = await payload.find({
    collection: 'users',
    where: { clerkUserId: { equals: clerkUserId } },
    limit: 1,
    overrideAccess: true,
  })

  const user = existingUser.docs[0]
  if (!user) return

  const existingShops = (user.shops || []).reduce<UserShopRelation[]>((acc, relation) => {
    if (!relation?.shop) return acc

    const relationShopId =
      typeof relation.shop === 'string' ? relation.shop : String(relation.shop.id || '')

    if (!relationShopId) return acc

    acc.push({
      id: relation.id || undefined,
      shop: relationShopId,
    })
    return acc
  }, [])

  if (existingShops.some((shopRelation) => shopRelation.shop === shopId)) return

  await payload.update({
    collection: 'users',
    id: user.id,
    overrideAccess: true,
    data: {
      shops: [...existingShops, { shop: shopId }],
    },
  })
}

async function assignShopOwnerRole(clerkUserId: string) {
  const payload = await getPayloadClient()
  const client = await clerkClient()

  const existingUser = await payload.find({
    collection: 'users',
    where: { clerkUserId: { equals: clerkUserId } },
    limit: 1,
    overrideAccess: true,
  })

  const user = existingUser.docs[0]
  const nextRoles = mergeRoles(user?.roles, [SHOP_OWNER_ROLE])

  await client.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      roles: nextRoles,
    },
  })

  if (user) {
    await payload.update({
      collection: 'users',
      id: user.id,
      overrideAccess: true,
      data: {
        roles: nextRoles,
      },
    })
  }
}

async function ensurePayloadUserExists(clerkUserId: string) {
  const payload = await getPayloadClient()
  const existingUser = await payload.find({
    collection: 'users',
    where: { clerkUserId: { equals: clerkUserId } },
    limit: 1,
    overrideAccess: true,
  })

  if (existingUser.docs[0]) {
    return existingUser.docs[0]
  }

  const client = await clerkClient()
  const clerkUser = await client.users.getUser(clerkUserId)
  const primaryEmail =
    clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ||
    clerkUser.emailAddresses[0]?.emailAddress ||
    ''

  const email = primaryEmail.trim().toLowerCase()
  if (!email) return null

  return payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      clerkUserId,
      email,
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      roles: [DEFAULT_ROLE],
    },
  })
}

export async function syncUserToPayload(evt: WebhookEvent) {
  const payload = await getPayloadClient()

  switch (evt.type) {
    case 'user.created': {
      const data = evt.data as ClerkUserWebhookData
      const roles = sanitizeRoles(data.public_metadata?.roles, [DEFAULT_ROLE])

      await (
        await clerkClient()
      ).users.updateUserMetadata(data.id, {
        publicMetadata: {
          roles,
        },
      })

      await upsertPayloadUserFromClerk(data)
      return
    }

    case 'user.updated': {
      const data = evt.data as ClerkUserWebhookData
      await upsertPayloadUserFromClerk(data)
      return
    }

    case 'user.deleted': {
      const clerkUserId = evt.data.id
      if (!clerkUserId) return

      const user = await payload.find({
        collection: 'users',
        where: { clerkUserId: { equals: clerkUserId } },
        limit: 1,
        overrideAccess: true,
      })

      if (user.docs[0]) {
        await payload.delete({
          collection: 'users',
          id: user.docs[0].id,
          overrideAccess: true,
        })
      }
      return
    }

    case 'organization.created': {
      const orgData = evt.data as ClerkOrgWebhookData
      const client = await clerkClient()

      const memberships = await client.organizations.getOrganizationMembershipList({
        organizationId: orgData.id,
      })

      const preferredMember =
        memberships.data.find((membership) => membership.role === SHOP_OWNER_ROLE) ||
        memberships.data.find((membership) => Boolean(membership.publicUserData?.userId))

      const creatorUserId = preferredMember?.publicUserData?.userId
      if (!creatorUserId) return

      await ensurePayloadUserExists(creatorUserId)
      await assignShopOwnerRole(creatorUserId)

      const existingShop = await payload.find({
        collection: 'shops',
        where: { organizationId: { equals: orgData.id } },
        limit: 1,
        overrideAccess: true,
      })

      let ShopDoc = existingShop.docs?.[0]
      if (!ShopDoc) {
        ShopDoc = await payload.create({
          collection: 'shops',
          overrideAccess: true,
          data: {
            organizationId: evt.data.id,
            name: orgData.name || `Organization ${orgData.id}`,
            slug: orgData.slug || `org-${orgData.id}`,
          },
        })
      }
      await addShopToUser(creatorUserId, ShopDoc.id)
      return
    }

    case 'organization.updated': {
      const orgData = evt.data as ClerkOrgWebhookData
      const existingShop = await payload.find({
        collection: 'shops',
        where: { organizationId: { equals: orgData.id } },
        limit: 1,
        overrideAccess: true,
      })

      if (!existingShop.docs[0]) return

      await payload.update({
        collection: 'shops',
        id: existingShop.docs[0].id,
        overrideAccess: true,
        data: {
          ...(orgData.name ? { name: orgData.name } : {}),
          ...(orgData.slug ? { slug: orgData.slug } : {}),
        },
      })
      return
    }

    case 'organization.deleted': {
      const orgData = evt.data as ClerkOrgWebhookData
      const existingShop = await payload.find({
        collection: 'shops',
        where: { organizationId: { equals: orgData.id } },
        limit: 1,
        overrideAccess: true,
      })

      if (existingShop.docs[0]) {
        await payload.delete({
          collection: 'shops',
          id: existingShop.docs[0].id,
          overrideAccess: true,
        })
      }
      return
    }

    default:
      return
  }
}
