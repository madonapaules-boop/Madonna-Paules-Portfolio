import { OwnerDashboardLayout } from "@/components/OwnerDashboardLayout";
import { trpc } from "@/lib/trpc";
import { defaultPortfolioContent, type PortfolioContent, type ProjectEntry } from "@shared/portfolioContent";
import { PROJECT_IMAGE_PLACEHOLDER } from "@shared/projects";
import { ChevronDown, ChevronUp, ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

const emptyProject = (): ProjectEntry => ({ name: "", nameAr: "", year: "", stack: [], description: "", descriptionAr: "", projectUrl: "#", githubUrl: "#", galleryImages: [PROJECT_IMAGE_PLACEHOLDER], imageKey: "" });
const acceptedTypes = ["image/jpeg", "image/png", "image/webp"] as const;
type ImageType = (typeof acceptedTypes)[number];

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read-failed"));
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.readAsDataURL(file);
  });
}

function isValidImage(file: File) {
  return acceptedTypes.includes(file.type as ImageType) && file.size <= 4 * 1024 * 1024;
}

export default function AdminProjects() {
  const utils = trpc.useUtils();
  const query = trpc.portfolio.adminData.useQuery();
  const [draft, setDraft] = useState<PortfolioContent>(defaultPortfolioContent);
  const [notice, setNotice] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});
  useEffect(() => { if (query.data) setDraft(query.data); }, [query.data]);
  const save = trpc.portfolio.save.useMutation({ onSuccess: async () => { setNotice("Projects saved."); await Promise.all([utils.portfolio.adminData.invalidate(), utils.portfolio.publicData.invalidate(), utils.portfolio.admin.overview.invalidate()]); }, onError: () => setNotice("Could not save. Complete all project fields first.") });
  const uploadProjectImage = trpc.portfolio.admin.uploadProjectImage.useMutation();
  const update = (index: number, field: keyof ProjectEntry, value: string | string[]) => setDraft(current => ({ ...current, projects: current.projects.map((project, itemIndex) => itemIndex === index ? { ...project, [field]: value } : project) }));

  const handleImages = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    const existing = draft.projects[index]?.galleryImages.filter(image => image !== PROJECT_IMAGE_PLACEHOLDER) ?? [];
    const available = Math.max(0, 4 - existing.length);
    if (available === 0) { setNotice("Each project can have up to 4 images."); return; }
    const selected = files.slice(0, available);
    const invalid = selected.find(file => !isValidImage(file));
    if (invalid) { setNotice("Use PNG, JPEG, or WebP images up to 4 MB each."); return; }
    setUploadingIndex(index);
    try {
      const uploaded = [];
      for (const file of selected) {
        uploaded.push(await uploadProjectImage.mutateAsync({ base64: await fileToBase64(file), fileName: file.name, contentType: file.type as ImageType }));
      }
      const urls = uploaded.map(media => media.url);
      setDraft(current => ({ ...current, projects: current.projects.map((project, itemIndex) => itemIndex === index ? { ...project, galleryImages: [...project.galleryImages.filter(image => image !== PROJECT_IMAGE_PLACEHOLDER), ...urls].slice(0, 4) } : project) }));
      setNotice(`${urls.length} image${urls.length === 1 ? "" : "s"} uploaded. Click Save projects to publish the changes.`);
    } catch {
      setNotice("Image upload failed. Use PNG, JPEG, or WebP images up to 4 MB each.");
    } finally {
      setUploadingIndex(null);
    }
  };

  const removeImage = (projectIndex: number, imageIndex: number) => setDraft(current => ({ ...current, projects: current.projects.map((project, index) => { if (index !== projectIndex) return project; const next = project.galleryImages.filter((_, itemIndex) => itemIndex !== imageIndex); return { ...project, galleryImages: next.length ? next : [PROJECT_IMAGE_PLACEHOLDER] }; }) }));
  const moveImage = (projectIndex: number, imageIndex: number, direction: -1 | 1) => setDraft(current => ({ ...current, projects: current.projects.map((project, index) => { if (index !== projectIndex) return project; const target = imageIndex + direction; if (target < 0 || target >= project.galleryImages.length) return project; const galleryImages = [...project.galleryImages]; [galleryImages[imageIndex], galleryImages[target]] = [galleryImages[target], galleryImages[imageIndex]]; return { ...project, galleryImages }; }) }));

  return <OwnerDashboardLayout><div className="owner-page"><div className="owner-page-heading"><div><p className="admin-kicker">Projects</p><h1>Selected work.</h1><p>Edit names, descriptions, technologies, links, and project images for every public project.</p></div><button className="owner-save" type="button" onClick={() => save.mutate(draft)} disabled={save.isPending}><Save size={16} />{save.isPending ? "Saving…" : "Save projects"}</button></div>{notice && <p className="dashboard-notice">{notice}</p>}<div className="manager-list">{draft.projects.map((project, index) => <article className="manager-card" key={`${project.name}-${index}`}><div className="manager-card-heading"><span>0{index + 1}</span><button type="button" onClick={() => setDraft(current => ({ ...current, projects: current.projects.filter((_, itemIndex) => itemIndex !== index) }))}><Trash2 size={16} />Remove</button></div><div className="bilingual-grid"><Field label="Project name — English" value={project.name} onChange={value => update(index, "name", value)} /><Field label="Project name — Arabic" dir="rtl" value={project.nameAr} onChange={value => update(index, "nameAr", value)} /><Field label="Year" value={project.year} onChange={value => update(index, "year", value)} /><Field label="Tech stack — comma separated" value={project.stack.join(", ")} onChange={value => update(index, "stack", value.split(",").map(item => item.trim()).filter(Boolean))} /><Field label="Live Demo URL — use # until ready" type="url" value={project.projectUrl} onChange={value => update(index, "projectUrl", value)} /><Field label="GitHub URL — use # until ready" type="url" value={project.githubUrl} onChange={value => update(index, "githubUrl", value)} /></div><section className="project-image-manager"><div className="project-image-manager-heading"><div><span>Project gallery</span><small>Up to 4 images · first image appears first in Work</small></div><label className="media-upload project-upload-button"><ImagePlus size={16} />{uploadingIndex === index ? "Uploading…" : "Upload Images"}<input ref={element => { fileInputs.current[index] = element; }} type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={event => handleImages(index, event)} disabled={uploadingIndex !== null} /></label></div><div className="project-image-list">{project.galleryImages.map((image, imageIndex) => <div className="project-image-item" key={`${image}-${imageIndex}`}>{image === PROJECT_IMAGE_PLACEHOLDER ? <div className="project-image-placeholder">Project Image</div> : <img src={image} alt={`${project.name || "Project"} image ${imageIndex + 1}`} />}<div className="project-image-item-footer"><span>{imageIndex + 1} / {project.galleryImages.length}</span><div><button type="button" title="Move image up" aria-label="Move image up" onClick={() => moveImage(index, imageIndex, -1)} disabled={imageIndex === 0}><ChevronUp size={14} /></button><button type="button" title="Move image down" aria-label="Move image down" onClick={() => moveImage(index, imageIndex, 1)} disabled={imageIndex === project.galleryImages.length - 1}><ChevronDown size={14} /></button><button type="button" title="Delete image" aria-label="Delete image" onClick={() => removeImage(index, imageIndex)}><X size={14} /></button></div></div></div>)}</div></section><label><span>Description — English</span><textarea rows={5} value={project.description} onChange={event => update(index, "description", event.target.value)} /></label><label><span>Description — Arabic</span><textarea dir="rtl" rows={5} value={project.descriptionAr} onChange={event => update(index, "descriptionAr", event.target.value)} /></label></article>)}</div><button className="add-manager-item" type="button" onClick={() => setDraft(current => ({ ...current, projects: [...current.projects, emptyProject()] }))}><Plus size={17} />Add project</button></div></OwnerDashboardLayout>;
}

function Field({ label, value, onChange, dir, type }: { label: string; value: string; onChange: (value: string) => void; dir?: string; type?: string }) { return <label><span>{label}</span><input type={type ?? "text"} dir={dir} value={value} onChange={event => onChange(event.target.value)} /></label>; }
