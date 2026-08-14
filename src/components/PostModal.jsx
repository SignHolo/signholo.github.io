import { useEffect, useRef, useState } from "react"
import { useContent } from "../hooks/useContent"
import { uid } from "../utils/helpers"
import Modal from "./Modal"
import { useToast } from "./Toast"
import styles from "./PostModal.module.css"

export default function PostModal({ open, onClose, world }) {
  const { content, updateContent } = useContent()
  const showToast = useToast()
  const [text, setText] = useState("")
  const [image, setImage] = useState("")
  const fileRef = useRef(null)
  const section = content[world]
  const postWord = world === "personal" ? "post" : "note"

  useEffect(() => {
    if (open) {
      setText("")
      setImage("")
    }
  }, [open])

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
      [world]: { ...prev[world], posts: [post, ...prev[world].posts] }
    }))
    showToast(world === "personal" ? "Post published" : "Note published")
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} label={postWord === "post" ? "Write a post" : "Write a note"}>
      <h2 className={styles.title}>{postWord === "post" ? "Write a post" : "Write a note"}</h2>
      <p className={styles.bio}>
        {world === "personal"
          ? "Unfiltered, uncurated, slightly warm."
          : "Concise, structured, professional tone."}
      </p>
      <textarea
        className={styles.textarea}
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={postWord === "post" ? "What's on your mind?" : "Share an update, a lesson, a link…"}
        aria-label="Post content"
        autoFocus
      />
      {image && (
        <div className={styles.preview}>
          <img src={image} alt="Preview of attached image" />
          <button type="button" className={styles.removeImage} onClick={() => setImage("")} aria-label="Remove attached image">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
      <div className={styles.actions}>
        <button type="button" className={styles.attach} onClick={() => fileRef.current && fileRef.current.click()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="9" cy="9" r="1.6" fill="currentColor" />
            <path d="M21 15l-5-5-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {image ? "Replace image" : "Attach image"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={onFile}
          aria-label="Upload image"
        />
        <div className={styles.right}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.publish} onClick={publish}>
            {postWord === "post" ? "Publish post" : "Publish note"}
          </button>
        </div>
      </div>
    </Modal>
  )
}