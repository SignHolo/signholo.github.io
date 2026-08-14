import { useLikes } from "../hooks/useLikes"
import { formatDate, parseRich } from "../utils/helpers"
import LikeButton from "./LikeButton"
import styles from "./PostCard.module.css"

function readingTime(text) {
  const words = (text || "").split(/\s+/).filter(Boolean).length
  return words < 30 ? "quick read" : Math.ceil(words / 200) + " min read"
}

function Avatar({ name }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?"
  return (
    <span className={styles.avatar} aria-hidden="true">
      {initial}
    </span>
  )
}

export default function PostCard({ post, index, world }) {
  const { likeCount, increment } = useLikes()
  const count = likeCount(post)
  const liked = count > (post.likes || 0)

  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <Avatar name={post.author} />
        <div className={styles.byline}>
          <span className={styles.author}>{post.author}</span>
          <span className={styles.time}>{formatDate(post.timestamp)}</span>
          <span className={styles.readTime}>{readingTime(post.content)}</span>
        </div>
        {world === "personal" && (
          <span className={styles.num} aria-hidden="true">
            № {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>

      <p className={styles.content}>{parseRich(post.content)}</p>

      {post.image && (
        <div className={styles.media}>
          <img src={post.image} alt="" loading="lazy" />
        </div>
      )}

      <div className={styles.foot}>
        <LikeButton
          liked={liked}
          count={count}
          onClick={() => increment(post.id)}
          label={world === "personal" ? "Like this post" : "Appreciate this note"}
        />
      </div>
    </article>
  )
}