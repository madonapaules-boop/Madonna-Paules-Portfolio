import { ArrowLeft, ArrowUpRight, Github, Layers3 } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { defaultPortfolioContent, type ProjectEntry } from "@shared/portfolioContent";
import { PROJECT_IMAGE_PLACEHOLDER } from "@shared/projects";
import React, { useState } from "react";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const placeholderLines = ["", "", "", "", ""];

function FakeProjectImage({ project, index, large = false }: { project: ProjectEntry; index: number; large?: boolean }) {
  const image = project.galleryImages[index] ?? PROJECT_IMAGE_PLACEHOLDER;
  if (image !== PROJECT_IMAGE_PLACEHOLDER) return <img className={large ? "detail-real-image" : "detail-real-thumb"} src={image} alt={`${project.name} preview ${index + 1}`} />;
  return <div className={`fake-project-image ${large ? "large" : ""}`} aria-label="Project Image placeholder"><div className="fake-window-bar"><i /><i /><i /><span>{index + 1} / {project.galleryImages.length}</span></div><div className="fake-window-body"><div className="fake-sidebar"><b>{project.name.split(" ")[0]}</b><span /><span /><span /><span /></div><div className="fake-dashboard"><div className="fake-heading"><strong>Illustrative preview</strong><em>⌁⌁⌁</em></div><div className="fake-stat-row"><i /><i /><i /><i /></div><div className="fake-chart"><div className="fake-bars"><b /><b /><b /><b /><b /></div><div className="fake-donut" /></div><div className="fake-table">{placeholderLines.map((_, row) => <span key={row}><i /><i /><i /></span>)}</div></div></div></div>;
}

export default function ProjectDetails() {
  const [, params] = useRoute("/project/:slug");
  const [, setLocation] = useLocation();
  const { data } = trpc.portfolio.publicData.useQuery();
  const content = data ?? defaultPortfolioContent;
  const project = content.projects.find(item => slugify(item.name) === params?.slug) ?? content.projects[0];
  const [active, setActive] = useState(0);
  const language = "en";
  if (!project) return null;
  const description = project.description.replace(/\s*GitHub:\s*https?:\/\/\S+/gi, "").trim();
  return <main className="project-detail-page"><div className="project-detail-shell"><header className="project-detail-nav"><button type="button" onClick={() => setLocation("/")}><ArrowLeft size={17} />Back to portfolio</button><span>PROJECT / {String(content.projects.indexOf(project) + 1).padStart(2, "0")}</span></header><div className="project-detail-grid"><section className="detail-visual-panel"><div className="detail-main-image"><FakeProjectImage project={project} index={active} large /></div><div className="detail-thumbnails">{project.galleryImages.map((_, index) => <button key={index} className={active === index ? "active" : ""} type="button" onClick={() => setActive(index)}><FakeProjectImage project={project} index={index} /></button>)}</div></section><section className="detail-copy-panel"><p className="detail-kicker">SELECTED WORK / {project.year}</p><h1>{project.name}</h1><p className="detail-arabic-name">{project.nameAr}</p><p className="detail-description">{description}</p><div className="detail-block"><p className="detail-label">ABOUT PROJECT</p><p>{description}</p></div><div className="detail-block"><p className="detail-label">TECHNOLOGIES USED</p><div className="detail-tags">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div></div><div className="detail-links">{project.projectUrl && <a href={project.projectUrl === "#" ? undefined : project.projectUrl} target={project.projectUrl === "#" ? undefined : "_blank"} rel="noreferrer" onClick={event => project.projectUrl === "#" && event.preventDefault()}><ArrowUpRight size={17} />Live Demo</a>}{project.githubUrl && <a href={project.githubUrl === "#" ? undefined : project.githubUrl} target={project.githubUrl === "#" ? undefined : "_blank"} rel="noreferrer" onClick={event => project.githubUrl === "#" && event.preventDefault()}><Github size={17} />GitHub</a>}</div><div className="detail-meta"><Layers3 size={19} /><span>Full project overview<br /><b>{project.galleryImages.length} illustrative screens</b></span></div></section></div></div></main>;
}
