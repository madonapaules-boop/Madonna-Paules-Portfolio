import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "../../..");
const styles = readFileSync(resolve(root, "client/src/index.css"), "utf8");
const app = readFileSync(resolve(root, "client/src/App.tsx"), "utf8");

describe("portfolio theme configuration", () => {
  it("defines the requested pink palettes for light and dark mode", () => {
    expect(styles).toContain("--page: #FFF6F9");
    expect(styles).toContain("--accent: #D4537E");
    expect(styles).toContain("--heading: #4B1528");
    expect(styles).toContain("--page: #2A1420");
    expect(styles).toContain("--accent: #F0899F");
    expect(styles).toContain("--heading: #FBE1EC");
  });

  it("enables the theme switcher and smooth scrolling", () => {
    expect(app).toContain("switchable");
    expect(styles).toContain("scroll-behavior: smooth");
  });
});
