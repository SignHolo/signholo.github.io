import { useContent } from "../../hooks/useContent"
import { useToast } from "../../components/Toast"
import styles from "../editor.module.css"

export default function ExportTab() {
  const { content, discardLocal, localDraft } = useContent()
  const showToast = useToast()

  function download() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "content.json"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    showToast("content.json downloaded")
  }

  return (
    <div className={styles.stack}>
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Publish your edits</h3>
        <ol className={styles.steps}>
          <li>
            <strong>Export</strong> — download <span className={styles.mono}>content.json</span> below. It
            contains everything above, including posts and images.
          </li>
          <li>
            <strong>Replace</strong> — drop it over <span className={styles.mono}>public/content.json</span> in
            your repo.
          </li>
          <li>
            <strong>Push</strong> — commit and push. The GitHub Pages workflow rebuilds the site and you're
            live. If you deploy manually, commit after <span className={styles.mono}>npm run build</span>.
          </li>
        </ol>
        <p className={styles.exportNote}>
          Edits you make here are kept in this browser until then. Visiting other browsers (or a fresh incognito
          window) shows the shipped content.json.
        </p>
        <button type="button" className={styles.primaryBtn} onClick={download}>
          Export content.json
        </button>
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Local draft</h3>
        <p className={styles.hint}>
          {localDraft
            ? "Your browser is currently overriding the shipped content.json with local edits."
            : "No local edits — the site is showing shipped content.json."}
        </p>
        <button
          type="button"
          className={styles.dangerBtn}
          onClick={() => {
            if (window.confirm("Discard all local edits? The site will fall back to the shipped content.json.")) {
              discardLocal()
              showToast("Local draft discarded")
            }
          }}
        >
          Discard local draft
        </button>
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Raw preview</h3>
        <details className={styles.details}>
          <summary>Show the JSON that will be exported</summary>
          <pre className={styles.jsonPreview}>{JSON.stringify(content, null, 2)}</pre>
        </details>
      </section>
    </div>
  )
}