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
