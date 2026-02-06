// app/api/webhooks/clerk/route.ts (Next.js App Router)
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { syncUserToPayload } from '@/lib/clerk-sync';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET');
  }

  // Get headers
  const headerPayload =await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  // Get body
  const payload_body = await req.json();
  const body = JSON.stringify(payload_body);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Webhook verification failed', { status: 400 });
  }


  await syncUserToPayload(evt);



  return new Response('Webhook processed', { status: 200 });
}
