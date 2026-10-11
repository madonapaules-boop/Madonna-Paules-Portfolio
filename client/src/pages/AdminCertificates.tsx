import { OwnerDashboardLayout } from "@/components/OwnerDashboardLayout";
import { trpc } from "@/lib/trpc";
import { defaultPortfolioContent, type CertificationEntry, type LanguageEntry, type PortfolioContent, type SkillGroup } from "@shared/portfolioContent";
import { ChevronDown, ChevronUp, ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

const blankCertification = (): CertificationEntry => ({ title: "", titleAr: "", issuer: "", status: "Completed", credentialUrl: "", order: 1, imageUrls: [] });
const blankLanguage = (): LanguageEntry => ({ label: "", labelAr: "" });
const blankSkill = (): SkillGroup => ({ category: "", categoryAr: "", items: [] });
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

export default function AdminCertificates() {
  const utils = trpc.useUtils();
  const query = trpc.portfolio.adminData.useQuery();
  const [draft, setDraft] = useState<PortfolioContent>(defaultPortfolioContent);
  const [notice, setNotice] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});
  useEffect(() => { if (query.data) setDraft(query.data); }, [query.data]);
  const save = trpc.portfolio.save.useMutation({ onSuccess: async () => { setNotice("Credentials saved."); await Promise.all([utils.portfolio.adminData.invalidate(), utils.portfolio.publicData.invalidate(), utils.portfolio.admin.overview.invalidate()]); }, onError: () => setNotice("Could not save. Complete all required fields first.") });
  const uploadCertificateImage = trpc.portfolio.admin.uploadCertificateImage.useMutation();
  const updateEducation = (field: keyof PortfolioContent["education"], value: string) => setDraft(current => ({ ...current, education: { ...current.education, [field]: value } }));
  const updateCertification = (index: number, field: keyof CertificationEntry, value: string | string[] | number) => setDraft(current => ({ ...current, certifications: current.certifications.map((entry, itemIndex) => itemIndex === index ? { ...entry, [field]: value } : entry) }));
  const resetCertification = (index: number) => { const original = query.data?.certifications[index]; if (original) setDraft(current => ({ ...current, certifications: current.certifications.map((entry, itemIndex) => itemIndex === index ? original : entry) })); };

  const handleImages = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    const existing = draft.certifications[index]?.imageUrls ?? [];
    const available = Math.max(0, 8 - existing.length);
    if (!available) { setNotice("Each certificate can have up to 8 images."); return; }
    const selected = files.slice(0, available);
    if (selected.some(file => !isValidImage(file))) { setNotice("Use PNG, JPEG, or WebP images up to 4 MB each."); return; }
    setUploadingIndex(index);
    try {
      const uploaded = [];
      for (const file of selected) uploaded.push(await uploadCertificateImage.mutateAsync({ base64: await fileToBase64(file), fileName: file.name, contentType: file.type as ImageType }));
      updateCertification(index, "imageUrls", [...existing, ...uploaded.map(media => media.url)].slice(0, 8));
      setNotice(`${uploaded.length} certificate image${uploaded.length === 1 ? "" : "s"} uploaded. Click Save credentials to publish the changes.`);
    } catch { setNotice("Image upload failed. Use PNG, JPEG, or WebP images up to 4 MB each."); }
    finally { setUploadingIndex(null); }
  };

  const removeImage = (certificateIndex: number, imageIndex: number) => updateCertification(certificateIndex, "imageUrls", draft.certifications[certificateIndex].imageUrls.filter((_, index) => index !== imageIndex));
  const moveImage = (certificateIndex: number, imageIndex: number, direction: -1 | 1) => {
    const images = [...draft.certifications[certificateIndex].imageUrls];
    const target = imageIndex + direction;
    if (target < 0 || target >= images.length) return;
    [images[imageIndex], images[target]] = [images[target], images[imageIndex]];
    updateCertification(certificateIndex, "imageUrls", images);
  };

  return <OwnerDashboardLayout><div className="owner-page"><div className="owner-page-heading"><div><p className="admin-kicker">Credentials</p><h1>Education, skills, and certificates.</h1><p>Keep the qualifications and technical profile displayed in both languages up to date.</p></div><button className="owner-save" type="button" onClick={() => save.mutate(draft)} disabled={save.isPending}><Save size={16} />{save.isPending ? "Saving…" : "Save credentials"}</button></div>{notice && <p className="dashboard-notice">{notice}</p>}<section className="manager-section"><h2>Education</h2><div className="bilingual-grid"><Field label="Degree — English" value={draft.education.degree} onChange={value => updateEducation("degree", value)} /><Field label="Degree — Arabic" dir="rtl" value={draft.education.degreeAr} onChange={value => updateEducation("degreeAr", value)} /><Field label="University — English" value={draft.education.university} onChange={value => updateEducation("university", value)} /><Field label="University — Arabic" dir="rtl" value={draft.education.universityAr} onChange={value => updateEducation("universityAr", value)} /><Field label="Period" value={draft.education.period} onChange={value => updateEducation("period", value)} /></div><label><span>Coursework — English</span><textarea rows={4} value={draft.education.coursework} onChange={event => updateEducation("coursework", event.target.value)} /></label><label><span>Coursework — Arabic</span><textarea dir="rtl" rows={4} value={draft.education.courseworkAr} onChange={event => updateEducation("courseworkAr", event.target.value)} /></label></section><section className="manager-section"><h2>Technical skills</h2>{draft.skills.map((skill, index) => <article className="inline-manager" key={`${skill.category}-${index}`}><div className="bilingual-grid"><Field label="Category — English" value={skill.category} onChange={value => setDraft(current => ({ ...current, skills: current.skills.map((entry, itemIndex) => itemIndex === index ? { ...entry, category: value } : entry) }))} /><Field label="Category — Arabic" dir="rtl" value={skill.categoryAr} onChange={value => setDraft(current => ({ ...current, skills: current.skills.map((entry, itemIndex) => itemIndex === index ? { ...entry, categoryAr: value } : entry) }))} /><Field label="Skills — comma separated" value={skill.items.join(", ")} onChange={value => setDraft(current => ({ ...current, skills: current.skills.map((entry, itemIndex) => itemIndex === index ? { ...entry, items: value.split(",").map(item => item.trim()).filter(Boolean) } : entry) }))} /></div><button type="button" onClick={() => setDraft(current => ({ ...current, skills: current.skills.filter((_, itemIndex) => itemIndex !== index) }))}><Trash2 size={15} />Remove skill group</button></article>)}<button className="add-manager-item" type="button" onClick={() => setDraft(current => ({ ...current, skills: [...current.skills, blankSkill()] }))}><Plus size={16} />Add skill group</button></section><section className="manager-section certificates-manager-section"><div className="certificates-section-heading"><div><p className="admin-kicker">Credentials</p><h2>Certificates.</h2><p>Keep certifications and completed learning visible and verifiable.</p></div><button className="add-manager-item" type="button" onClick={() => setDraft(current => ({ ...current, certifications: [...current.certifications, blankCertification()] }))}><Plus size={16} />Add certificate</button></div>{draft.certifications.map((item, index) => <article className="certificate-editor-card" key={`${item.title}-${index}`}><div className="certificate-editor-top"><div><p className="admin-kicker">Edit certificate</p><h3>Update credential</h3></div><button className="certificate-cancel" type="button" onClick={() => resetCertification(index)}><X size={15} />Cancel</button></div><div className="certificate-field-grid"><Field label="Title — English" value={item.title} onChange={value => updateCertification(index, "title", value)} /><Field label="Title — Arabic" dir="rtl" value={item.titleAr} onChange={value => updateCertification(index, "titleAr", value)} /><Field label="Issuer" value={item.issuer} onChange={value => updateCertification(index, "issuer", value)} /><Field label="Date / status" value={item.status} onChange={value => updateCertification(index, "status", value)} /><Field label="Credential URL" value={item.credentialUrl} onChange={value => updateCertification(index, "credentialUrl", value)} type="url" /><Field label="Display order" value={String(item.order)} onChange={value => updateCertification(index, "order", Math.max(1, Number(value) || 1))} type="number" /></div><section className="certificate-upload-row"><div className="certificate-upload-preview">{item.imageUrls[0] ? <img src={item.imageUrls[0]} alt={`${item.title || "Certificate"} preview`} /> : <span>No image</span>}</div><label className="media-upload certificate-upload-button"><ImagePlus size={16} />{uploadingIndex === index ? "Uploading…" : "Upload image"}<input ref={element => { fileInputs.current[index] = element; }} type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={event => handleImages(index, event)} disabled={uploadingIndex !== null} /></label><small>PNG, JPEG, or WebP · up to 4 MB each · up to 8 images</small></section>{item.imageUrls.length > 0 && <section className="certificate-image-manager"><div className="project-image-list">{item.imageUrls.map((image, imageIndex) => <div className="project-image-item" key={`${image}-${imageIndex}`}><img src={image} alt={`${item.title || "Certificate"} image ${imageIndex + 1}`} /><div className="project-image-item-footer"><span>{imageIndex + 1} / {item.imageUrls.length}</span><div><button type="button" title="Move image up" aria-label="Move image up" onClick={() => moveImage(index, imageIndex, -1)} disabled={imageIndex === 0}><ChevronUp size={14} /></button><button type="button" title="Move image down" aria-label="Move image down" onClick={() => moveImage(index, imageIndex, 1)} disabled={imageIndex === item.imageUrls.length - 1}><ChevronDown size={14} /></button><button type="button" title="Delete image" aria-label="Delete image" onClick={() => removeImage(index, imageIndex)}><X size={14} /></button></div></div></div>)}</div></section>}<div className="certificate-editor-actions"><button className="certificate-save-button" type="button" onClick={() => save.mutate(draft)} disabled={save.isPending}><Save size={15} />Save changes</button><button className="certificate-delete-button" type="button" onClick={() => setDraft(current => ({ ...current, certifications: current.certifications.filter((_, itemIndex) => itemIndex !== index) }))}><Trash2 size={15} />Remove certificate</button></div></article>)}<div className="language-manager">{draft.languages.map((item, index) => <article key={`${item.label}-${index}`}><Field label="Language — English" value={item.label} onChange={value => setDraft(current => ({ ...current, languages: current.languages.map((entry, itemIndex) => itemIndex === index ? { ...entry, label: value } : entry) }))} /><Field label="Language — Arabic" dir="rtl" value={item.labelAr} onChange={value => setDraft(current => ({ ...current, languages: current.languages.map((entry, itemIndex) => itemIndex === index ? { ...entry, labelAr: value } : entry) }))} /><button type="button" onClick={() => setDraft(current => ({ ...current, languages: current.languages.filter((_, itemIndex) => itemIndex !== index) }))}><Trash2 size={15} /></button></article>)}</div><button className="add-manager-item" type="button" onClick={() => setDraft(current => ({ ...current, languages: [...current.languages, blankLanguage()] }))}><Plus size={16} />Add language</button></section></div></OwnerDashboardLayout>;
}

function Field({ label, value, onChange, dir, type }: { label: string; value: string; onChange: (value: string) => void; dir?: string; type?: string }) { return <label><span>{label}</span><input type={type ?? "text"} dir={dir} value={value} onChange={event => onChange(event.target.value)} /></label>; }
