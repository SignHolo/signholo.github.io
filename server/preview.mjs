import { createServer } from "node:http"
import { promises as fs } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createApiHandler } from "./backend.mjs"

const HOST = "127.0.0.1"
const PORT = Number(process.env.PORT || 4173)
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const DIST = path.join(ROOT, "dist")
const api = createApiHandler()

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
}

const server = createServer(async (req, res) => {
  if (req.url && req.url.startsWith("/api")) {
    await api(req, res, () => {})
    return
  }

  try {
    let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname)
    let filePath = path.normalize(path.join(DIST, pathname))
    if (!filePath.startsWith(DIST)) {
      res.writeHead(403)
      res.end("Forbidden")
      return
    }
    let stat = await fs.stat(filePath).catch(() => null)
    if (!stat || stat.isDirectory()) {
      filePath = path.join(filePath, "index.html")
      stat = await fs.stat(filePath).catch(() => null)
    }
    if (!stat && !pathname.startsWith("/assets/")) {
      filePath = path.join(DIST, "index.html")
      stat = await fs.stat(filePath).catch(() => null)
    }
    if (!stat) {
      res.writeHead(404)
      res.end("Not found")
      return
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Cache-Control": pathname.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache"
    })
    res.end(await fs.readFile(filePath))
  } catch (err) {
    res.writeHead(500)
    res.end(String(err.message || err))
  }
})

server.listen(PORT, HOST, () => {
  console.log(`SignHolo server running at http://${HOST}:${PORT}`)
  console.log(`API and editor available at http://${HOST}:${PORT}/editor`)
  console.log("Bound to localhost only — not reachable from other devices.")
})