import { useTheme } from "@/contexts/ThemeContext";
import { navigation, portfolio } from "@/lib/portfolioData";
import {
  ArrowUpRight,
  Check,
  Code2,
  FileText,
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
import React, { useEffect, useState } from "react";

type SectionId = (typeof navigation)[number]["id"];

function scrollToSection(id: SectionId) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SectionId>("about");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observers = navigation.map(({ id }) => {
      const node = document.getElementById(id);
      if (!node) return null;
      const observer = new IntersectionObserver(
        entries => {
          if (entries.some(entry => entry.isIntersecting)) setActiveSection(id);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0.01 }
      );
      observer.observe(node);
      return observer;
    });
    return () => observers.forEach(observer => observer?.disconnect());
  }, []);

  const navigate = (id: SectionId) => {
    setActiveSection(id);
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <main className="portfolio" data-testid="portfolio-app">
      <div className="background-grid" aria-hidden="true" />
      <div className="pink-glow glow-one" aria-hidden="true" />
      <div className="pink-glow glow-two" aria-hidden="true" />

      <div className="portfolio-layout">
        <aside className="identity-rail" aria-label="Profile summary">
          <div className="portrait-shell">
            <div className="avatar-placeholder" aria-label="Profile photo placeholder">
              <UserRound size={86} strokeWidth={1.15} />
            </div>
          </div>

          <p className="system-label">SYSTEM // 01</p>
          <h2 className="rail-name">Madonna Paules Bishay</h2>
          <p className="rail-role">Full-Stack Developer</p>

          <div className="rail-rule" />
          <div className="rail-contact">
            <a href={`mailto:${portfolio.email}`}><Mail size={15} /><span><b>Email</b>{portfolio.email}</span></a>
            <a href={`tel:${portfolio.phone.replaceAll(" ", "")}`}><Phone size={15} /><span><b>Phone</b>{portfolio.phone}</span></a>
            <span><MapPin size={15} /><span><b>Location</b>{portfolio.location}</span></span>
            <a href="#" onClick={event => event.preventDefault()} aria-label="LinkedIn placeholder"><Linkedin size={15} /><span><b>LinkedIn</b>LinkedIn</span></a>
          </div>
        </aside>

        <div className="content-canvas">
          <header className="topbar">
            <button className="brand" type="button" onClick={() => navigate("about")} aria-label="Madonna Paules Bishay home">
              <span className="brand-mark">M</span>
              <span>Madonna Paules Bishay</span>
            </button>
            <nav className="desktop-nav" aria-label="Portfolio sections">
              {navigation.map(item => (
                <button
                  className={activeSection === item.id ? "active" : ""}
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="header-actions">
              <button
                className="theme-toggle"
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                data-testid="theme-toggle"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button className="menu-toggle" type="button" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation menu">
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
            {menuOpen && (
              <nav className="mobile-nav" aria-label="Mobile portfolio sections">
                {navigation.map(item => (
                  <button className={activeSection === item.id ? "active" : ""} key={item.id} onClick={() => navigate(item.id)} type="button">
                    {item.label}
                  </button>
                ))}
              </nav>
            )}
          </header>

          <section className="hero section-anchor" id="about" aria-labelledby="hero-heading">
            <div className="hero-card">
              <div className="hero-tech-lines" aria-hidden="true"><i /><i /><i /><i /></div>
              <div className="hero-content">
                <p className="hero-location"><MapPin size={15} />{portfolio.location}</p>
                <h1 id="hero-heading">Madonna Paules Bishay</h1>
                <p className="hero-title">Full-Stack Developer</p>
                <p className="hero-bio">{portfolio.bio}</p>
                <button className="hero-cv" type="button" disabled aria-disabled="true"><FileText size={17} />View CV</button>
              </div>
            </div>
          </section>

          <section className="section-wrap about-section section-anchor" aria-labelledby="about-heading">
            <div className="section-heading"><span>01</span><div><p>About</p><h2 id="about-heading">About</h2></div></div>
            <div className="education-card">
              <GraduationCap size={28} />
              <div>
                <p className="card-kicker">Education</p>
                <h3>{portfolio.education.degree}</h3>
                <p>{portfolio.education.university} · {portfolio.education.period}</p>
                <p className="coursework">{portfolio.education.coursework}</p>
              </div>
            </div>
          </section>

          <section className="section-wrap section-anchor" id="skills" aria-labelledby="skills-heading">
            <div className="section-heading"><span>02</span><div><p>Skills</p><h2 id="skills-heading">Skills</h2></div></div>
            <div className="skills-grid">
              {portfolio.skills.map((group, index) => (
                <article className="skill-card" key={group.category}>
                  <p><span>0{index + 1}</span>{group.category}</p>
                  <div>{group.items.map(skill => <span key={skill}>{skill}</span>)}</div>
                </article>
              ))}
            </div>
          </section>

          <section className="section-wrap section-anchor" id="work" aria-labelledby="work-heading">
            <div className="section-heading"><span>03</span><div><p>Work</p><h2 id="work-heading">Work</h2></div></div>
            <div className="projects-grid">
              {portfolio.projects.map((project, index) => (
                <article className="project-card" key={project.name}>
                  <div className="project-card-top"><span>0{index + 1}</span><Code2 size={20} /></div>
                  <div><p className="project-year">{project.year}</p><h3>{project.name}</h3><p className="project-description">{project.description}</p></div>
                  <div className="tag-list">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div>
                </article>
              ))}
            </div>
          </section>

          <section className="section-wrap section-anchor" id="credentials" aria-labelledby="credentials-heading">
            <div className="section-heading"><span>04</span><div><p>Credentials</p><h2 id="credentials-heading">Credentials</h2></div></div>
            <div className="credentials-grid">
              <article className="credentials-card"><p className="card-kicker">Certifications</p><div className="certificate-list">
                {portfolio.certifications.map((certificate, index) => <div className="certificate" key={certificate.title}><span>0{index + 1}</span><div><h3>{certificate.title}</h3><p>{certificate.issuer}</p></div><Check size={18} /></div>)}
              </div></article>
              <article className="language-card"><p className="card-kicker">Languages</p>{portfolio.languages.map((language, index) => <p key={language}><span>0{index + 1}</span>{language}</p>)}</article>
            </div>
          </section>

          <section className="contact-section section-anchor" id="contact" aria-labelledby="contact-heading">
            <div className="section-heading"><span>05</span><div><p>Contact</p><h2 id="contact-heading">Contact</h2></div></div>
            <div className="contact-links">
              <a href={`mailto:${portfolio.email}`}><Mail size={20} /><span>{portfolio.email}</span><ArrowUpRight size={18} /></a>
              <a href={`tel:${portfolio.phone.replaceAll(" ", "")}`}><Phone size={20} /><span>{portfolio.phone}</span><ArrowUpRight size={18} /></a>
            </div>
          </section>

          <footer><button className="brand" type="button" onClick={() => navigate("about")}><span className="brand-mark">M</span><span>Madonna Paules Bishay</span></button><p>Full-Stack Developer</p></footer>
        </div>
      </div>
    </main>
  );
}
