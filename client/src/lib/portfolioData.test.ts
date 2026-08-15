import { describe, expect, it } from "vitest";
import { navigation, portfolio } from "./portfolioData";

describe("portfolio content", () => {
  it("preserves the required identity and contact data", () => {
    expect(portfolio.name).toBe("Madonna Paules Bishay");
    expect(portfolio.title).toBe("Full-Stack Developer");
    expect(portfolio.email).toBe("madonapaules@gmail.com");
    expect(portfolio.phone).toBe("+20 122 129 1984");
    expect(portfolio.location).toBe("Sohag, Egypt");
  });

  it("keeps the exact five section labels and all requested project names", () => {
    expect(navigation.map(item => item.label)).toEqual([
      "About",
      "Skills",
      "Work",
      "Credentials",
      "Contact",
    ]);
    expect(portfolio.projects.map(project => project.name)).toEqual([
      "Dona Store",
      "Feane Restaurant Website",
      "Spam Detection System",
    ]);
  });

  it("keeps certifications and language proficiency labels", () => {
    expect(portfolio.certifications).toEqual([
      { title: "Full-Stack Web Development", issuer: "Satr" },
      { title: "CCNA 1 & 2", issuer: "Cisco" },
      { title: "Device Configuration & Management", issuer: "IT Specialist" },
    ]);
    expect(portfolio.languages).toEqual([
      "Arabic (Native)",
      "English (Intermediate B1)",
    ]);
  });
});
