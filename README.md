# SignHolo — Personal site & visual editor

A React single-page application with **two worlds** — a warm, expressive **Personal** side and a clean,
structured **Professional** side — plus a password-protected **visual editor** that edits everything and
publishes directly to git.

- **Personal** (`/`) — midnight-zine world: Unbounded display type, plum & honey palette, typewriter hero,
  sticky-note facts, hobby cards, "on rotation" music mood board, and a personal posts feed with likes.
- **Professional** (`/professional`) — stone-ledger world: Archivo + IBM Plex system, hairline rules,
  structured grid, availability badge, focus areas, project cards with detail modals, contact links, and a formal field-notes feed.
- **Editor** (`/editor`) — PIN-gated (hardcoded `1234`), five tabs (Personal / Professional / Posts / Publish / Export),
  autosaves to localStorage, and can write, commit and push `content.json` straight into the repo — **local development only**.

## Tech

React 19 · Vite 7 · React Router v6 · Tailwind CSS (utility) + CSS Modules (theme isolation) · localStorage ·
zero-dependency Node backend (built-in `http` + git CLI) · no deployed backend — GitHub Pages stays fully static.

## Local development

```bash
npm install
npm run dev        # http://127.0.0.1:5173  (Vite + the local editor backend)
npm run build      # production build into dist/
npm run preview    # http://127.0.0.1:4173  (serves dist/ + the editor backend, localhost only)
```

The site loads its content from `public/content.json` on startup. If an editor draft exists in localStorage it
takes priority (the editor shows "Local draft active" in that case).

## The editor backend (local only)

`/editor` is powered by a small Node server that lives inside your Vite dev server (`server/backend.mjs`,
mounted on `/api`). It runs on `127.0.0.1` and is **never deployed** — the live GitHub Pages site is 100%
static, exactly as before. The Publish tab shows "Offline" there and falls back to manual export.

What the backend does — each step is a separate button so nothing happens by surprise:

1. **Save to file** — overwrites `public/content.json` on disk with the current editor state.
2. **Commit** — `git add public/content.json` (only this file, never `git add -A`) + `git commit` with a
   message you type in the editor.
3. **Push** — asks for confirmation (`Push to <url> on branch <branch>?`) before running
   `git push origin <branch>`.

The Publish tab also has a **Repository URL** section: it reads the current `git remote origin` for you, and
lets you set or update it (HTTPS or SSH). Push requires write access to that repo, once per session on your
machine (Git Credential Manager on Windows, or `gh auth login`).

### Security / config notes

- The PIN is checked twice: the editor UI gate (`src/editor/PinGate.jsx`) and every backend call
  (`server/backend.mjs`, header `x-signholo-pin`). Change `1234` in **both** places — or set the env var
  `SIGNHOLO_PIN` for the server (`$env:SIGNHOLO_PIN = "…"` PowerShell / `SIGNHOLO_PIN=… npm run dev` bash).
- The server binds to `127.0.0.1` and rejects browser requests coming from non-local origins.
- If push fails: authentication → `gh auth login` (or sign in via Git Credential Manager);
  "non-fast-forward / rejected" → the repo has commits you don't — pull/push from a terminal once;
  "not a git repo" → run `git init` then set the repository URL in the Publish tab.

## Deploying to GitHub Pages

Two supported routes — pick one.

### 1. GitHub Actions (recommended)

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Source → GitHub Actions**.
3. Push to `main`. The included workflow builds with the correct base path (user page or project page — it
   detects `username.github.io` automatically) and deploys.

### 2. Manual

```bash
# User page (username.github.io) — base is already '/'
npm run build

# Project page (username.github.io/repo-name)
npm run build -- --base=/repo-name/
```

Then push the contents of `dist/` to the `gh-pages` branch (or serve `dist` however you like).

**SPA routing:** `404.html` + the snippet in `index.html` make deep links like `/professional` work on GitHub
Pages. No configuration needed for either user pages or project pages.

## Using the editor

1. Open `/editor` (e.g. `http://127.0.0.1:5173/editor`).
2. Enter the PIN.
3. Edit away. Everything saves to localStorage **automatically**.
4. **Personal / Professional / Posts** tabs edit content; **Publish** tab writes it to disk and commits and
   pushes to your repo (with a confirmation before the push); **Export** downloads `content.json` as a
   fallback when you're not on localhost.

Notes:

- Likes are stored per-browser in localStorage (`signholo.likes.v1`) and start from the like counts in
  `content.json`.
- Post images are embedded (base64) in the exported JSON — keep them under ~1.2 MB.
- The Export tab can also **Discard local draft** to go back to the shipped content.

## Project structure

```
public/content.json      all site content (the editor writes and commits exactly this file)
server/backend.mjs       the local API: content save, git remote, commit, push
server/preview.mjs       standalone local server for the built site (dist + /api)
src/
  components/            Seal, Header, Modal (focus-trap), PostModal, PostCard, LikeButton, Toast
  sections/personal/     the midnight-zine world
  sections/professional/ the stone-ledger world
  sections/PostsFeed.jsx shared feed used by both worlds
  editor/                PIN gate + 5 tabs
  hooks/                 useContent (fetch + localStorage), useLikes, useTypewriter, useBackend
  utils/                 rich-text parser, dates, ids
  data/sample.js         fallback content if content.json is missing
```

## Design notes

Both worlds share one voice: the **SignHolo seal** (a scribbled signature in a dotted ring). On the personal
side it shimmers with an iridescent gradient; on the professional side it sits as a charcoal embossed mark —
one identity, two registers. Palettes and type are swapped via `data-world` tokens in `src/index.css`:

| | Personal (night side) | Professional (day side) |
|---|---|---|
| background | deep aubergine plum `#211527` | warm stone `#F2F1EC` |
| ink | warm ivory `#F3E8D8` | charcoal-plum `#23222A` |
| accent | honey `#F5A83B` + blush `#E58CA6` | muted ash-plum `#6B5B76` |
| display type | Unbounded | Archivo |
| body type | Manrope | IBM Plex Sans |
| meta type | Space Mono | IBM Plex Mono |

Accessibility: focus is trapped and restored in every modal, ESC closes, visible focus rings, and all
animation is disabled under `prefers-reduced-motion`.
