import { useEffect, useState } from "react"

const TYPE_MS = 55
const DELETE_MS = 28
const HOLD_MS = 2300

export function useTypewriter(taglines) {
  const list = taglines && taglines.length ? taglines : [""]
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const [text, setText] = useState(reduced ? list[0] : "")
  const [caret, setCaret] = useState(!reduced)

  useEffect(() => {
    if (reduced) {
      setText(list[0])
      setCaret(false)
      return
    }
    let phrase = 0
    let char = 0
    let deleting = false
    let hold = false
    let timer = null

    const tick = () => {
      const current = list[phrase % list.length]
      if (!deleting && !hold) {
        char++
        setText(current.slice(0, char))
        if (char === current.length) {
          hold = true
          timer = setTimeout(() => {
            hold = false
            deleting = true
            timer = setTimeout(tick, 60)
          }, HOLD_MS)
          return
        }
        timer = setTimeout(tick, TYPE_MS)
      } else if (deleting) {
        char--
        setText(current.slice(0, char))
        if (char === 0) {
          deleting = false
          phrase++
        }
        timer = setTimeout(tick, DELETE_MS)
      }
    }

    timer = setTimeout(tick, 900)
    return () => clearTimeout(timer)
  }, [JSON.stringify(list), reduced])

  return { text, caret }
}