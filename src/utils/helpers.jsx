export function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8)
}

export function formatDate(iso) {
  const then = new Date(iso)
  if (Number.isNaN(then.getTime())) return ""
  const diff = Date.now() - then.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) return "just now"
  if (diff < hour) return Math.floor(diff / minute) + "m ago"
  if (diff < day) return Math.floor(diff / hour) + "h ago"
  if (diff < 7 * day) return Math.floor(diff / day) + "d ago"
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(then)
}

export function parseRich(text) {
  if (!text) return ""
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i}>{part.slice(2, -2)}</strong>
      )
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

export function hashString(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export const GRADIENTS = [
  ["#f5a83b", "#e58ca6"],
  ["#e58ca6", "#a98faf"],
  ["#f5a83b", "#7ea8a0"],
  ["#a98faf", "#f5a83b"],
  ["#e58ca6", "#f3e8d8"]
]