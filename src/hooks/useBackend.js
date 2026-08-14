import { useCallback, useEffect, useState } from "react"

const PIN = "1234"

function useLog(limit = 12) {
  const [log, setLog] = useState([])
  const add = useCallback(
    (kind, msg) => setLog((prev) => [{ kind, msg, t: Date.now() }, ...prev].slice(0, limit)),
    [limit]
  )
  return { log, add }
}

export function useBackend() {
  const [status, setStatus] = useState("checking")
  const [repo, setRepo] = useState(null)
  const [busy, setBusy] = useState(false)
  const { log, add } = useLog()

  async function call(path, body) {
    const res = await fetch(path, {
      method: body ? "POST" : "GET",
      headers: {
        "x-signholo-pin": PIN,
        ...(body ? { "Content-Type": "application/json" } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    })
    let data = null
    try {
      data = await res.json()
    } catch {
      data = null
    }
    if (!res.ok) throw new Error((data && data.error) || `Server responded ${res.status}`)
    return data
  }

  const refresh = useCallback(async () => {
    setStatus("checking")
    try {
      await call("/api/health")
      const data = await call("/api/repo")
      setRepo(data.repo)
      setStatus("online")
    } catch {
      setStatus("offline")
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const run = useCallback(
    async (label, fn) => {
      setBusy(true)
      try {
        const result = await fn()
        add("ok", label)
        return result
      } catch (err) {
        add("err", label + " — " + err.message)
        throw err
      } finally {
        setBusy(false)
      }
    },
    [add]
  )

  const saveContent = useCallback(
    (content) =>
      run("Saved content.json to disk", () =>
        call("/api/content", { content }).then((d) => {
          add("info", "File written: " + d.path)
          return d
        })
      ),
    [run, call, add]
  )

  const setRemote = useCallback(
    (url) =>
      run("Repository URL set (" + url + ")", () => call("/api/repo", { url }).then(refresh)),
    [run, call, refresh]
  )

  const commit = useCallback(
    (message) =>
      run("Committed", () =>
        call("/api/commit", { message }).then((d) => {
          if (d.ok && d.committed) add("info", "Commit " + d.hash + ": " + d.message)
          refresh()
          return d
        })
      ),
    [run, call, add, refresh]
  )

  const push = useCallback(
    () =>
      run("Pushed to origin", () =>
        call("/api/push").then((d) => {
          add("info", d.output)
          refresh()
          return d
        })
      ),
    [run, call, add, refresh]
  )

  return { status, repo, busy, log, refresh, saveContent, setRemote, commit, push }
}