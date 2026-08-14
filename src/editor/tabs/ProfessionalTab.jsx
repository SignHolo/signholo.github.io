import { useState } from "react"
import { useContent } from "../../hooks/useContent"
import { uid } from "../../utils/helpers"
import { useToast } from "../../components/Toast"
import { Field, TextInput, TextArea, IconButton, AddButton, SectionCard } from "../ui"
import styles from "../editor.module.css"

export default function ProfessionalTab() {
  const { content, updateContent } = useContent()
  const showToast = useToast()
  const [editing, setEditing] = useState(null)
  const prof = content.professional

  function patch(patchObj) {
    updateContent((prev) => ({ ...prev, professional: { ...prev.professional, ...patchObj } }))
  }

  function patchProject(id, patchObj) {
    updateContent((prev) => ({
      ...prev,
      professional: {
        ...prev.professional,
        projects: prev.professional.projects.map((proj) => (proj.id === id ? { ...proj, ...patchObj } : proj))
      }
    }))
  }

  function addProject() {
    const blank = { id: uid(), name: "", shortDescription: "", description: "", tech: [], githubUrl: "", liveUrl: "", thumbnailUrl: "" }
    updateContent((prev) => ({ ...prev, professional: { ...prev.professional, projects: [...prev.professional.projects, blank] } }))
    setEditing(blank.id)
  }

  function addFocus() {
    patch({ focusAreas: [...prof.focusAreas, ""] })
  }

  return (
    <div className={styles.stack}>
      <SectionCard title="Identity">
        <div className={styles.grid2}>
          <Field label="Name">
            <TextInput value={prof.name} onChange={(e) => patch({ name: e.target.value })} />
          </Field>
          <Field label="Title / role">
            <TextInput value={prof.title} onChange={(e) => patch({ title: e.target.value })} />
          </Field>
        </div>
        <Field label="Professional tagline">
          <TextArea rows={3} value={prof.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
        </Field>
        <div className={styles.switchRow}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={prof.available}
              onChange={(e) => patch({ available: e.target.checked })}
            />
            <span className={styles.switchTrack} aria-hidden="true" />
            <span className={styles.switchLabel}>Open to opportunities</span>
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Focus areas">
        <div className={styles.chips}>
          {prof.focusAreas.map((area, i) => (
            <span key={i} className={styles.chip}>
              <input
                className={styles.chipInput}
                value={area}
                onChange={(e) =>
                  updateContent((prev) => {
                    const focusAreas = prev.professional.focusAreas.map((a, idx) => (idx === i ? e.target.value : a))
                    return { ...prev, professional: { ...prev.professional, focusAreas } }
                  })
                }
                placeholder="Focus area"
              />
              <button
                type="button"
                className={styles.chipRemove}
                aria-label="Remove focus area"
                onClick={() => updateContent((prev) => ({ ...prev, professional: { ...prev.professional, focusAreas: prev.professional.focusAreas.filter((_, idx) => idx !== i) } }))}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <AddButton onClick={addFocus}>Add focus area</AddButton>
      </SectionCard>

      <SectionCard title="Projects">
        <div className={styles.projectEditorList}>
          {prof.projects.map((proj) => (
            <div key={proj.id} className={styles.projectEditorItem}>
              <div className={styles.projectEditorHead}>
                <span className={styles.projectEditorName}>{proj.name || "Unnamed project"}</span>
                <div className={styles.projectEditorActions}>
                  <button
                    type="button"
                    className={styles.miniBtn}
                    onClick={() => setEditing(editing === proj.id ? null : proj.id)}
                  >
                    {editing === proj.id ? "Close" : "Edit"}
                  </button>
                  <IconButton
                    label="Delete project"
                    danger
                    onClick={() => {
                      updateContent((prev) => ({ ...prev, professional: { ...prev.professional, projects: prev.professional.projects.filter((x) => x.id !== proj.id) } }))
                      showToast("Project deleted")
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 7h16M9 7V5h6v2m-8 0l1 13h8l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </IconButton>
                </div>
              </div>
              {editing === proj.id && (
                <div className={styles.projectForm}>
                  <Field label="Project name">
                    <TextInput value={proj.name} onChange={(e) => patchProject(proj.id, { name: e.target.value })} />
                  </Field>
                  <Field label="Short description" hint="Shown on the card">
                    <TextArea rows={2} value={proj.shortDescription} onChange={(e) => patchProject(proj.id, { shortDescription: e.target.value })} />
                  </Field>
                  <Field label="Tech stack" hint="Comma separated">
                    <TextInput value={proj.tech.join(", ")} onChange={(e) => patchProject(proj.id, { tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
                  </Field>
                  <div className={styles.grid2}>
                    <Field label="GitHub URL">
                      <TextInput value={proj.githubUrl} onChange={(e) => patchProject(proj.id, { githubUrl: e.target.value })} />
                    </Field>
                    <Field label="Live URL">
                      <TextInput value={proj.liveUrl} onChange={(e) => patchProject(proj.id, { liveUrl: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Thumbnail / screenshot URL" hint="Optional image shown on the project card">
                    <TextInput value={proj.thumbnailUrl || ""} onChange={(e) => patchProject(proj.id, { thumbnailUrl: e.target.value })} placeholder="https://… (optional project screenshot)" />
                  </Field>
                  <Field label="Long description" hint="Shown in the project modal — blank line = new paragraph">
                    <TextArea rows={5} value={proj.description} onChange={(e) => patchProject(proj.id, { description: e.target.value })} />
                  </Field>
                </div>
              )}
            </div>
          ))}
          {prof.projects.length === 0 && <p className={styles.hint}>No projects yet.</p>}
        </div>
        <AddButton onClick={addProject}>Add project</AddButton>
      </SectionCard>

      <SectionCard title="Contact">
        <div className={styles.grid2}>
          <Field label="Email">
            <TextInput value={prof.contact.email} onChange={(e) => patch({ contact: { ...prof.contact, email: e.target.value } })} />
          </Field>
          <Field label="LinkedIn URL">
            <TextInput value={prof.contact.linkedin} onChange={(e) => patch({ contact: { ...prof.contact, linkedin: e.target.value } })} />
          </Field>
          <Field label="GitHub URL">
            <TextInput value={prof.contact.github} onChange={(e) => patch({ contact: { ...prof.contact, github: e.target.value } })} />
          </Field>
          <Field label="Resume URL" hint="Optional download link">
            <TextInput value={prof.contact.resume} onChange={(e) => patch({ contact: { ...prof.contact, resume: e.target.value } })} />
          </Field>
        </div>
      </SectionCard>
    </div>
  )
}