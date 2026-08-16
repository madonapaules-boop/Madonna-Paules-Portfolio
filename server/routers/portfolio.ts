import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPortfolioContent, savePortfolioContent } from "../db";
import { hasOwnerSession } from "../ownerAuth";
import { publicProcedure, router } from "../_core/trpc";

const urlOrEmpty = z.union([z.string().url(), z.literal("")]);
const skillInput = z.object({ category: z.string().trim().min(1).max(80), items: z.array(z.string().trim().min(1).max(80)).max(30) });
const projectInput = z.object({ name: z.string().trim().min(1).max(180), year: z.string().trim().min(1).max(12), stack: z.array(z.string().trim().min(1).max(80)).max(30), description: z.string().trim().min(1).max(4000) });
const certificationInput = z.object({ title: z.string().trim().min(1).max(180), issuer: z.string().trim().min(1).max(180) });

export const portfolioContentInput = z.object({
  profile: z.object({
    name: z.string().trim().min(1).max(120),
    title: z.string().trim().min(1).max(180),
    bio: z.string().trim().min(1).max(4000),
    email: z.string().email(),
    phone: z.string().trim().min(6).max(60),
    location: z.string().trim().min(1).max(180),
    linkedinUrl: urlOrEmpty,
    githubUrl: urlOrEmpty,
  }),
  skills: z.array(skillInput).min(1).max(12),
  projects: z.array(projectInput).max(20),
  education: z.object({ degree: z.string().trim().min(1).max(220), university: z.string().trim().min(1).max(220), period: z.string().trim().min(1).max(40), coursework: z.string().trim().min(1).max(2000) }),
  certifications: z.array(certificationInput).max(20),
  languages: z.array(z.string().trim().min(1).max(120)).max(12),
});

const ownerProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!(await hasOwnerSession(ctx.req.headers.cookie))) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Owner session is required" });
  }
  return next();
});

export const portfolioRouter = router({
  publicData: publicProcedure.query(() => getPortfolioContent()),
  adminData: ownerProcedure.query(() => getPortfolioContent()),
  save: ownerProcedure.input(portfolioContentInput).mutation(({ input }) => savePortfolioContent(input)),
});
