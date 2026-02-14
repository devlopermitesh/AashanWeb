import { categoryRouter } from "@/modules/category/server/procedure/route";
import { createrouter, publicProcedure } from "../trpc";

export const appRouter = createrouter({
  hello: publicProcedure.query(() => {
    return { greeting: "hello world" };
  }),
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
