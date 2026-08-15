import { useState } from "react"
import { useReveal } from "../../hooks/useReveal"
import { useContent } from "../../hooks/useContent"
import { useTypewriter } from "../../hooks/useTypewriter"
import Seal from "../../components/Seal"
import styles from "./personal.module.css"

export default function PersonalSections() {
  const { content } = useContent()
  const p = content.personal
  const { text, caret } = useTypewriter(p.taglines)

  const aboutReveal = useReveal()
  const quoteReveal = useReveal()
  const hobbiesReveal = useReveal()
  const musicReveal = useReveal()

  const rawQuotes = p.quotes || (p.quote ? [typeof p.quote === "object" ? p.quote : { text: p.quote, author: p.quoteAuthor || "" }] : [])
  const quotesList = (Array.isArray(rawQuotes) ? rawQuotes : []).filter((q) => q && (q.text || q.author))

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

      {/* ── Quotes ── */}
      {quotesList.length > 0 && (
        <section ref={quoteReveal.ref} data-reveal={quoteReveal.revealed} className={styles.block}>
          <div className={styles.sectionHeaderLine}>
            <h2 className={styles.serifHeading}>
              {quotesList.length > 1 ? "Quotes" : "Quote"}
            </h2>
            <div className={styles.headerRule} />
          </div>

          <div
            className={quotesList.length > 1 ? styles.quotesGrid : styles.singleQuoteWrap}
            data-reveal-stagger={quoteReveal.revealed}
          >
            {quotesList.map((q, idx) => (
              <div key={idx} className={styles.quoteCard}>
                <div className={styles.quoteMark}>“</div>
                <div className={styles.quoteBody}>
                  {(q.text || "")
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((para, pIdx) => (
                      <p key={pIdx} className={styles.quoteText}>
                        {para}
                      </p>
                    ))}
                </div>
                {q.author ? (
                  <div className={styles.quoteAuthorRow}>
                    <span className={styles.quoteDash}>—</span>
                    <span className={styles.quoteAuthor}>{q.author}</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

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
            <MusicTile key={i} entry={entry} />
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

function getSpotifyEmbedUrl(url) {
  if (!url) return null
  try {
    const match = url.match(/open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/)
    if (match) {
      const type = match[1]
      const id = match[2]
      return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`
    }
    if (url.includes("open.spotify.com/embed/")) {
      return url
    }
  } catch (e) {}
  return null
}

function MusicTile({ entry }) {
  const [playing, setPlaying] = useState(false)
  const embedUrl = getSpotifyEmbedUrl(entry.spotifyUrl)

  return (
    <figure className={`${styles.musicTile} ${playing ? styles.musicTileActive : ""}`}>
      <div className={styles.coverWrap}>
        <AlbumCover entry={entry} />
        <span className={styles.genreTag}>
          {entry.genre || "Ambient / Chillwave"}
        </span>

        {embedUrl ? (
          <button
            type="button"
            className={`${styles.playOverlayBtn} ${playing ? styles.playOverlayActive : ""}`}
            onClick={() => setPlaying(!playing)}
            aria-label={playing ? "Close player" : `Play ${entry.album} by ${entry.artist}`}
          >
            {playing ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        ) : null}
      </div>

      <figcaption className={styles.tileCaption}>
        <h3 className={styles.albumTitle}>{entry.album}</h3>
        <p className={styles.artistName}>{entry.artist}</p>

        <div className={styles.musicCardActions}>
          {embedUrl ? (
            <button
              type="button"
              className={`${styles.playSongBtn} ${playing ? styles.playSongBtnActive : ""}`}
              onClick={() => setPlaying(!playing)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                {playing ? (
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
              <span>{playing ? "Close Player" : "Play Song"}</span>
            </button>
          ) : null}

          <a
            href={entry.spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent((entry.artist || "") + " " + (entry.album || ""))}`}
            target="_blank"
            rel="noreferrer"
            className={styles.spotifyLink}
          >
            <span>Spotify</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {playing && embedUrl ? (
          <div className={styles.embedContainer}>
            <iframe
              src={embedUrl}
              width="100%"
              height="80"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={`Spotify player for ${entry.album}`}
            />
          </div>
        ) : null}
      </figcaption>
    </figure>
  )
}