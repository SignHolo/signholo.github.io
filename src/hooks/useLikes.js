import { useCallback, useState } from "react"

const LS_KEY = "signholo.likes.v1"

function readDeltas() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}")
  } catch {
    return {}
  }
}

export function useLikes() {
  const [deltas, setDeltas] = useState(readDeltas)

  const likeCount = useCallback(
    (post) => (post.likes || 0) + (deltas[post.id] || 0),
    [deltas]
  )

  const increment = useCallback((id) => {
    setDeltas((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + 1 }
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { likeCount, increment }
}