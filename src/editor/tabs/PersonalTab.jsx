import { useState } from "react"
import { useContent } from "../../hooks/useContent"
import { formatDate } from "../../utils/helpers"
import { useToast } from "../../components/Toast"
import { Field, TextInput, TextArea, IconButton, AddButton, SectionCard } from "../ui"
import styles from "../editor.module.css"

const EMOJIS = [
  "🎧", "✂️", "📷", "🌿", "🎮", "🍜", "☕", "📚", "🎨", "🚴",
  "🎹", "🌊", "✈️", "⛺", "🎬", "🧑‍🍳", "🏡", "🐈", "🌱", "🧶",
  "🎲", "🎳", "🧘", "👟", "🎸", "🥁", "🎙️", "🖋️", "📓", "🧩",
  "🎪", "🌙", "🎐", "🪴", "🥾", "🦉", "🏃", "☁️", "🍳", "🧺"
]

export default function PersonalTab() {
  const { content, updateContent } = useContent()
  const showToast = useToast()
  const [emojiOpen, setEmojiOpen] = useState(null)
  const p = content.personal

  function patch(patchObj) {
    updateContent((prev) => ({ ...prev, personal: { ...prev.personal, ...patchObj } }))
  }

  function patchHobby(i, patchObj) {
    updateContent((prev) => {
      const hobbies = prev.personal.hobbies.map((h, idx) => (idx === i ? { ...h, ...patchObj } : h))
      return { ...prev, personal: { ...prev.personal, hobbies } }
    })
  }

  function patchMusic(i, patchObj) {
    updateContent((prev) => {
      const music = prev.personal.music.map((m, idx) => (idx === i ? { ...m, ...patchObj } : m))
      return { ...prev, personal: { ...prev.personal, music } }
    })
  }

  function patchFact(i, patchObj) {
    updateContent((prev) => {
      const facts = prev.personal.facts.map((f, idx) => (idx === i ? { ...f, ...patchObj } : f))
      return { ...prev, personal: { ...prev.personal, facts } }
    })
  }

  function patchSocialLink(i, patchObj) {
    updateContent((prev) => {
      const socialLinks = (prev.personal.socialLinks || []).map((l, idx) => (idx === i ? { ...l, ...patchObj } : l))
      return { ...prev, personal: { ...prev.personal, socialLinks } }
    })
  }

  return (
    <div className={styles.stack}>
      <SectionCard title="Identity & Profile">
        <div className={styles.grid2}>
          <Field label="Name">
            <TextInput value={p.name || ""} onChange={(e) => patch({ name: e.target.value })} />
          </Field>
          <Field label="Avatar image URL">
            <TextInput value={p.avatarUrl || ""} onChange={(e) => patch({ avatarUrl: e.target.value })} placeholder="https://… (empty = initial letter)" />
          </Field>
        </div>

        <Field label="Currently crafting status" hint="Shown on the status badge below avatar / hero">
          <TextInput value={p.currentStatus || ""} onChange={(e) => patch({ currentStatus: e.target.value })} placeholder="Analog audio loops & modular synths" />
        </Field>

        <div className={styles.grid2}>
          <Field label="Location" hint="Shown in the About Me quote card">
            <TextInput value={p.location || ""} onChange={(e) => patch({ location: e.target.value })} placeholder="Surabaya, ID" />
          </Field>
          <Field label="Vibe tagline" hint="Shown in the About Me quote card">
            <TextInput value={p.vibe || ""} onChange={(e) => patch({ vibe: e.target.value })} placeholder="Ambient & Analog" />
          </Field>
        </div>

        <Field label="Hero badge text" hint="Eyebrow text above the hero title">
          <TextInput value={p.heroBadge || ""} onChange={(e) => patch({ heroBadge: e.target.value })} placeholder="EST. 1994 · LITERARY ZINE & LOG" />
        </Field>

        <Field label="Taglines" hint="One per line — they rotate in the hero typewriter">
          <TextArea rows={4} value={(p.taglines || []).join("\n")} onChange={(e) => patch({ taglines: e.target.value.split("\n") })} />
        </Field>

        <Field label="Bio" hint="Blank line = new paragraph">
          <TextArea rows={6} value={p.bio || ""} onChange={(e) => patch({ bio: e.target.value })} />
        </Field>
      </SectionCard>

      <SectionCard title="Quick Facts">
        <div className={styles.list}>
          {(p.facts || []).map((fact, i) => (
            <div key={i} className={styles.musicEditorBox}>
              <div className={styles.grid2}>
                <Field label="Label">
                  <TextInput value={fact.label || ""} onChange={(e) => patchFact(i, { label: e.target.value })} placeholder="FAVORITE BREW" />
                </Field>
                <Field label="Value">
                  <TextInput value={fact.value || ""} onChange={(e) => patchFact(i, { value: e.target.value })} placeholder="Ethiopian Single Origin" />
                </Field>
              </div>
              <IconButton label="Delete fact" danger onClick={() => updateContent((prev) => ({ ...prev, personal: { ...prev.personal, facts: prev.personal.facts.filter((_, idx) => idx !== i) } }))}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 7h16M9 7V5h6v2m-8 0l1 13h8l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </IconButton>
            </div>
          ))}
          {(!p.facts || p.facts.length === 0) && <p className={styles.hint}>No facts yet.</p>}
        </div>
        <AddButton onClick={() => patch({ facts: [...(p.facts || []), { label: "", value: "" }] })}>
          Add fact
        </AddButton>
      </SectionCard>

      <SectionCard title="Hobbies">
        <div className={styles.list}>
          {p.hobbies.map((hobby, i) => (
            <div key={i} className={styles.row}>
              <button
                type="button"
                className={styles.emojiBtn}
                onClick={() => setEmojiOpen(emojiOpen === i ? null : i)}
                aria-label="Pick an emoji for this hobby"
              >
                {hobby.emoji || "🙂"}
              </button>
              <TextInput value={hobby.name} onChange={(e) => patchHobby(i, { name: e.target.value })} placeholder="Hobby name" />
              <IconButton label="Delete hobby" danger onClick={() => updateContent((prev) => ({ ...prev, personal: { ...prev.personal, hobbies: prev.personal.hobbies.filter((_, idx) => idx !== i) } }))}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 7h16M9 7V5h6v2m-8 0l1 13h8l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </IconButton>
              {emojiOpen === i && (
                <div className={styles.emojiPicker}>
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={styles.emojiOption}
                      onClick={() => {
                        patchHobby(i, { emoji })
                        setEmojiOpen(null)
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {p.hobbies.length === 0 && <p className={styles.hint}>No hobbies yet.</p>}
        </div>
        <AddButton onClick={() => patch({ hobbies: [...p.hobbies, { name: "", emoji: "✨" }] })}>
          Add hobby
        </AddButton>
      </SectionCard>

      <SectionCard title="Music — on rotation">
        <Field label="Section subtitle" hint="Shown below the music heading">
          <TextInput value={p.musicSubtitle || ""} onChange={(e) => patch({ musicSubtitle: e.target.value })} placeholder="A mood board of soundscapes on repeat..." />
        </Field>
        <div className={styles.list}>
          {p.music.map((entry, i) => (
            <div key={i} className={styles.musicEditorBox}>
              <div className={styles.grid2}>
                <Field label="Artist">
                  <TextInput value={entry.artist || ""} onChange={(e) => patchMusic(i, { artist: e.target.value })} placeholder="Artist name" />
                </Field>
                <Field label="Album / Track">
                  <TextInput value={entry.album || ""} onChange={(e) => patchMusic(i, { album: e.target.value })} placeholder="Album title" />
                </Field>
              </div>
              <div className={styles.grid2}>
                <Field label="Genre tag">
                  <TextInput value={entry.genre || ""} onChange={(e) => patchMusic(i, { genre: e.target.value })} placeholder="Ambient / Chillwave" />
                </Field>
                <Field label="Spotify / Music Link">
                  <TextInput value={entry.spotifyUrl || ""} onChange={(e) => patchMusic(i, { spotifyUrl: e.target.value })} placeholder="https://open.spotify.com/..." />
                </Field>
              </div>
              <Field label="Cover Image URL">
                <div className={styles.row}>
                  <TextInput value={entry.coverUrl || ""} onChange={(e) => patchMusic(i, { coverUrl: e.target.value })} placeholder="https://… (optional cover art)" />
                  <IconButton label="Delete music entry" danger onClick={() => updateContent((prev) => ({ ...prev, personal: { ...prev.personal, music: prev.personal.music.filter((_, idx) => idx !== i) } }))}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 7h16M9 7V5h6v2m-8 0l1 13h8l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </IconButton>
                </div>
              </Field>
            </div>
          ))}
          {p.music.length === 0 && <p className={styles.hint}>The rotation is empty.</p>}
        </div>
        <AddButton onClick={() => updateContent((prev) => ({ ...prev, personal: { ...prev.personal, music: [...prev.personal.music, { artist: "", album: "", coverUrl: "", genre: "", spotifyUrl: "" }] } }))}>
          Add music entry
        </AddButton>
      </SectionCard>

      <SectionCard title="Social links">
        <div className={styles.list}>
          {(p.socialLinks || []).map((link, i) => (
            <div key={i} className={styles.musicEditorBox}>
              <div className={styles.grid2}>
                <Field label="Platform">
                  <TextInput value={link.platform || ""} onChange={(e) => patchSocialLink(i, { platform: e.target.value })} placeholder="GitHub" />
                </Field>
                <Field label="Display label">
                  <TextInput value={link.label || ""} onChange={(e) => patchSocialLink(i, { label: e.target.value })} placeholder="@username" />
                </Field>
              </div>
              <div className={styles.row}>
                <Field label="URL">
                  <TextInput value={link.url || ""} onChange={(e) => patchSocialLink(i, { url: e.target.value })} placeholder="https://..." />
                </Field>
                <IconButton label="Delete link" danger onClick={() => updateContent((prev) => ({ ...prev, personal: { ...prev.personal, socialLinks: prev.personal.socialLinks.filter((_, idx) => idx !== i) } }))}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 7h16M9 7V5h6v2m-8 0l1 13h8l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </IconButton>
              </div>
            </div>
          ))}
          {(!p.socialLinks || p.socialLinks.length === 0) && <p className={styles.hint}>No social links yet.</p>}
        </div>
        <AddButton onClick={() => patch({ socialLinks: [...(p.socialLinks || []), { platform: "", url: "", label: "" }] })}>
          Add social link
        </AddButton>
      </SectionCard>
    </div>
  )
}