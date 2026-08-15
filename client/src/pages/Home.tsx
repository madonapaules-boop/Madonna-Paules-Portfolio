import { useTheme } from "@/contexts/ThemeContext";
import { navigation, portfolio } from "@/lib/portfolioData";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
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
          const visible = entries.find(entry => entry.isIntersecting);
          if (visible) setActiveSection(id);
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
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
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="site-header">
        <button className="wordmark" type="button" onClick={() => navigate("about")} aria-label="Madonna Paules Bishay home">
          <span className="wordmark-mark">M</span>
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
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen(open => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile portfolio sections">
            {navigation.map(item => (
              <button
                className={activeSection === item.id ? "active" : ""}
                key={item.id}
                onClick={() => navigate(item.id)}
                type="button"
              >
                {item.label}
                <ChevronRight size={16} />
              </button>
            ))}
          </nav>
        )}
      </header>

      <section className="hero section-anchor" id="about">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Full-Stack Developer</p>
          <h1>Madonna <em>Paules</em> Bishay</h1>
          <p className="hero-intro">{portfolio.bio}</p>
          <div className="hero-actions">
            <button className="cv-button" type="button" disabled aria-disabled="true">
              <FileText size={17} /> View CV
            </button>
          </div>
        </div>
        <aside className="profile-panel" aria-label="Profile details">
          <div className="avatar-placeholder" aria-label="Profile photo placeholder"><UserRound size={58} strokeWidth={1.25} /></div>
          <div className="profile-title"><span>01</span><p>{portfolio.title}</p></div>
          <div className="contact-list">
            <a href={`mailto:${portfolio.email}`}><Mail size={17} /><span>{portfolio.email}</span></a>
            <a href={`tel:${portfolio.phone.replaceAll(" ", "")}`}><Phone size={17} /><span>{portfolio.phone}</span></a>
            <span><MapPin size={17} /><span>{portfolio.location}</span></span>
            <a href="#" onClick={event => event.preventDefault()} aria-label="LinkedIn placeholder"><Linkedin size={17} /><span>LinkedIn</span></a>
          </div>
        </aside>
      </section>

      <section className="about-section section-anchor section-wrap" aria-labelledby="about-heading">
        <div className="section-lead">
          <p className="section-number">01</p>
          <div>
            <h2 id="about-heading">About</h2>
          </div>
        </div>
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

      <section className="skills-section section-anchor section-wrap" id="skills" aria-labelledby="skills-heading">
        <div className="section-lead">
          <p className="section-number">02</p>
          <div>
            <h2 id="skills-heading">Skills</h2>
          </div>
        </div>
        <div className="skills-grid">
          {portfolio.skills.map((group, index) => (
            <article className="skill-card" key={group.category}>
              <p><span>0{index + 1}</span>{group.category}</p>
              <div>{group.items.map(skill => <span key={skill}>{skill}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="work-section section-anchor section-wrap" id="work" aria-labelledby="work-heading">
        <div className="section-lead">
          <p className="section-number">03</p>
          <div>
            <h2 id="work-heading">Work</h2>
          </div>
        </div>
        <div className="projects-grid">
          {portfolio.projects.map((project, index) => (
            <article className="project-card" key={project.name}>
              <div className="project-card-top"><span>0{index + 1}</span><Code2 size={20} /></div>
              <div>
                <p className="project-year">{project.year}</p>
                <h3>{project.name}</h3>
                <p className="project-description">{project.description}</p>
              </div>
              <div className="tag-list">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="credentials-section section-anchor section-wrap" id="credentials" aria-labelledby="credentials-heading">
        <div className="section-lead">
          <p className="section-number">04</p>
          <div>
            <h2 id="credentials-heading">Credentials</h2>
          </div>
        </div>
        <div className="credentials-grid">
          <article className="credentials-card">
            <p className="card-kicker">Certifications</p>
            <div className="certificate-list">
              {portfolio.certifications.map((certificate, index) => (
                <div className="certificate" key={certificate.title}>
                  <span>0{index + 1}</span><div><h3>{certificate.title}</h3><p>{certificate.issuer}</p></div><Check size={18} />
                </div>
              ))}
            </div>
          </article>
          <article className="language-card">
            <p className="card-kicker">Languages</p>
            {portfolio.languages.map((language, index) => <p key={language}><span>0{index + 1}</span>{language}</p>)}
          </article>
        </div>
      </section>

      <section className="contact-section section-anchor" id="contact" aria-labelledby="contact-heading">
        <div>
          <p className="section-number">05</p>
          <h2 id="contact-heading">Contact</h2>
        </div>
        <div className="contact-cta">
          <a className="contact-line" href={`mailto:${portfolio.email}`}><Mail size={20} />{portfolio.email}<ArrowUpRight size={18} /></a>
          <a className="contact-line" href={`tel:${portfolio.phone.replaceAll(" ", "")}`}><Phone size={20} />{portfolio.phone}<ArrowUpRight size={18} /></a>
        </div>
      </section>

      <footer>
        <button className="wordmark" type="button" onClick={() => navigate("about")}><span className="wordmark-mark">M</span><span>Madonna Paules Bishay</span></button>
        <p>Full-Stack Developer</p>
      </footer>
    </main>
  );
}
