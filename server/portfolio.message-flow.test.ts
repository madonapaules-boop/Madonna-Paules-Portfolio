import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultPortfolioContent } from "../shared/portfolioContent";
import { createOwnerSession, OWNER_DASHBOARD_EMAIL, OWNER_SESSION_COOKIE } from "./ownerAuth";

const inbox: Array<{ id: number; senderName: string; senderEmail: string; subject: string; body: string; isRead: boolean; createdAt: Date }> = [];

vi.mock("./db", () => ({
  getPortfolioContent: vi.fn(async () => defaultPortfolioContent),
  savePortfolioContent: vi.fn(async (content: unknown) => content),
  createContactMessage: vi.fn(async (values: { senderName: string; senderEmail: string; subject: string; body: string }) => {
    inbox.push({ id: inbox.length + 1, ...values, isRead: false, createdAt: new Date() });
    return { success: true } as const;
  }),
  listContactMessages: vi.fn(async () => [...inbox]),
  markContactMessageRead: vi.fn(async (id: number, isRead: boolean) => {
    const message = inbox.find(item => item.id === id);
    if (message) message.isRead = isRead;
    return { success: true } as const;
  }),
  getOverviewStats: vi.fn(async () => ({ projectCount: 3, certificateCount: 3, messageCount: inbox.length, unreadCount: inbox.filter(item => !item.isRead).length })),
}));

import { appRouter } from "./routers";

describe("public contact message flow", () => {
  beforeEach(() => { inbox.splice(0, inbox.length); });

  it("delivers a public message to the owner inbox and toggles its read state", async () => {
    const publicCaller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: {} }, res: { cookie() {}, clearCookie() {} } } as any);
    const token = await createOwnerSession(OWNER_DASHBOARD_EMAIL);
    const ownerCaller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: { cookie: `${OWNER_SESSION_COOKIE}=${token}` } }, res: { cookie() {}, clearCookie() {} } } as any);

    await expect(publicCaller.portfolio.sendMessage({ senderName: "Test Sender", senderEmail: "test@example.com", subject: "Portfolio question", body: "This message verifies the public inbox flow." })).resolves.toEqual({ success: true });
    expect(await ownerCaller.portfolio.admin.messages()).toMatchObject([{ senderName: "Test Sender", isRead: false }]);

    await ownerCaller.portfolio.admin.markMessageRead({ id: 1, isRead: true });
    expect(await ownerCaller.portfolio.admin.messages()).toMatchObject([{ id: 1, isRead: true }]);
  });
});
