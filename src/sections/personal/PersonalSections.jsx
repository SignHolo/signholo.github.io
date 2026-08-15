import { useState } from "react"
import { useReveal } from "../../hooks/useReveal"
import { useContent } from "../../hooks/useContent"
import { useTypewriter } from "../../hooks/useTypewriter"
import Seal from "../../components/Seal"
import PostModal from "../../components/PostModal"
import styles from "./personal.module.css"

export default function PersonalSections() {
  const { content } = useContent()
  const p = content.personal
  const { text, caret } = useTypewriter(p.taglines)
  const [postModalOpen, setPostModalOpen] = useState(false)

  const aboutReveal = useReveal()
  const quoteReveal = useReveal()
  const hobbiesReveal = useReveal()
  const musicReveal = useReveal()

  const quoteData = typeof p.quote === "object" && p.quote !== null ? p.quote : {}
  const quoteText = quoteData.text || p.quoteText || (typeof p.quote === "string" ? p.quote : "")
  const quoteAuthor = quoteData.author || p.quoteAuthor || p.quoteSource || ""

  const userFacts = (p.facts || []).filter((f) => f && (f.label || f.value))
  const factItems = userFacts.length > 0
    ? userFacts.map((fact) => ({
        label: typeof fact === 'string' ? "NOTE" : (fact.label || ""),
        value: typeof fact === 'string' ? fact : (fact.value || "")
      }))
    : [
        { label: "NET ALIASES", value: "Nemoid / Holo / Shiné" }
      ]

  return (
    <>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <span className={styles.sparkleIcon}>✦</span>
              <span>{p.heroBadge || "PERSONAL LOG"}</span>
            </div>

            <h1 className={styles.heroTitle}>
              Hi, I'm <span className={styles.nameHighlight}>{p.name || "Juan Hamzah"}</span>
            </h1>

            <p className={styles.heroTagline} aria-live="polite">
              <span>{text || (p.taglines && p.taglines.find((t) => t && t.trim())) || ""}</span>
              <span className={`${styles.caret} ${caret ? "" : styles.caretOff}`} aria-hidden="true">
                |
              </span>
            </p>

            <div className={styles.heroActions}>
              <a href="#feed-section" className={styles.primaryEspressoBtn}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <path d="M16.2 7.8a6 6 0 0 1 0 8.4m2.8-11.2a10 10 0 0 1 0 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M7.8 7.8a6 6 0 0 0 0 8.4m-2.8-11.2a10 10 0 0 0 0 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>Read Personal Feed</span>
              </a>

              <button
                type="button"
                className={styles.secondaryOutlineBtn}
                onClick={() => setPostModalOpen(true)}
              >
                <span className={styles.plusIcon}>+</span>
                <span>Add Post</span>
              </button>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.avatarCard}>
              {p.avatarUrl ? (
                <img className={styles.avatarImg} src={p.avatarUrl} alt={p.name} />
              ) : (
                <div className={styles.avatarFallback}>
                  <Seal size={80} />
                  <span className={styles.initialText}>{(p.name || "J").trim().charAt(0) || "J"}</span>
                </div>
              )}

              <div className={styles.currentCard}>
                <div className={styles.currentHeader}>
                  <span className={styles.sparkleIcon}>✦</span>
                  <span>Currently crafting</span>
                </div>
                <p className={styles.currentBody}>{p.currentStatus || "☕ Drafting an essay on editorial typography & warm web aesthetics"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Me ── */}
      <section ref={aboutReveal.ref} data-reveal={aboutReveal.revealed} className={styles.block}>
        <div className={styles.sectionHeaderLine}>
          <h2 className={styles.serifHeading}>About Me</h2>
          <div className={styles.headerRule} />
        </div>

        <div className={styles.aboutGrid}>
          <div className={styles.bioCard}>
            <div className={styles.bioContent}>
              {(p.bio || "Welcome to my personal corner.")
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className={styles.bioPara}>
                    {para}
                  </p>
                ))}
            </div>
            <div className={styles.bioFooter}>
              <span className={styles.metaLabel}>LOCATION: <strong className={styles.metaValue}>{p.location || "Bekasi, ID"}</strong></span>
              <span className={styles.metaLabel}>VIBE: <strong className={styles.metaValue}>{p.vibe || "BzzZzzzz"}</strong></span>
            </div>
          </div>

          <div className={styles.factsGrid}>
            {factItems.map((item, idx) => (
              <div key={idx} className={styles.factBox}>
                <span className={styles.factLabel}>{item.label}</span>
                <span className={styles.factValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote ── */}
      {quoteText ? (
        <section ref={quoteReveal.ref} data-reveal={quoteReveal.revealed} className={styles.block}>
          <div className={styles.sectionHeaderLine}>
            <h2 className={styles.serifHeading}>Quote</h2>
            <div className={styles.headerRule} />
          </div>

          <div className={styles.quoteCard}>
            <div className={styles.quoteMark}>“</div>
            <div className={styles.quoteBody}>
              <p className={styles.quoteText}>{quoteText}</p>
            </div>
            {quoteAuthor ? (
              <div className={styles.quoteAuthorRow}>
                <span className={styles.quoteDash}>—</span>
                <span className={styles.quoteAuthor}>{quoteAuthor}</span>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ── Hobbies ── */}
      <section ref={hobbiesReveal.ref} data-reveal={hobbiesReveal.revealed} className={styles.block}>
        <div className={styles.sectionHeaderLine}>
          <h2 className={styles.serifHeading}>Hobbies & Pursuits</h2>
          <div className={styles.headerRule} />
        </div>

        <div className={styles.hobbyGrid} data-reveal-stagger={hobbiesReveal.revealed}>
          {p.hobbies.map((hobby, i) => (
            <div key={i} className={styles.hobbyCard}>
              <div className={styles.hobbyEmojiWrap}>
                <span className={styles.hobbyEmoji} aria-hidden="true">
                  {hobby.emoji}
                </span>
              </div>
              <span className={styles.hobbyName}>{hobby.name}</span>
            </div>
          ))}
          {p.hobbies.length === 0 && (
            <div className={styles.emptyState}>
              <Seal size={36} />
              <p>No hobbies listed yet — add some in the <a href="/editor" className={styles.editorLink}>editor</a>.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── What I'm Listening To ── */}
      <section ref={musicReveal.ref} data-reveal={musicReveal.revealed} className={styles.block}>
        <div className={styles.sectionHeaderLine}>
          <h2 className={styles.serifHeading}>
            <span className={styles.musicHeadingIcon}>🎵</span> On Repeat
          </h2>
          <div className={styles.headerRule} />
        </div>
        <p className={styles.musicSubtitle}>{p.musicSubtitle || "A mood board of soundscapes on repeat while writing code or designing interfaces."}</p>

        <div className={styles.musicGrid} data-reveal-stagger={musicReveal.revealed}>
          {p.music.map((entry, i) => (
            <figure key={i} className={styles.musicTile}>
              <div className={styles.coverWrap}>
                <AlbumCover entry={entry} />
                <span className={styles.genreTag}>
                  {entry.genre || "Ambient / Chillwave"}
                </span>
              </div>
              <figcaption className={styles.tileCaption}>
                <h3 className={styles.albumTitle}>{entry.album}</h3>
                <p className={styles.artistName}>{entry.artist}</p>
                <a
                  href={entry.spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(entry.artist + " " + entry.album)}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.spotifyLink}
                >
                  <span>Listen on Spotify</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </figcaption>
            </figure>
          ))}
          {p.music.length === 0 && (
            <div className={styles.emptyState}>
              <Seal size={36} />
              <p>Rotation is empty — add a record in the <a href="/editor" className={styles.editorLink}>editor</a>.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Social Links ── */}
      {(p.socialLinks && p.socialLinks.length > 0) && (
        <section className={styles.block}>
          <div className={styles.sectionHeaderLine}>
            <h2 className={styles.serifHeading}>Find Me Elsewhere</h2>
            <div className={styles.headerRule} />
          </div>
          <div className={styles.socialGrid}>
            {p.socialLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noreferrer" className={styles.socialCard}>
                <span className={styles.socialPlatform}>{link.platform}</span>
                <span className={styles.socialLabel}>{link.label}</span>
                <svg className={styles.socialArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        </section>
      )}

      <PostModal
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        world="personal"
      />
    </>
  )
}

function AlbumCover({ entry }) {
  if (entry.coverUrl) {
    return <img className={styles.cover} src={entry.coverUrl} alt={`${entry.album} cover art`} loading="lazy" />
  }
  return (
    <div className={styles.coverFallback} aria-hidden="true">
      <span className={styles.coverLetter}>{(entry.artist || "A").trim().charAt(0).toUpperCase()}</span>
      <span className={styles.coverSpark}>✦</span>
    </div>
  )
}