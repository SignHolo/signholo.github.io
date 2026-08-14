import { createContext, useCallback, useContext, useRef, useState } from "react"
import styles from "./Toast.module.css"

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const idRef = useRef(0)

  const show = useCallback((message) => {
    const id = ++idRef.current
    setItems((prev) => [...prev, { id, message }])
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 2600)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className={styles.stage} role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={styles.toast}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext).show
}