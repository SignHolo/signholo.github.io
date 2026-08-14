import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { DEFAULT_CONTENT } from "../data/sample"

const LS_KEY = "signholo.content.v1"
const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [ready, setReady] = useState(false)
  const [localDraft, setLocalDraft] = useState(false)
  const shipped = useRef(DEFAULT_CONTENT)

  useEffect(() => {
    let cancelled = false
    fetch(import.meta.env.BASE_URL + "content.json")
      .then((r) => {
        if (!r.ok) throw new Error("content.json missing")
        return r.json()
      })
      .then((json) => {
        shipped.current = { ...DEFAULT_CONTENT, ...json }
        const saved = localStorage.getItem(LS_KEY)
        if (!cancelled) {
          setContent(saved ? JSON.parse(saved) : shipped.current)
          setLocalDraft(Boolean(saved))
          setReady(true)
        }
      })
      .catch(() => {
        const saved = localStorage.getItem(LS_KEY)
        if (!cancelled) {
          setContent(saved ? JSON.parse(saved) : DEFAULT_CONTENT)
          setLocalDraft(Boolean(saved))
          setReady(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const updateContent = useCallback((updater) => {
    setContent((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      setLocalDraft(true)
      return next
    })
  }, [])

  const discardLocal = useCallback(() => {
    localStorage.removeItem(LS_KEY)
    setContent(shipped.current)
    setLocalDraft(false)
  }, [])

  return (
    <ContentContext.Provider value={{ content, updateContent, discardLocal, localDraft, ready }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  return useContext(ContentContext)
}