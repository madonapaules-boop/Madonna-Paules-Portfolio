import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createContactMessage, getOverviewStats, getPortfolioContent, listContactMessages, markContactMessageRead, savePortfolioContent } from "../db";
import { hasOwnerSession } from "../ownerAuth";
import { storagePut } from "../storage";
import { publicProcedure, router } from "../_core/trpc";

const urlOrEmpty = z.union([z.string().url(), z.string().regex(/^\/manus-storage\/[a-zA-Z0-9_./-]+$/), z.literal("")]);
const localized = z.object({ en: z.string().trim().min(1).max(4000), ar: z.string().trim().min(1).max(4000) });
const skillInput = z.object({ category: z.string().trim().min(1).max(80), categoryAr: z.string().trim().min(1).max(80), items: z.array(z.string().trim().min(1).max(80)).max(30) });
const projectInput = z.object({ name: z.string().trim().min(1).max(180), nameAr: z.string().trim().min(1).max(180), year: z.string().trim().min(1).max(12), stack: z.array(z.string().trim().min(1).max(80)).max(30), description: z.string().trim().min(1).max(4000), descriptionAr: z.string().trim().min(1).max(4000), projectUrl: urlOrEmpty, imageUrl: urlOrEmpty, imageKey: z.string().max(500) });
const certificationInput = z.object({ title: z.string().trim().min(1).max(180), titleAr: z.string().trim().min(1).max(180), issuer: z.string().trim().min(1).max(180) });

export const portfolioContentInput = z.object({
  profile: z.object({ name: z.string().trim().min(1).max(120), nameAr: z.string().trim().min(1).max(120), title: z.string().trim().min(1).max(180), titleAr: z.string().trim().min(1).max(180), bio: z.string().trim().min(1).max(4000), bioAr: z.string().trim().min(1).max(4000), availability: z.string().trim().max(220), availabilityAr: z.string().trim().max(220), training: z.string().trim().max(220), trainingAr: z.string().trim().max(220), email: z.string().email(), phone: z.string().trim().min(6).max(60), location: z.string().trim().min(1).max(180), locationAr: z.string().trim().min(1).max(180), linkedinUrl: urlOrEmpty, githubUrl: urlOrEmpty, instagramUrl: urlOrEmpty, avatarUrl: urlOrEmpty, avatarKey: z.string().max(500), cvUrl: urlOrEmpty, cvKey: z.string().max(500) }),
  skills: z.array(skillInput).min(1).max(12), projects: z.array(projectInput).max(20), education: z.object({ degree: z.string().trim().min(1).max(220), degreeAr: z.string().trim().min(1).max(220), university: z.string().trim().min(1).max(220), universityAr: z.string().trim().min(1).max(220), period: z.string().trim().min(1).max(40), coursework: z.string().trim().min(1).max(2000), courseworkAr: z.string().trim().min(1).max(2000) }), certifications: z.array(certificationInput).max(20), languages: z.array(z.object({ label: z.string().trim().min(1).max(120), labelAr: z.string().trim().min(1).max(120) })).max(12),
});
const ownerProcedure = publicProcedure.use(async ({ ctx, next }) => { if (!(await hasOwnerSession(ctx.req.headers.cookie))) throw new TRPCError({ code: "UNAUTHORIZED", message: "Owner session is required" }); return next(); });
const fileBase64 = z.string().min(20).max(11_200_000).regex(/^[a-zA-Z0-9+/=\s]+$/);
function safeName(value: string) { return value.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 140); }
export function hasExpectedFileSignature(buffer: Buffer, contentType: string) {
  if (contentType === "image/jpeg") return buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (contentType === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (contentType === "image/webp") return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  if (contentType === "application/pdf") return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  return false;
}
function verifiedBuffer(base64: string, contentType: string) { const buffer = Buffer.from(base64, "base64"); if (!hasExpectedFileSignature(buffer, contentType)) throw new TRPCError({ code: "BAD_REQUEST", message: "The uploaded file does not match its declared type" }); return buffer; }

export const portfolioRouter = router({
  publicData: publicProcedure.query(() => getPortfolioContent()),
  sendMessage: publicProcedure.input(z.object({ senderName: z.string().trim().min(2).max(140), senderEmail: z.string().email().max(320), subject: z.string().trim().min(3).max(220), body: z.string().trim().min(10).max(4000) })).mutation(({ input }) => createContactMessage(input)),
  adminData: ownerProcedure.query(() => getPortfolioContent()),
  save: ownerProcedure.input(portfolioContentInput).mutation(({ input }) => savePortfolioContent(input)),
  admin: router({
    overview: ownerProcedure.query(() => getOverviewStats()),
    messages: ownerProcedure.query(() => listContactMessages()),
    markMessageRead: ownerProcedure.input(z.object({ id: z.number().int().positive(), isRead: z.boolean() })).mutation(({ input }) => markContactMessageRead(input.id, input.isRead)),
    uploadImage: ownerProcedure.input(z.object({ base64: fileBase64.max(5_600_000), fileName: z.string().min(1).max(180), contentType: z.enum(["image/jpeg", "image/png", "image/webp"]) })).mutation(async ({ input }) => storagePut(`portfolio/owner/avatar/${Date.now()}-${safeName(input.fileName)}`, verifiedBuffer(input.base64, input.contentType), input.contentType)),
    uploadCv: ownerProcedure.input(z.object({ base64: fileBase64, fileName: z.string().min(1).max(180), contentType: z.literal("application/pdf") })).mutation(async ({ input }) => storagePut(`portfolio/owner/cv/${Date.now()}-${safeName(input.fileName).replace(/(?:\.pdf)?$/i, ".pdf")}`, verifiedBuffer(input.base64, input.contentType), input.contentType)),
    uploadProjectImage: ownerProcedure.input(z.object({ base64: fileBase64.max(5_600_000), fileName: z.string().min(1).max(180), contentType: z.enum(["image/jpeg", "image/png", "image/webp"]) })).mutation(async ({ input }) => storagePut(`portfolio/projects/${Date.now()}-${safeName(input.fileName)}`, verifiedBuffer(input.base64, input.contentType), input.contentType)),
  }),
});
