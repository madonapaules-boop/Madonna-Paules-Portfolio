// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "./Home";

vi.mock("@/lib/trpc", () => ({
  trpc: {
    portfolio: {
      publicData: {
        useQuery: () => ({ data: undefined, isLoading: false }),
      },
      sendMessage: {
        useMutation: () => ({ mutate: vi.fn(), isPending: false, isSuccess: false, isError: false }),
      },
    },
  },
}));

class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

function renderPortfolio() {
  return render(
    <ThemeProvider defaultTheme="light" switchable>
      <Home />
    </ThemeProvider>
  );
}

describe("portfolio interactions", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("switches between the light and dark palettes from the theme toggle", async () => {
    const user = userEvent.setup();
    renderPortfolio();

    const toggle = screen.getByRole("button", { name: "Switch to dark mode" });
    await user.click(toggle);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeTruthy();
  });

  it("shows one selected portfolio section and marks its navigation item active", () => {
    renderPortfolio();
    const skillsButton = screen.getAllByRole("button", { name: "Skills" })[0];

    fireEvent.click(skillsButton);

    expect(skillsButton.classList.contains("active")).toBe(true);
    expect(screen.getByText("Languages")).toBeTruthy();
    expect(screen.queryByText("Dona Store")).toBeNull();
  });

  it("renders project preview controls and a full-project action in Work", () => {
    renderPortfolio();
    fireEvent.click(screen.getAllByRole("button", { name: "Work" })[0]);

    expect(screen.getAllByText("Project Image")).toHaveLength(3);
    expect(screen.getAllByRole("button", { name: "Next project image" })).toHaveLength(3);
    expect(screen.getAllByRole("button", { name: "View full project" })).toHaveLength(3);
    expect(screen.getAllByRole("link", { name: "Placeholder link — add the real URL from the dashboard" })).toHaveLength(6);
  });
});
