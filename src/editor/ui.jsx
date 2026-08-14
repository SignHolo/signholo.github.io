import styles from "./editor.module.css"

export function Field({ label, hint, children }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
      {hint && <span className={styles.fieldHint}>{hint}</span>}
    </label>
  )
}

export function TextInput(props) {
  return <input type="text" className={styles.input} {...props} />
}

export function TextArea(props) {
  return <textarea className={styles.textarea} {...props} />
}

export function IconButton({ label, onClick, children, danger }) {
  return (
    <button
      type="button"
      className={`${styles.iconBtn} ${danger ? styles.iconBtnDanger : ""}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}

export function AddButton({ onClick, children }) {
  return (
    <button type="button" className={styles.addBtn} onClick={onClick}>
      + {children}
    </button>
  )
}

export function SectionCard({ title, children }) {
  return (
    <section className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      {children}
    </section>
  )
}