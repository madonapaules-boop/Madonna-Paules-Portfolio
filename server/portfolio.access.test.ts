import { describe, expect, it } from "vitest";
import { defaultPortfolioContent } from "../shared/portfolioContent";
import { createOwnerSession, OWNER_DASHBOARD_EMAIL, OWNER_SESSION_COOKIE } from "./ownerAuth";
import { appRouter } from "./routers";

function createPublicContext() {
  return {
    user: null,
    req: { protocol: "https", headers: {} },
    res: { cookie() {}, clearCookie() {} },
  } as any;
}

describe("portfolio router access", () => {
  it("provides public content while refusing dashboard data without an owner session", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const publicContent = await caller.portfolio.publicData();

    expect(publicContent.profile.name).toBe("Madonna Paules Bishay");
    await expect(caller.portfolio.adminData()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.portfolio.save(defaultPortfolioContent)).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("persists an owner edit and exposes it through the public portfolio route", async () => {
    const token = await createOwnerSession(OWNER_DASHBOARD_EMAIL);
    const ownerCaller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: { cookie: `${OWNER_SESSION_COOKIE}=${token}` } },
      res: { cookie() {}, clearCookie() {} },
    } as any);
    const original = await ownerCaller.portfolio.adminData();
    const edited = {
      ...original,
      profile: { ...original.profile, location: `${original.profile.location} (save test)` },
    };

    try {
      await ownerCaller.portfolio.save(edited);
      const publicContent = await appRouter.createCaller(createPublicContext()).portfolio.publicData();
      expect(publicContent.profile.location).toBe(edited.profile.location);
    } finally {
      await ownerCaller.portfolio.save(original);
    }
  });
});
