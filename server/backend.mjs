import { promises as fs } from "node:fs"
import path from "node:path"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { fileURLToPath } from "node:url"

const execFileP = promisify(execFile)
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const CONTENT_FILE = path.join(ROOT, "public", "content.json")
const PIN = process.env.SIGNHOLO_PIN || "1234"
export const API_PREFIX = "/api"

const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/
const REMOTE_PATTERN = /^(https?:\/\/|git@|ssh:\/\/|git:\/\/)\S+$/
const MAX_BODY = 32 * 1024 * 1024

async function gitRaw(args, env) {
  try {
    const { stdout, stderr } = await execFileP("git", args, {
      cwd: ROOT,
      env,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
      timeout: 30000,
      windowsHide: true
    })
    return { ok: true, stdout: stdout.trim(), stderr: stderr.trim() }
  } catch (err) {
    return {
      ok: false,
      stdout: (err.stdout || "").toString().trim(),
      stderr: (err.stderr || "").toString().trim(),
      raw: err.message
    }
  }
}

function git(args) {
  return gitRaw(args, process.env)
}

function gitNoPrompt(args) {
  return gitRaw(args, { ...process.env, GIT_TERMINAL_PROMPT: "0" })
}

function send(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  })
  res.end(JSON.stringify(body))
}

async function readBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY) {
      throw Object.assign(new Error("Body too large"), { status: 413 })
    }
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8").replace(/^\uFEFF/, ""))
}

async function repoInfo() {
  const info = { isRepo: false }
  const inRepo = await git(["rev-parse", "--is-inside-work-tree"])
  if (!inRepo.ok) return info

  info.isRepo = true
  info.branch = (await git(["rev-parse", "--abbrev-ref", "HEAD"])).stdout || null

  const origin = await git(["remote", "get-url", "origin"])
  info.origin = origin.ok ? origin.stdout : null

  const upstream = await git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"])
  info.upstream = upstream.ok ? upstream.stdout : null
  info.ahead = 0
  info.behind = 0
  if (upstream.ok) {
    const counts = await git(["rev-list", "--left-right", "--count", "HEAD...@{u}"])
    if (counts.ok) {
      const [ahead, behind] = counts.stdout.split(/\s+/).map(Number)
      info.ahead = ahead
      info.behind = behind
    }
  }

  const status = await git(["status", "--porcelain"])
  info.dirty = status.ok && status.stdout ? status.stdout.split("\n").filter(Boolean) : []
  info.dirtyCount = info.dirty.length

  const last = await git(["log", "-1", "--format=%h%x09%s%x09%aI"])
  if (last.ok && last.stdout) {
    const [hash, subject, date] = last.stdout.split("\t")
    info.lastCommit = { hash, subject, date }
  } else {
    info.lastCommit = null
  }

  return info
}

export function createApiHandler() {
  return async (req, res, next) => {
    const url = new URL(req.url, "http://localhost")
    const origin = req.headers.origin || ""
    if (origin && !LOCAL_ORIGIN.test(origin)) {
      send(res, 403, { ok: false, error: "Forbidden origin" })
      return
    }
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin)
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-signholo-pin")
    }
    if (req.method === "OPTIONS") {
      res.writeHead(204)
      res.end()
      return
    }

    if (!url.pathname.startsWith(API_PREFIX)) return next()
    const route = url.pathname.slice(API_PREFIX.length) || "/"
    const method = req.method.toUpperCase()

    if (route === "/health" && method === "GET") {
      send(res, 200, { ok: true, root: ROOT, contentFile: path.relative(ROOT, CONTENT_FILE) })
      return
    }

    if (req.headers["x-signholo-pin"] !== PIN) {
      send(res, 401, { ok: false, error: "Missing or wrong PIN" })
      return
    }

    try {
      if (route === "/content" && method === "GET") {
        const raw = await fs.readFile(CONTENT_FILE, "utf8")
        send(res, 200, { ok: true, content: JSON.parse(raw.replace(/^\uFEFF/, "")) })
        return
      }

      if (route === "/content" && method === "POST") {
        const body = await readBody(req)
        if (!body || typeof body.content !== "object") {
          send(res, 400, { ok: false, error: "Body must be { content: {...} }" })
          return
        }
        await fs.mkdir(path.dirname(CONTENT_FILE), { recursive: true })
        await fs.writeFile(CONTENT_FILE, JSON.stringify(body.content, null, 2) + "\n", "utf8")
        send(res, 200, { ok: true, saved: true, path: path.relative(ROOT, CONTENT_FILE) })
        return
      }

      if (route === "/repo" && method === "GET") {
        send(res, 200, { ok: true, repo: await repoInfo() })
        return
      }

      if (route === "/repo" && method === "POST") {
        const body = await readBody(req)
        const url = String(body.url || "").trim()
        if (!REMOTE_PATTERN.test(url)) {
          send(res, 400, { ok: false, error: "Not a valid repo URL — use https://…, git@… or ssh://…" })
          return
        }
        const isRepo = (await git(["rev-parse", "--is-inside-work-tree"])).ok
        if (!isRepo) {
          await git(["init"])
          await git(["branch", "-M", "main"])
        }
        const exists = await git(["remote", "get-url", "origin"])
        const set = exists.ok
          ? await git(["remote", "set-url", "origin", url])
          : await git(["remote", "add", "origin", url])
        if (!set.ok) {
          send(res, 500, { ok: false, error: set.stderr || "Could not set remote" })
          return
        }
        send(res, 200, { ok: true, url, action: exists.ok ? "updated" : "added" })
        return
      }

      if (route === "/commit" && method === "POST") {
        const body = await readBody(req)
        const message = String(body.message || "").trim().slice(0, 200)
        if (!message) {
          send(res, 400, { ok: false, error: "Commit message is required" })
          return
        }
        if (!(await git(["rev-parse", "--is-inside-work-tree"])).ok) {
          send(res, 400, { ok: false, code: "not-a-repo", error: "This folder is not a git repository" })
          return
        }
        const add = await git(["add", "--", path.relative(ROOT, CONTENT_FILE).split(path.sep).join("/")])
        if (!add.ok) {
          send(res, 500, { ok: false, error: add.stderr || "git add failed" })
          return
        }
        const commit = await git(["commit", "-m", message])
        if (!commit.ok) {
          const gitMsg = (commit.stderr || commit.stdout).trim()
          if (/nothing to commit|no changes added|nothing added/i.test(gitMsg)) {
            send(res, 200, { ok: false, code: "nothing-to-commit", error: "Nothing to commit — the file is unchanged" })
          } else {
            send(res, 500, { ok: false, error: gitMsg || "git commit failed" })
          }
          return
        }
        const hash = (await git(["rev-parse", "--short", "HEAD"])).stdout
        send(res, 200, { ok: true, committed: true, hash, message })
        return
      }

      if (route === "/push" && method === "POST") {
        if (!(await git(["rev-parse", "--is-inside-work-tree"])).ok) {
          send(res, 400, { ok: false, code: "not-a-repo", error: "This folder is not a git repository" })
          return
        }
        const origin = await git(["remote", "get-url", "origin"])
        if (!origin.ok) {
          send(res, 400, { ok: false, code: "no-remote", error: "No git remote set — set the repository URL first" })
          return
        }
        const branch = (await git(["rev-parse", "--abbrev-ref", "HEAD"])).stdout || "HEAD"
        const upstream = await git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"])
        const args = upstream.ok ? ["push", "origin", branch] : ["push", "-u", "origin", branch]
        const push = await gitNoPrompt(args)
        if (!push.ok) {
          const gitMsg = (push.stderr || push.stdout).trim()
          send(res, 502, {
            ok: false,
            code: "push-failed",
            error: gitMsg || "git push failed",
            hint: /authentication|permission|denied/i.test(gitMsg)
              ? "Authentication failed. Log in once via Git Credential Manager or run: gh auth login"
              : /rejected|non-fast-forward/i.test(gitMsg)
                ? "Remote has commits you don't have — pull first, then push again"
                : null
          })
          return
        }
        send(res, 200, { ok: true, pushed: true, output: push.stdout || push.stderr || "Pushed" })
        return
      }

      send(res, 404, { ok: false, error: "Unknown route" })
    } catch (err) {
      const status = err.status || 500
      send(res, status, { ok: false, error: err.status ? err.message : "Server error: " + err.message })
    }
  }
}