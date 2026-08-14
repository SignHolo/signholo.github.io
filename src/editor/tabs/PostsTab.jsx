import { useRef, useState } from "react"
import { useContent } from "../../hooks/useContent"
import { formatDate, uid } from "../../utils/helpers"
import { useToast } from "../../components/Toast"
import styles from "../editor.module.css"

export default function PostsTab() {
  const { content, updateContent } = useContent()
  const showToast = useToast()
  const [side, setSide] = useState("personal")
  const [text, setText] = useState("")
  const [image, setImage] = useState("")
  const fileRef = useRef(null)
  const areaRef = useRef(null)

  const section = content[side]
  const sectionLabel = side === "personal" ? "Personal" : "Professional"

  function wrap(marker) {
    const area = areaRef.current
    if (!area) return
    const { selectionStart: start, selectionEnd: end, value } = area
    const selected = value.slice(start, end) || (marker === "**" ? "bold text" : "italic text")
    const wrapped = marker + selected + marker
    area.setRangeText(wrapped, start, end, "end")
    setText(area.value)
    area.focus()
  }

  function onFile(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    if (file.size > 1200 * 1024) {
      showToast("Image is over 1.2 MB — try a smaller one")
      return
    }
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result)
    reader.readAsDataURL(file)
  }

  function publish() {
    const body = text.trim()
    if (!body) {
      showToast("Write something before publishing")
      return
    }
    const post = {
      id: uid(),
      author: section.name || "Me",
      timestamp: new Date().toISOString(),
      content: body,
      image: image || "",
      likes: 0
    }
    updateContent((prev) => ({
      ...prev,
      [side]: { ...prev[side], posts: [post, ...prev[side].posts] }
    }))
    setText("")
    setImage("")
    showToast(`Published to the ${sectionLabel} feed`)
  }

  function removePost(id) {
    updateContent((prev) => ({
      ...prev,
      [side]: { ...prev[side], posts: prev[side].posts.filter((p) => p.id !== id) }
    }))
    showToast("Post deleted")
  }

  return (
    <div className={styles.stack}>
      <div className={styles.seg}>
        <button type="button" className={`${styles.segBtn} ${side === "personal" ? styles.segActive : ""}`} onClick={() => setSide("personal")}>
          Personal posts
        </button>
        <button type="button" className={`${styles.segBtn} ${side === "professional" ? styles.segActive : ""}`} onClick={() => setSide("professional")}>
          Professional posts
        </button>
      </div>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>New {sectionLabel.toLowerCase()} post</h3>
        <div className={styles.toolbar} aria-label="Text formatting">
          <button type="button" className={styles.toolBtn} onClick={() => wrap("**")} title="Bold">
            <strong>B</strong>
          </button>
          <button type="button" className={styles.toolBtn} onClick={() => wrap("_")} title="Italic" style={{ fontStyle: "italic" }}>
            I
          </button>
        </div>
        <textarea
          ref={areaRef}
          className={styles.textarea}
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write the post… select text and use B / I to format it"
          aria-label="Post content"
        />
        {image && (
          <div className={styles.imgPreview}>
            <img src={image} alt="Preview of attached image" />
            <button type="button" className={styles.imgRemove} onClick={() => setImage("")} aria-label="Remove image">
              ✕
            </button>
          </div>
        )}
        <div className={styles.composerActions}>
          <button type="button" className={styles.attachBtn} onClick={() => fileRef.current && fileRef.current.click()}>
            {image ? "Replace image" : "Attach image"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={styles.hiddenInput}
            onChange={onFile}
            aria-label="Upload image"
          />
          <button type="button" className={styles.primaryBtn} onClick={publish}>
            Publish to {sectionLabel} feed
          </button>
        </div>
      </section>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>
          {sectionLabel} posts <span className={styles.count}>({section.posts.length})</span>
        </h3>
        <ul className={styles.postList}>
          {section.posts.map((post) => (
            <li key={post.id} className={styles.postRow}>
              <div className={styles.postInfo}>
                <span className={styles.postText}>
                  {post.content.length > 70 ? post.content.slice(0, 70) + "…" : post.content}
                </span>
                <span className={styles.postMeta}>
                  {formatDate(post.timestamp)} · {post.likes} likes{post.image ? " · 📷" : ""}
                </span>
              </div>
              <button type="button" className={styles.miniBtn} onClick={() => removePost(post.id)}>
                Delete
              </button>
            </li>
          ))}
          {section.posts.length === 0 && <p className={styles.hint}>No posts here yet — write the first one above.</p>}
        </ul>
      </section>
    </div>
  )
}