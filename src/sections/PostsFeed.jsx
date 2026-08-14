import { useState } from "react"
import { useContent } from "../hooks/useContent"
import { useReveal } from "../hooks/useReveal"
import PostCard from "../components/PostCard"
import PostModal from "../components/PostModal"
import styles from "./PostsFeed.module.css"

export default function PostsFeed({ world }) {
  const { content } = useContent()
  const [open, setOpen] = useState(false)
  const feedReveal = useReveal()
  const posts = content[world].posts || []
  const title = world === "personal" ? "the feed" : "Field notes"
  const buttonLabel = world === "personal" ? "New post" : "New note"
  const emptyText =
    world === "personal"
      ? "The feed is a blank page. Write the first post — it's good for the soul."
      : "Nothing here yet. Add a short note to share updates with people who land on this side."

  return (
    <section id="feed-section" className={styles.feed} ref={feedReveal.ref} data-reveal={feedReveal.revealed}>
      <div className={styles.feedHead}>
        <div>
          <p className={styles.eyebrow}>
            {world === "personal" ? "p. 05 — " : ""}
            {world === "personal" ? "notes from the feed" : "Updates, lessons, links"}
          </p>
          <h2 className={styles.feedTitle}>{title}</h2>
        </div>
        <button type="button" className={styles.newButton} onClick={() => setOpen(true)}>
          <span aria-hidden="true">+</span> {buttonLabel}
        </button>
      </div>

      {posts.length === 0 ? (
        <p className={styles.empty}>{emptyText}</p>
      ) : (
        <div className={styles.list}>
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} world={world} />
          ))}
        </div>
      )}

      <PostModal open={open} onClose={() => setOpen(false)} world={world} />
    </section>
  )
}