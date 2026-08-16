import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";

describe("owner.login", () => {
  it("accepts the configured owner secret through the login API and creates a session cookie", async () => {
    const setCookie = vi.fn();
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} },
      res: { cookie: setCookie, clearCookie: vi.fn() },
    } as any);

    const result = await caller.owner.login({
      email: "madonapaules@gmail.com",
      password: process.env.OWNER_DASHBOARD_PASSWORD ?? "",
    });

    expect(result).toEqual({ authenticated: true });
    expect(setCookie).toHaveBeenCalledWith(
      "portfolio_owner_session",
      expect.any(String),
      expect.objectContaining({ httpOnly: true, secure: true })
    );
  });

  it("rejects a login attempt with an incorrect password", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} },
      res: { cookie: vi.fn(), clearCookie: vi.fn() },
    } as any);

    await expect(caller.owner.login({
      email: "madonapaules@gmail.com",
      password: "incorrect-password",
    })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
