import { count, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { contactMessages, portfolioContent, type InsertUser, users } from "../drizzle/schema";
import { defaultPortfolioContent, type PortfolioContent } from "../shared/portfolioContent";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

function object(value: unknown): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function list(value: unknown): unknown[] { return Array.isArray(value) ? value : []; }
function normalizeContent(value: unknown): PortfolioContent {
  const raw = object(value);
  const rawProfile = object(raw.profile);
  const skills = list(raw.skills).map((item, index) => ({ ...defaultPortfolioContent.skills[index % defaultPortfolioContent.skills.length], ...object(item) })) as PortfolioContent["skills"];
  const projects = list(raw.projects).map((item, index) => ({ ...defaultPortfolioContent.projects[index % defaultPortfolioContent.projects.length], ...object(item) })) as PortfolioContent["projects"];
  const certifications = list(raw.certifications).map((item, index) => ({ ...defaultPortfolioContent.certifications[index % defaultPortfolioContent.certifications.length], ...object(item) })) as PortfolioContent["certifications"];
  const languages = list(raw.languages).map((item, index) => typeof item === "string" ? { ...defaultPortfolioContent.languages[index % defaultPortfolioContent.languages.length], label: item } : { ...defaultPortfolioContent.languages[index % defaultPortfolioContent.languages.length], ...object(item) }) as PortfolioContent["languages"];
  return {
    profile: { ...defaultPortfolioContent.profile, ...rawProfile },
    skills: skills.length ? skills : defaultPortfolioContent.skills,
    projects: projects.length ? projects : defaultPortfolioContent.projects,
    education: { ...defaultPortfolioContent.education, ...object(raw.education) },
    certifications: certifications.length ? certifications : defaultPortfolioContent.certifications,
    languages: languages.length ? languages : defaultPortfolioContent.languages,
  };
}
function parseContent(row: typeof portfolioContent.$inferSelect): PortfolioContent {
  try { return normalizeContent({ profile: JSON.parse(row.profileJson), skills: JSON.parse(row.skillsJson), projects: JSON.parse(row.projectsJson), education: JSON.parse(row.educationJson), certifications: JSON.parse(row.certificationsJson), languages: JSON.parse(row.languagesJson) }); } catch { return defaultPortfolioContent; }
}

export async function getPortfolioContent(): Promise<PortfolioContent> { const db = await getDb(); if (!db) return defaultPortfolioContent; const [row] = await db.select().from(portfolioContent).where(eq(portfolioContent.id, 1)).limit(1); return row ? parseContent(row) : defaultPortfolioContent; }
export async function savePortfolioContent(content: PortfolioContent): Promise<PortfolioContent> { const db = await getDb(); if (!db) throw new Error("Database is not available"); const normalized = normalizeContent(content); const values = { id: 1, profileJson: JSON.stringify(normalized.profile), skillsJson: JSON.stringify(normalized.skills), projectsJson: JSON.stringify(normalized.projects), educationJson: JSON.stringify(normalized.education), certificationsJson: JSON.stringify(normalized.certifications), languagesJson: JSON.stringify(normalized.languages) }; await db.insert(portfolioContent).values(values).onDuplicateKeyUpdate({ set: values }); return normalized; }

export async function createContactMessage(values: { senderName: string; senderEmail: string; subject: string; body: string }) { const db = await getDb(); if (!db) throw new Error("Database is not available"); await db.insert(contactMessages).values(values); return { success: true } as const; }
export async function listContactMessages() { const db = await getDb(); if (!db) return []; return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)); }
export async function markContactMessageRead(id: number, isRead: boolean) { const db = await getDb(); if (!db) throw new Error("Database is not available"); await db.update(contactMessages).set({ isRead }).where(eq(contactMessages.id, id)); return { success: true } as const; }
export async function getOverviewStats() { const [content, messages] = await Promise.all([getPortfolioContent(), listContactMessages()]); return { projectCount: content.projects.length, certificateCount: content.certifications.length, messageCount: messages.length, unreadCount: messages.filter(message => !message.isRead).length }; }

export async function upsertUser(user: InsertUser): Promise<void> { if (!user.openId) throw new Error("User openId is required for upsert"); const db = await getDb(); if (!db) return; const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() }; const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn }; (["name", "email", "loginMethod"] as const).forEach(field => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } }); values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user"); if (user.role !== undefined) updateSet.role = values.role; await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet }); }
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }
