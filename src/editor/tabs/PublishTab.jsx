import { useState } from "react"
import { useContent } from "../../hooks/useContent"
import { useBackend } from "../../hooks/useBackend"
import { useToast } from "../../components/Toast"
import { Field, TextInput } from "../ui"
import styles from "../editor.module.css"

function Badge({ kind, children }) {
  return <span className={`${styles.badge} ${styles["badge" + kind]}`}>{children}</span>
}

function LogTime({ t }) {
  return (
    <time className={styles.logTime}>
      {new Date(t).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </time>
  )
}

export default function PublishTab({ onGoExport }) {
  const { content } = useContent()
  const showToast = useToast()
  const { status, repo, busy, log, refresh, saveContent, setRemote, commit, push } = useBackend()
  const [remoteUrl, setRemoteUrl] = useState("")
  const [commitMsg, setCommitMsg] = useState("")
  const [saved, setSaved] = useState(false)
  const [committed, setCommitted] = useState(false)

  function handleSave() {
    setSaved(false)
    setCommitted(false)
    saveContent(content)
      .then(() => {
        setSaved(true)
        showToast("Saved to public/content.json")
      })
      .catch(() => showToast("Could not save — see the log below"))
  }

  function handleCommit() {
    commit(commitMsg)
      .then((d) => {
        if (d.ok && d.committed) {
          setCommitted(true)
          showToast("Committed " + d.hash)
        } else {
          showToast(d.error || "Nothing to commit")
        }
      })
      .catch(() => showToast("Commit failed — see the log below"))
  }

  function handlePush() {
    const target = repo && repo.origin ? repo.origin : "origin"
    const branch = repo && repo.branch ? repo.branch : "?"
    const ok = window.confirm(
      `Push to ${target} on branch ${branch}?\n\nThis publishes today's content to GitHub — Pages will rebuild the live site.`
    )
    if (!ok) {
      showToast("Push cancelled")
      return
    }
    push()
      .then(() => showToast("Pushed — GitHub Pages is rebuilding"))
      .catch(() => showToast("Push failed — see the log below"))
  }

  function handleSetRemote() {
    if (!remoteUrl.trim()) {
      showToast("Paste the repository URL first")
      return
    }
    setRemote(remoteUrl.trim())
      .then(() => {
        showToast("Repository URL saved")
        setRemoteUrl("")
      })
      .catch(() => showToast("Could not set URL — see the log below"))
  }

  const offline = status === "offline"
  const originMissing = !repo || !repo.origin

  return (
    <div className={styles.stack}>
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Backend status</h3>
        {status === "checking" && <p className={styles.hint}>Looking for the local server…</p>}
        {offline && (
          <div className={styles.offlineBox}>
            <p className={styles.offlineTitle}>
              <Badge kind="Err">Offline</Badge> The local editor server isn't reachable.
            </p>
            <p className={styles.offlineBody}>
              This panel only works during local development. Start it with{" "}
              <span className={styles.mono}>npm run dev</span> and open this page through{" "}
              <span className={styles.mono}>http://127.0.0.1:5173/editor</span>. On the deployed site, publishing
              is not available — use the Export tab instead.
            </p>
            <div className={styles.composerActions}>
              <button type="button" className={styles.attachBtn} onClick={refresh}>
                Try again
              </button>
              <button type="button" className={styles.primaryBtn} onClick={onGoExport}>
                Go to Export tab
              </button>
            </div>
          </div>
        )}
        {!offline && status !== "checking" && repo && (
          <div className={styles.statusRows}>
            <p className={styles.statusRow}>
              <Badge kind="Ok">Online</Badge>
              <span className={styles.mono}>public/content.json</span> is writable on disk
            </p>
            {repo.isRepo ? (
              <>
                <p className={styles.statusRow}>
                  Branch <span className={styles.mono}>{repo.branch || "?"}</span>
                  {repo.upstream ? (
                    <span className={styles.statusMeta}>
                      {repo.ahead > 0 && <b className={styles.ahead}>↑ {repo.ahead} ahead</b>}
                      {repo.behind > 0 && <b className={styles.behind}>↓ {repo.behind} behind</b>}
                      {repo.ahead === 0 && repo.behind === 0 && <span>in sync</span>}
                    </span>
                  ) : (
                    <span className={styles.statusMeta}>no upstream set yet</span>
                  )}
                </p>
                {repo.dirtyCount > 0 && (
                  <p className={styles.statusRow}>
                    <Badge kind="Warn">
                      {repo.dirtyCount} uncommitted change{repo.dirtyCount === 1 ? "" : "s"} in the repo
                    </Badge>
                    <span className={styles.statusMeta}>only content.json will ever be committed</span>
                  </p>
                )}
                {repo.lastCommit && (
                  <p className={styles.statusRow}>
                    Last commit <span className={styles.mono}>{repo.lastCommit.hash}</span> —{" "}
                    {repo.lastCommit.subject}
                  </p>
                )}
              </>
            ) : (
              <p className={styles.statusRow}>
                <Badge kind="Warn">Not a git repo</Badge>
                <span>
                  Run <span className={styles.mono}>git init</span> inside this folder, then set the repository
                  URL below.
                </span>
              </p>
            )}
          </div>
        )}
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Repository URL</h3>
        <p className={styles.hint}>
          The remote GitHub repo this site lives in — used for push. HTTPS ({" "}
          <span className={styles.mono}>https://github.com/user/repo.git</span>) or SSH (
          <span className={styles.mono}>git@github.com:user/repo.git</span>).
        </p>
        <Field label="Current remote">
          <div className={styles.currentRemote}>
            <span className={styles.mono}>{repo && repo.origin ? repo.origin : "not set"}</span>
          </div>
        </Field>
        <div className={styles.row}>
          <TextInput
            value={remoteUrl}
            onChange={(e) => setRemoteUrl(e.target.value)}
            placeholder="https://github.com/you/your-repo.git"
            aria-label="New repository URL"
          />
          <button type="button" className={styles.primaryBtn} onClick={handleSetRemote} disabled={busy}>
            {repo && repo.origin ? "Update remote" : "Set remote"}
          </button>
        </div>
        <p className={styles.hint}>
          Pushing needs write access to the repo, once per session on this machine (Git Credential Manager or{" "}
          <span className={styles.mono}>gh auth login</span>).
        </p>
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Publish flow</h3>
        <ol className={styles.flow}>
          <li className={`${styles.flowStep} ${saved ? styles.flowDone : ""}`}>
            <div className={styles.flowText}>
              <strong>Save to file</strong>
              <span className={styles.flowHint}>Overwrites public/content.json on disk with the current editor state</span>
            </div>
            <button type="button" className={styles.attachBtn} onClick={handleSave} disabled={busy}>
              {saved ? "Saved ✓" : "Save content.json"}
            </button>
          </li>
          <li className={`${styles.flowStep} ${committed ? styles.flowDone : ""}`}>
            <div className={styles.flowText}>
              <strong>Commit</strong>
              <span className={styles.flowHint}>Records this change in git with your message</span>
            </div>
            <div className={styles.flowControls}>
              <TextInput
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                placeholder="Update site content"
                aria-label="Commit message"
                maxLength={120}
              />
              <button type="button" className={styles.attachBtn} onClick={handleCommit} disabled={busy}>
                {committed ? "Committed ✓" : "Commit"}
              </button>
            </div>
          </li>
          <li className={styles.flowStep}>
            <div className={styles.flowText}>
              <strong>Push to GitHub</strong>
              <span className={styles.flowHint}>You'll be asked to confirm before anything is pushed</span>
            </div>
            <div className={styles.flowControls}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={handlePush}
                disabled={busy || originMissing}
                title={originMissing ? "Set the repository URL first" : undefined}
              >
                Push to GitHub
              </button>
            </div>
          </li>
        </ol>
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Activity log</h3>
        {log.length === 0 ? (
          <p className={styles.hint}>Nothing ran yet.</p>
        ) : (
          <ul className={styles.logList}>
            {log.map((entry, i) => (
              <li key={entry.t + "-" + i} className={`${styles.logItem} ${styles["log" + entry.kind]}`}>
                <LogTime t={entry.t} />
                <span>{entry.msg}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}