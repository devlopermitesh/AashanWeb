// trpc/init.ts
import { getPayloadClient } from "@/lib/payload";
import { cookies, headers } from "next/headers";
import "server-only";

export const createTRPCContext = async () => {
  const headersList = await headers();
  const cookieStore = await cookies();
  const payload = await getPayloadClient();
  return {
    db: payload,
    headers: headersList,
    cookies: cookieStore,
  };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
