import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { navigation } from "@/lib/portfolioData";
import { defaultPortfolioContent } from "@shared/portfolioContent";
import {
  ArrowUpRight,
  Check,
  Code2,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "wouter";

type SectionId = (typeof navigation)[number]["id"];

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return <a href={href || "#"} target={href ? "_blank" : undefined} rel={href ? "noreferrer" : undefined} onClick={href ? undefined : event => event.preventDefault()} aria-label={href ? label : `${label} placeholder`}>{children}</a>;
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SectionId>("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const { data, isLoading } = trpc.portfolio.publicData.useQuery();
  const content = data ?? defaultPortfolioContent;
  const { profile } = content;

  const navigate = (id: SectionId) => {
    setActiveSection(id);
    setMenuOpen(false);
  };

  const renderSection = () => {
    if (activeSection === "skills") return <section className="section-stage" id="skills"><SectionTitle index="02" label="Skills" /><div className="skills-grid">{content.skills.map((group, index) => <article className="skill-card" key={group.category}><p><span>0{index + 1}</span>{group.category}</p><div>{group.items.map(skill => <span key={skill}>{skill}</span>)}</div></article>)}</div></section>;
    if (activeSection === "work") return <section className="section-stage" id="work"><SectionTitle index="03" label="Work" /><div className="projects-grid">{content.projects.map((project, index) => <article className="project-card" key={`${project.name}-${index}`}><div className="project-card-top"><span>0{index + 1}</span><Code2 size={20} /></div><div><p className="project-year">{project.year}</p><h3>{project.name}</h3><p className="project-description">{project.description}</p></div><div className="tag-list">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div></article>)}</div></section>;
    if (activeSection === "credentials") return <section className="section-stage" id="credentials"><SectionTitle index="04" label="Credentials" /><div className="credentials-grid"><article className="credentials-card"><p className="card-kicker">Certifications</p><div className="certificate-list">{content.certifications.map((certificate, index) => <div className="certificate" key={`${certificate.title}-${index}`}><span>0{index + 1}</span><div><h3>{certificate.title}</h3><p>{certificate.issuer}</p></div><Check size={18} /></div>)}</div></article><article className="language-card"><p className="card-kicker">Languages</p>{content.languages.map((language, index) => <p key={`${language}-${index}`}><span>0{index + 1}</span>{language}</p>)}</article></div></section>;
    if (activeSection === "contact") return <section className="section-stage contact-stage" id="contact"><SectionTitle index="05" label="Contact" /><div className="contact-links"><a href={`mailto:${profile.email}`}><Mail size={20} /><span>{profile.email}</span><ArrowUpRight size={18} /></a><a href={`tel:${profile.phone.replaceAll(" ", "")}`}><Phone size={20} /><span>{profile.phone}</span><ArrowUpRight size={18} /></a></div></section>;
    return <section className="section-stage about-stage" id="about"><div className="hero-card"><div className="hero-tech-lines" aria-hidden="true"><i /><i /><i /><i /></div><div className="hero-content"><p className="hero-location"><MapPin size={15} />{profile.location}</p><h1>{profile.name}</h1><p className="hero-title">{profile.title}</p><p className="hero-bio">{profile.bio}</p><button className="hero-cv" type="button" disabled aria-disabled="true"><FileText size={17} />View CV</button></div></div><div className="about-footer"><div><p className="section-kicker">01 / About</p><h2>About</h2></div><div className="education-card"><GraduationCap size={28} /><div><p className="card-kicker">Education</p><h3>{content.education.degree}</h3><p>{content.education.university} · {content.education.period}</p><p className="coursework">{content.education.coursework}</p></div></div></div></section>;
  };

  return <main className="portfolio" data-testid="portfolio-app"><div className="background-grid" aria-hidden="true" /><div className="pink-glow glow-one" aria-hidden="true" /><div className="pink-glow glow-two" aria-hidden="true" /><div className="portfolio-layout"><aside className="identity-rail" aria-label="Profile summary"><div className="portrait-shell"><div className="avatar-placeholder" aria-label="Profile photo placeholder"><UserRound size={86} strokeWidth={1.15} /></div></div><p className="system-label">SYSTEM // 01</p><h2 className="rail-name">{profile.name}</h2><p className="rail-role">{profile.title}</p><div className="rail-rule" /><div className="rail-contact"><a href={`mailto:${profile.email}`}><Mail size={15} /><span><b>Email</b>{profile.email}</span></a><a href={`tel:${profile.phone.replaceAll(" ", "")}`}><Phone size={15} /><span><b>Phone</b>{profile.phone}</span></a><IconLink href={profile.linkedinUrl} label="LinkedIn"><Linkedin size={15} /><span><b>LinkedIn</b>LinkedIn</span></IconLink><IconLink href={profile.githubUrl} label="GitHub"><Github size={15} /><span><b>GitHub</b>GitHub</span></IconLink></div><nav className="rail-nav" aria-label="Portfolio sections">{navigation.map((item, index) => <button className={activeSection === item.id ? "active" : ""} key={item.id} onClick={() => navigate(item.id)} type="button"><span>0{index + 1}</span>{item.label}</button>)}</nav></aside><div className="content-canvas"><header className="topbar"><button className="brand" type="button" onClick={() => navigate("about")} aria-label="Madonna Paules Bishay home"><span className="brand-mark">M</span><span>{profile.name}</span></button><nav className="desktop-nav" aria-label="Portfolio sections">{navigation.map(item => <button className={activeSection === item.id ? "active" : ""} key={item.id} onClick={() => navigate(item.id)} type="button">{item.label}</button>)}</nav><div className="header-actions"><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} data-testid="theme-toggle">{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button><button className="menu-toggle" type="button" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation menu">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button></div>{menuOpen && <nav className="mobile-nav" aria-label="Mobile portfolio sections">{navigation.map(item => <button className={activeSection === item.id ? "active" : ""} key={item.id} onClick={() => navigate(item.id)} type="button">{item.label}</button>)}</nav>}</header><div className="content-status" aria-live="polite">{isLoading ? "Loading" : activeSection}</div>{renderSection()}<footer><button className="brand" type="button" onClick={() => navigate("about")}><span className="brand-mark">M</span><span>{profile.name}</span></button><div className="footer-links"><span>{profile.title}</span><Link href="/admin/login">Owner dashboard <ExternalLink size={14} /></Link></div></footer></div></div></main>;
}

function SectionTitle({ index, label }: { index: string; label: string }) { return <div className="section-heading"><span>{index}</span><div><p>{label}</p><h2>{label}</h2></div></div>; }
