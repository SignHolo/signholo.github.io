import { useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom"
import { ContentProvider } from "./hooks/useContent"
import { ToastProvider } from "./components/Toast"
import Header from "./components/Header"
import PersonalPage from "./pages/PersonalPage"
import ProfessionalPage from "./pages/ProfessionalPage"
import EditorApp from "./editor/EditorApp"
import Seal from "./components/Seal"
import BackToTop from "./components/BackToTop"
import styles from "./App.module.css"

function NotFound() {
  return (
    <div className="mx-auto max-w-[76rem] px-5 py-24 text-center">
      <div className="mb-6 flex justify-center">
        <Seal size={80} iridescent />
      </div>
      <h1 className="font-display text-2xl font-bold">Lost between worlds</h1>
      <p className="mx-auto mt-3 max-w-md opacity-70">
        This page doesn't exist — but both sides of the site are right here.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/" className={styles.fallbackLink}>
          Personal
        </Link>
        <Link to="/professional" className={styles.fallbackLink}>
          Professional
        </Link>
      </div>
    </div>
  )
}

function Shell() {
  const location = useLocation()
  const world = location.pathname.startsWith("/professional")
    ? "professional"
    : location.pathname.startsWith("/editor")
    ? "tool"
    : "personal"

  useEffect(() => {
    document.documentElement.setAttribute("data-world", world)
  }, [world])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return
      if (e.key === "1") window.location.href = import.meta.env.BASE_URL || "/"
      if (e.key === "2") window.location.href = (import.meta.env.BASE_URL || "/") + "professional"
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div data-world={world} className={styles.app}>
      {world !== "tool" && <Header />}
      <main id="main" key={location.pathname} className="world-enter">
        <Routes>
          <Route path="/" element={<PersonalPage />} />
          <Route path="/professional" element={<ProfessionalPage />} />
          <Route path="/editor" element={<EditorApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {world !== "tool" && (
        <footer className={styles.footer}>
          <p>
            Made with <Link to="/editor" className={styles.footerLink}>the SignHolo editor</Link> · two worlds, one seal
          </p>
          <p className={styles.footerHint}>
            <kbd className={styles.kbd}>1</kbd> personal · <kbd className={styles.kbd}>2</kbd> professional
          </p>
        </footer>
      )}
      <BackToTop />
    </div>
  )
}

export default function App() {
  const base = import.meta.env.BASE_URL
  const basename = base === "/" ? "" : base.replace(/\/+$/, "")

  return (
    <BrowserRouter basename={basename}>
      <ContentProvider>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </ContentProvider>
    </BrowserRouter>
  )
}