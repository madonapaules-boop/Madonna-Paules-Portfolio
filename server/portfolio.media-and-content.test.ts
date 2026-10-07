import { describe, expect, it } from "vitest";
import { defaultPortfolioContent } from "../shared/portfolioContent";
import { hasExpectedFileSignature, portfolioContentInput } from "./routers/portfolio";
import { appRouter } from "./routers";

describe("portfolio bilingual content and media validation", () => {
  it("accepts the complete bilingual portfolio content model", () => {
    expect(portfolioContentInput.safeParse(defaultPortfolioContent).success).toBe(true);
    expect(defaultPortfolioContent.profile.nameAr).toBe("مادونا بولس بشاي");
    expect(defaultPortfolioContent.projects[0]?.descriptionAr).toBeTruthy();
    expect(defaultPortfolioContent.projects[0]).toMatchObject({ projectUrl: "#", githubUrl: "#", galleryImages: expect.arrayContaining(["placeholder"]), imageKey: "" });
  });

  it("validates image and PDF binary signatures before upload", () => {
    expect(hasExpectedFileSignature(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), "image/png")).toBe(true);
    expect(hasExpectedFileSignature(Buffer.from("%PDF-1.7", "ascii"), "application/pdf")).toBe(true);
    expect(hasExpectedFileSignature(Buffer.from("not-a-pdf", "ascii"), "application/pdf")).toBe(false);
  });

  it("rejects incomplete public contact messages before persisting them", async () => {
    const caller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: {} }, res: { cookie() {}, clearCookie() {} } } as any);
    await expect(caller.portfolio.sendMessage({ senderName: "A", senderEmail: "not-an-email", subject: "Hi", body: "Short" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
