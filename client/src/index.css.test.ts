import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./index.css", import.meta.url), "utf8");

describe("mobile profile rail styles", () => {
  it("keeps the profile image and contact rail rendered on phone layouts", () => {
    expect(css).toContain("@media (max-width: 760px) { .portfolio { padding: 0; }.portfolio-layout { display: block; border: 0; border-radius: 0; }.identity-rail { display: grid;");
    expect(css).toContain("@media (max-width: 760px) { .portfolio .identity-rail { display: grid !important;");
    expect(css).toContain(".identity-rail .rail-contact { grid-column: 1 / -1; grid-template-columns: repeat(2, minmax(0, 1fr));");
    expect(css).not.toContain(".identity-rail { display: none; }");
  });
});

describe("portfolio readable typography", () => {
  it("keeps secondary copy above the previous tiny sizes and enlarges mobile profile text", () => {
    expect(css).toContain(".rail-contact > * { display: flex; align-items: flex-start; gap: 10px; color: var(--body); font-size: 11px;");
    expect(css).toContain(".hero-bio { max-width: 730px; margin: 0 0 25px; color: var(--body-strong); font-size: 14px;");
    expect(css).toContain(".project-description { margin: 0; color: var(--body); font-size: 12px;");
    expect(css).toContain(".identity-rail .rail-contact > * { gap: 7px; font-size: 10px;");
    expect(css).toContain(".identity-rail .rail-role { align-self: start; margin: 2px 0 0; font-size: 11px;");
  });
});
