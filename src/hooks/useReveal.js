import { useEffect, useRef, useState } from "react"

/**
 * Scroll-triggered reveal hook.
 * Returns a ref to attach to the element and a `revealed` boolean.
 * The element starts invisible and transitions in when it enters the viewport.
 * Respects prefers-reduced-motion — immediately reveals without animation.
 */
export function useReveal({ threshold = 0.12, once = true } = {}) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduced) {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          if (once) observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return { ref, revealed }
}
