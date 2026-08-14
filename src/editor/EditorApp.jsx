import { useState } from "react"
import { Link } from "react-router-dom"
import { useContent } from "../hooks/useContent"
import Seal from "../components/Seal"
import PinGate from "./PinGate"
import PersonalTab from "./tabs/PersonalTab"
import ProfessionalTab from "./tabs/ProfessionalTab"
import PostsTab from "./tabs/PostsTab"
import PublishTab from "./tabs/PublishTab"
import ExportTab from "./tabs/ExportTab"
import styles from "./editor.module.css"

const TABS = [
  { id: "personal", label: "Personal" },
  { id: "professional", label: "Professional" },
  { id: "posts", label: "Posts" },
  { id: "publish", label: "Publish" },
  { id: "export", label: "Export" }
]

export default function EditorApp() {
  const { localDraft } = useContent()
  const [authed, setAuthed] = useState(sessionStorage.getItem("signholo.pin") === "ok")
  const [tab, setTab] = useState("personal")

  if (!authed) return <PinGate onUnlock={() => setAuthed(true)} />

  return (
    <div className={styles.editor}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.brand}>
            <Seal size={30} />
            <div>
              <p className={styles.brandTitle}>Content editor</p>
              <p className={styles.brandSub}>SignHolo — everything you see on the site, edited here</p>
            </div>
          </div>
          <div className={styles.topbarRight}>
            <span className={styles.savedIndicator} title="Edits are stored in this browser automatically">
              <span className={styles.savedDot} aria-hidden="true" />
              {localDraft ? "Local draft active" : "Synced with content.json"}
            </span>
            <Link to="/" className={styles.viewLink}>
              View site ↗
            </Link>
          </div>
        </div>
      </header>

      <nav className={styles.tabs} role="tablist" aria-label="Editor sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className={styles.panel}>
        {tab === "personal" && <PersonalTab />}
        {tab === "professional" && <ProfessionalTab />}
        {tab === "posts" && <PostsTab />}
        {tab === "publish" && <PublishTab onGoExport={() => setTab("export")} />}
        {tab === "export" && <ExportTab />}
      </main>

      <footer className={styles.footer}>
        Edits save to this browser automatically. Publish them directly with the Publish tab, or export
        <span className={styles.mono}> content.json</span> and commit it yourself.
      </footer>
    </div>
  )
}