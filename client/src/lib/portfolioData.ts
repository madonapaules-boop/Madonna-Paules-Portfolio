import { defaultPortfolioContent } from "@shared/portfolioContent";

export const portfolio = {
  name: defaultPortfolioContent.profile.name,
  title: defaultPortfolioContent.profile.title,
  email: defaultPortfolioContent.profile.email,
  phone: defaultPortfolioContent.profile.phone,
  location: defaultPortfolioContent.profile.location,
  bio: defaultPortfolioContent.profile.bio,
  skills: defaultPortfolioContent.skills,
  projects: defaultPortfolioContent.projects,
  education: defaultPortfolioContent.education,
  certifications: defaultPortfolioContent.certifications,
  languages: defaultPortfolioContent.languages,
} as const;

export const navigation = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
] as const;
