import { useState } from "react"
import { useContent } from "../../hooks/useContent"
import { useReveal } from "../../hooks/useReveal"
import Seal from "../../components/Seal"
import ProjectModal from "../../components/ProjectModal"
import styles from "./professional.module.css"

export default function ProfessionalSections() {
  const { content } = useContent()
  const p = content.professional
  const [activeProject, setActiveProject] = useState(null)

  const focusReveal = useReveal()
  const projectsReveal = useReveal()
  const contactReveal = useReveal()

  return (
    <>
      {/* ── Professional Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.heroTopBar}>
            <div className={`${styles.availBadge} ${p.available ? styles.availTrue : styles.availFalse}`}>
              <span className={styles.availDot} aria-hidden="true" />
              <span>{p.available ? "Open to opportunities" : "Not open to work right now"}</span>
            </div>
          </div>

          <div className={styles.heroBody}>
            <h1 className={styles.name}>{p.name || "Your Name"}</h1>
            <p className={styles.title}>{p.title || "Professional Role & Specialist"}</p>
            <p className={styles.tagline}>{p.tagline}</p>
          </div>

          <div className={styles.heroActions}>
            <a href={`mailto:${p.contact?.email || ""}`} className={styles.primaryCta}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" />
                <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>Get In Touch</span>
            </a>

            {p.contact?.resume ? (
              <a href={p.contact.resume} target="_blank" rel="noreferrer" download className={styles.secondaryCta}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" />
                  <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Download Resume</span>
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Focus Areas / Domains ── */}
      <section className={styles.block} ref={focusReveal.ref} data-reveal={focusReveal.revealed}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>DOMAINS OF EXPERTISE</p>
        </div>

        <div className={styles.focusGrid} data-reveal-stagger={focusReveal.revealed}>
          {p.focusAreas.map((area, i) => (
            <div key={i} className={styles.focusChip}>
              <span className={styles.chipDot} aria-hidden="true" />
              <span>{area}</span>
            </div>
          ))}
          {p.focusAreas.length === 0 && (
            <div className={styles.emptyState}>
              <Seal size={36} />
              <p>No focus areas listed yet — add them in the <a href="/editor" className={styles.editorLink}>editor</a>.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Projects ── */}
      <section className={styles.block} ref={projectsReveal.ref} data-reveal={projectsReveal.revealed}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.blockTitle}>Featured Projects</h2>
          <p className={styles.blockSub}>Select a project to open full case study details</p>
        </div>

        <div className={styles.projectGrid} data-reveal-stagger={projectsReveal.revealed}>
          {p.projects.map((project) => (
            <article key={project.id} className={styles.projectCard}>
              <button
                type="button"
                className={styles.projectBody}
                onClick={() => setActiveProject(project)}
                aria-label={`Open details for ${project.name}`}
              >
                <div className={styles.projectNameRow}>
                  <h3 className={styles.projectName}>{project.name}</h3>
                  <div className={styles.projectArrow} aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <p className={styles.projectDesc}>{project.shortDescription}</p>
                <div className={styles.tech}>
                  {(project.tech || []).map((t) => (
                    <span key={t} className={styles.techTag}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className={styles.projectHint}>
                  <span>View case study</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
              <div className={styles.projectLinks}>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className={styles.projectLink}>
                    GitHub ↗
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className={styles.projectLink}>
                    Live Demo ↗
                  </a>
                )}
              </div>
            </article>
          ))}
          {p.projects.length === 0 && (
            <div className={styles.emptyState}>
              <Seal size={36} />
              <p>No projects listed yet — add them in the <a href="/editor" className={styles.editorLink}>editor</a>.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact-section" className={styles.block} ref={contactReveal.ref} data-reveal={contactReveal.revealed}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>REACH ME</p>
          <h2 className={styles.blockTitle}>Professional Contact</h2>
        </div>

        <div className={styles.contactGrid} data-reveal-stagger={contactReveal.revealed}>
          <ContactCard href={`mailto:${p.contact.email}`} label="Email" value={p.contact.email || "—"} />
          <ContactCard href={p.contact.linkedin} label="LinkedIn" value={p.contact.linkedin ? "in/" + p.contact.linkedin.split("/").filter(Boolean).pop() : "—"} />
          <ContactCard href={p.contact.github} label="GitHub" value={p.contact.github ? "@" + p.contact.github.split("/").filter(Boolean).pop() : "—"} />
          {p.contact.resume ? (
            <ContactCard href={p.contact.resume} label="Resume" value="Download Resume PDF" download />
          ) : (
            <div className={styles.contactCard}>
              <span className={styles.contactLabel}>Resume</span>
              <span className={styles.contactValue}>Available upon request</span>
            </div>
          )}
        </div>
      </section>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  )
}

function ContactCard({ href, label, value, download }) {
  if (!href || href === "mailto:") {
    return (
      <div className={styles.contactCard}>
        <span className={styles.contactLabel}>{label}</span>
        <span className={styles.contactValue}>—</span>
      </div>
    )
  }
  return (
    <a className={styles.contactCard} href={href} target={download ? undefined : "_blank"} rel="noreferrer" download={download || undefined}>
      <span className={styles.contactLabel}>{label}</span>
      <span className={styles.contactValue}>{value}</span>
      <svg className={styles.contactArrow} width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}