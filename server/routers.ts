import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import {
  createOwnerSession,
  hasOwnerSession,
  OWNER_DASHBOARD_EMAIL,
  OWNER_SESSION_COOKIE,
  ownerSessionMaxAge,
  validateOwnerCredentials,
} from "./ownerAuth";
import { publicProcedure, router } from "./_core/trpc";
import { portfolioRouter } from "./routers/portfolio";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  owner: router({
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        if (!validateOwnerCredentials(input.email, input.password)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid owner credentials" });
        }
        const token = await createOwnerSession(OWNER_DASHBOARD_EMAIL);
        ctx.res.cookie(OWNER_SESSION_COOKIE, token, {
          ...getSessionCookieOptions(ctx.req),
          maxAge: ownerSessionMaxAge,
        });
        return { authenticated: true } as const;
      }),
    session: publicProcedure.query(async ({ ctx }) => ({
      authenticated: await hasOwnerSession(ctx.req.headers.cookie),
    })),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(OWNER_SESSION_COOKIE, {
        ...getSessionCookieOptions(ctx.req),
        maxAge: -1,
      });
      return { success: true } as const;
    }),
  }),

  portfolio: portfolioRouter,

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
