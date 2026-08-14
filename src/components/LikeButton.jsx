import styles from "./LikeButton.module.css"

export default function LikeButton({ liked, count, onClick, label }) {
  return (
    <button
      type="button"
      className={`${styles.like} ${liked ? styles.on : ""}`}
      onClick={onClick}
      aria-label={label + " — " + count + " likes"}
    >
      <span className={styles.heart} aria-hidden="true">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21s-7.5-4.6-10-9.2C.3 8.4 2.2 4.5 5.9 4.2c2.2-.2 4.1 1 6.1 3.4 2-2.4 3.9-3.6 6.1-3.4 3.7.3 5.6 4.2 3.9 7.6-2.5 4.6-10 9.2-10 9.2z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={styles.count}>{count}</span>
    </button>
  )
}