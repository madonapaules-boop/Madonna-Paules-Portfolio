import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { portfolioContent, type InsertUser, users } from "../drizzle/schema";
import { defaultPortfolioContent, type PortfolioContent } from "../shared/portfolioContent";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

function parseContent(row: typeof portfolioContent.$inferSelect): PortfolioContent {
  try {
    return {
      profile: JSON.parse(row.profileJson),
      skills: JSON.parse(row.skillsJson),
      projects: JSON.parse(row.projectsJson),
      education: JSON.parse(row.educationJson),
      certifications: JSON.parse(row.certificationsJson),
      languages: JSON.parse(row.languagesJson),
    } as PortfolioContent;
  } catch {
    return defaultPortfolioContent;
  }
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const db = await getDb();
  if (!db) return defaultPortfolioContent;
  const [row] = await db.select().from(portfolioContent).where(eq(portfolioContent.id, 1)).limit(1);
  return row ? parseContent(row) : defaultPortfolioContent;
}

export async function savePortfolioContent(content: PortfolioContent): Promise<PortfolioContent> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values = {
    id: 1,
    profileJson: JSON.stringify(content.profile),
    skillsJson: JSON.stringify(content.skills),
    projectsJson: JSON.stringify(content.projects),
    educationJson: JSON.stringify(content.education),
    certificationsJson: JSON.stringify(content.certifications),
    languagesJson: JSON.stringify(content.languages),
  };
  await db.insert(portfolioContent).values(values).onDuplicateKeyUpdate({ set: values });
  return content;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  (["name", "email", "loginMethod"] as const).forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  if (user.role !== undefined) updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}
