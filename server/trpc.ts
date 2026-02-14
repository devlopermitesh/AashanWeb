import { Context } from "@/trpc/init";
import { initTRPC } from "@trpc/server";

const t = initTRPC.context<Context>().create();

export const createrouter = t.router;
export const publicProcedure = t.procedure;
export const createCaller = t.createCallerFactory;
