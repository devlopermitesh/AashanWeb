import { getPayload, type Payload } from "payload";
import config from "@payload-config";

/**
 * Extend globalThis to store cached payload instance
 */
declare global {
  // eslint-disable-next-line no-var
  var payloadClient:
    | {
        client: Payload | null;
        promise: Promise<Payload> | null;
      }
    | undefined;
}

if (!globalThis.payloadClient) {
  globalThis.payloadClient = {
    client: null,
    promise: null,
  };
}

export const getPayloadClient = async (): Promise<Payload> => {
  const cached = globalThis.payloadClient!;

  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = getPayload({ config });
  }

  try {
    cached.client = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.client;
};
