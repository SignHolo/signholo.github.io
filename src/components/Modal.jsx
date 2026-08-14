import { useEffect, useRef } from "react"
import styles from "./Modal.module.css"

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export default function Modal({ open, onClose, label, children, wide = false }) {
  const dialogRef = useRef(null)
  const lastActive = useRef(null)

  useEffect(() => {
    if (!open) return
    lastActive.current = document.activeElement
    const dialog = dialogRef.current
    if (dialog) {
      const focusables = dialog.querySelectorAll(FOCUSABLE)
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (first) first.focus()

      const onKey = (e) => {
        if (e.key === "Escape") {
          e.stopPropagation()
          onClose()
        }
        if (e.key === "Tab") {
          const list = dialog.querySelectorAll(FOCUSABLE)
          if (!list.length) {
            e.preventDefault()
            return
          }
          const firstEl = list[0]
          const lastEl = list[list.length - 1]
          if (e.shiftKey && document.activeElement === firstEl) {
            e.preventDefault()
            lastEl.focus()
          } else if (!e.shiftKey && document.activeElement === lastEl) {
            e.preventDefault()
            firstEl.focus()
          }
        }
      }
      document.addEventListener("keydown", onKey)
      return () => {
        document.removeEventListener("keydown", onKey)
        if (lastActive.current && lastActive.current.focus) lastActive.current.focus()
      }
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`${styles.dialog} ${wide ? styles.wide : ""}`}
      >
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}