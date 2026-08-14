import ProfessionalSections from "../sections/professional/ProfessionalSections"
import PostsFeed from "../sections/PostsFeed"
import styles from "./pages.module.css"

export default function ProfessionalPage() {
  return (
    <div className={styles.world}>
      <div className="mx-auto max-w-[76rem] px-5">
        <ProfessionalSections />
        <PostsFeed world="professional" />
      </div>
    </div>
  )
}