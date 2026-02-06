import { WebhookEvent } from '@clerk/nextjs/server';
import { getPayloadClient } from './payload';

export async function syncUserToPayload(evt: WebhookEvent) {
  const payload = await getPayloadClient()

  switch (evt.type) {
    case 'user.created':
        console.log('User created event received:', evt)
      await payload.create({
        collection: 'users',
        data: {
          clerkId: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          firstName: evt.data.first_name || '',
          lastName: evt.data.last_name || '',
        },
      });
      break;

    case 'user.updated':
      const existing = await payload.find({
        collection: 'users',
        where: { clerkId: { equals: evt.data.id } },
      });

      if (existing.docs[0]) {
        await payload.update({
          collection: 'users',
          id: existing.docs[0].id,
          data: {
            email: evt.data.email_addresses[0].email_address,
            firstName: evt.data.first_name || '',
            lastName: evt.data.last_name || '',
          },
        });
      }
      break;

    case 'user.deleted':
      const user = await payload.find({
        collection: 'users',
        where: { clerkId: { equals: evt.data.id! } },
      });

      if (user.docs[0]) {
        await payload.delete({
          collection: 'users',
          id: user.docs[0].id,
        });
      }
      break;
  }
}