import Modal from "./Modal"
import { parseRich } from "../utils/helpers"
import styles from "./ProjectModal.module.css"

function ExternalLink({ href, children }) {
  if (!href) return null
  return (
    <a href={href} target="_blank" rel="noreferrer" className={styles.external}>
      {children}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 17L17 7M9 7h8v8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}

export default function ProjectModal({ project, onClose }) {
  if (!project) return null
  return (
    <Modal open onClose={onClose} label={"Project: " + project.name} wide>
      <p className={styles.eyebrow}>Selected work</p>
      <h2 className={styles.title}>{project.name}</h2>
      <div className={styles.tags}>
        {(project.tech || []).map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>
      <div className={styles.body}>
        {(project.description || project.shortDescription || "")
          .split(/\n\s*\n/)
          .filter(Boolean)
          .map((para, i) => (
            <p key={i}>{parseRich(para)}</p>
          ))}
      </div>
      <div className={styles.links}>
        <ExternalLink href={project.githubUrl}>GitHub</ExternalLink>
        <ExternalLink href={project.liveUrl}>Live site</ExternalLink>
      </div>
    </Modal>
  )
}