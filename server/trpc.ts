import type { Context } from '@/trpc/init'
import { TRPCError, initTRPC } from '@trpc/server'

const t = initTRPC.context<Context>().create()

export const createRouter = t.router
export const createrouter = createRouter
export const publicProcedure = t.procedure

export const createCaller = t.createCallerFactory

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})
export const protectedProcedure = t.procedure.use(isAuthed)
