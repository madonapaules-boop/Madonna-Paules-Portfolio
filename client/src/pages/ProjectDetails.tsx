import { ArrowLeft, ChevronLeft, ChevronRight, Github } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { defaultPortfolioContent, type ProjectEntry } from "@shared/portfolioContent";
import { PROJECT_IMAGE_PLACEHOLDER } from "@shared/projects";
import React, { useEffect, useState } from "react";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const placeholderLines = ["", "", "", "", ""];

function FakeProjectImage({ project, index }: { project: ProjectEntry; index: number }) {
  const image = project.galleryImages[index] ?? PROJECT_IMAGE_PLACEHOLDER;
  if (image !== PROJECT_IMAGE_PLACEHOLDER) return <img className="detail-real-image" src={image} alt={`${project.name} preview ${index + 1}`} />;
  return <div className="fake-project-image large" aria-label="Project Image placeholder"><div className="fake-window-bar"><i /><i /><i /></div><div className="fake-window-body"><div className="fake-sidebar"><b>{project.name.split(" ")[0]}</b><span /><span /><span /><span /></div><div className="fake-dashboard"><div className="fake-heading"><strong>Project Image</strong><em>⌁⌁⌁</em></div><div className="fake-stat-row"><i /><i /><i /><i /></div><div className="fake-chart"><div className="fake-bars"><b /><b /><b /><b /><b /></div><div className="fake-donut" /></div><div className="fake-table">{placeholderLines.map((_, row) => <span key={row}><i /><i /><i /></span>)}</div></div></div></div>;
}

export default function ProjectDetails() {
  const [, params] = useRoute("/project/:slug");
  const [, setLocation] = useLocation();
  const { data } = trpc.portfolio.publicData.useQuery();
  const content = data ?? defaultPortfolioContent;
  const project = content.projects.find(item => slugify(item.name) === params?.slug) ?? content.projects[0];
  const [active, setActive] = useState(0);
  if (!project) return null;
  const imageCount = project.galleryImages.length;
  const projectNumber = String(content.projects.indexOf(project) + 1).padStart(2, "0");
  const description = project.description.replace(/\s*GitHub:\s*https?:\/\/\S+/gi, "").trim();
  const showControls = imageCount > 1;
  const goTo = (index: number) => setActive((index + imageCount) % imageCount);
  useEffect(() => { setActive(0); }, [project.name]);
  useEffect(() => {
    if (!showControls) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % imageCount), 3000);
    return () => window.clearInterval(timer);
  }, [imageCount, project.name, showControls]);

  return <main className="project-detail-page"><div className="project-detail-shell"><header className="project-detail-nav"><button type="button" onClick={() => setLocation("/#work")}><ArrowLeft size={17} />Back to portfolio</button><span>PROJECT / {projectNumber}</span></header><div className="detail-main-grid"><section className="detail-gallery-section"><div className="detail-gallery-frame"><FakeProjectImage project={project} index={active} />{showControls && <><button className="detail-gallery-arrow left" type="button" aria-label="Previous project image" onClick={() => goTo(active - 1)}><ChevronLeft size={22} /></button><button className="detail-gallery-arrow right" type="button" aria-label="Next project image" onClick={() => goTo(active + 1)}><ChevronRight size={22} /></button><div className="detail-gallery-counter">{active + 1} / {imageCount}</div></>}</div>{showControls && <div className="detail-gallery-dots" aria-label="Project image navigation">{project.galleryImages.map((_, index) => <button key={index} type="button" className={active === index ? "active" : ""} aria-label={`Show project image ${index + 1}`} onClick={() => goTo(index)} />)}</div>}</section><section className="detail-copy-panel"><p className="detail-kicker">PROJECT / {projectNumber}</p><h1>{project.name}</h1><p className="detail-arabic-name">{project.nameAr}</p><div className="detail-block"><p className="detail-label">ABOUT PROJECT</p><p className="detail-description">{description}</p></div><div className="detail-block"><p className="detail-label">TECHNOLOGIES USED</p><div className="detail-tags">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div></div><div className="detail-links">{project.githubUrl && <a href={project.githubUrl === "#" ? undefined : project.githubUrl} target={project.githubUrl === "#" ? undefined : "_blank"} rel="noreferrer" onClick={event => project.githubUrl === "#" && event.preventDefault()}><Github size={17} />View code</a>}</div></section></div></div></main>;
}
