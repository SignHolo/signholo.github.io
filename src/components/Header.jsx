import { useState, useEffect } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import Seal from "./Seal"
import { useContent } from "../hooks/useContent"
import styles from "./Header.module.css"

export default function Header() {
  const location = useLocation()
  const world = location.pathname.startsWith("/professional") ? "professional" : "personal"
  const { content } = useContent()
  const [progress, setProgress] = useState(0)

  const name = (world === "professional" ? content?.professional?.name : content?.personal?.name) || "SignHolo"

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${world === "professional" ? styles.proHeader : ""}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <Seal size={32} iridescent={world === "personal"} />
          <span className={styles.brandName}>{name}</span>
        </Link>

        <nav className={styles.nav} aria-label="Worlds">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ""}`}
          >
            Personal
          </NavLink>
          <NavLink
            to="/professional"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ""}`}
          >
            Professional
          </NavLink>
        </nav>
      </div>
      <div
        className={styles.progress}
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
    </header>
  )
}