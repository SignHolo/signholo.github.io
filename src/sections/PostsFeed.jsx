import { useContent } from "../hooks/useContent"
import { useReveal } from "../hooks/useReveal"
import PostCard from "../components/PostCard"
import styles from "./PostsFeed.module.css"

export default function PostsFeed({ world }) {
  const { content } = useContent()
  const feedReveal = useReveal()
  const posts = content[world].posts || []
  const title = world === "personal" ? "the feed" : "Field notes"
  const emptyText =
    world === "personal"
      ? "No posts published yet."
      : "No field notes published yet."

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
    </section>
  )
}