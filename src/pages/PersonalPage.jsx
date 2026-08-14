import PersonalSections from "../sections/personal/PersonalSections"
import PostsFeed from "../sections/PostsFeed"
import styles from "./pages.module.css"

export default function PersonalPage() {
  return (
    <div className={styles.world}>
      <div className={styles.blobWrap} aria-hidden="true">
        <div className={`${styles.blob} ${styles.blobOne}`} />
        <div className={`${styles.blob} ${styles.blobTwo}`} />
      </div>

      <div className="mx-auto max-w-[76rem] px-5">
        <PersonalSections />
        <PostsFeed world="personal" />
      </div>
    </div>
  )
}