import { getPayload } from 'payload'
import config from '@payload-config' 

/**
 * Global variable to cache the payload instance in development.
 * This prevents multiple initializations during Hot Module Replacement (HMR).
 */
let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = { client: null, promise: null }
}

export const getPayloadClient = async () => {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = getPayload({ config })
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}
