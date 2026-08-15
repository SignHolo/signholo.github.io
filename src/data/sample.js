export const DEFAULT_CONTENT = {
  personal: {
    name: "Juan Hamzah",
    taglines: [
      "designer, bibliophile, & analog enthusiast",
      "crafting quiet software & literary web experiences",
      "curating field notes on typography, music, & paper"
    ],
    heroBadge: "EST. 1994 · LITERARY ZINE & LOG",
    bio: "I build interfaces that read like books and software that feels tactile. My work lives at the intersection of high-contrast typography, quiet engineering, and editorial web design.\n\nWhen I am not writing code or refining design systems, you can usually find me digging through dusty vinyl crates, compiling small-run zines, or exploring quiet corners with a camera.",
    quote: {
      text: "Simplicity is about subtracting the obvious and adding the meaningful.",
      author: "John Maeda"
    },
    avatarUrl: "",
    currentStatus: "☕ Drafting an essay on editorial typography & warm web aesthetics",
    location: "Surabaya, ID",
    vibe: "Linen, Sepia & Analog",
    facts: [
      {label: "FAVORITE BREW", value: "runs 40-point type for fun, at 2 a.m."},
      {label: "CAMERA GEAR", value: "can name every track on a tape before side B starts"},
      {label: "KEYBOARDS", value: "collects vintage Japanese fountain pens & unbleached paper"},
      {label: "WEEKEND PURSUIT", value: "wrote a fan letter to a font foundry — and received a specimen book"}
    ],
    hobbies: [
      { name: "Record digging", emoji: "🎧" },
      { name: "Zine making", emoji: "✂️" },
      { name: "Film photography", emoji: "📷" },
      { name: "Plant keeping", emoji: "🌿" },
      { name: "Mechanical keycaps", emoji: "⌨️" },
      { name: "Coffee brewing", emoji: "☕" }
    ],
    musicSubtitle: "A mood board of soundscapes on repeat while writing code or designing interfaces.",
    music: [
      { artist: "Nujabes", album: "Modal Soul", coverUrl: "", genre: "Jazz Hop / Ambient", spotifyUrl: "https://open.spotify.com" },
      { artist: "Ichiko Aoba", album: "Windswept Adan", coverUrl: "", genre: "Folk / Ambient", spotifyUrl: "https://open.spotify.com" },
      { artist: "Haruomi Hosono", album: "Watering a Flower", coverUrl: "", genre: "Environmental Music", spotifyUrl: "https://open.spotify.com" }
    ],
    socialLinks: [
      {platform: "GitHub", url: "https://github.com/SignHolo", label: "@SignHolo"},
      {platform: "Twitter", url: "https://twitter.com/juanhamzah", label: "@juanhamzah"},
      {platform: "Dribbble", url: "https://dribbble.com/juanhamzah", label: "juanhamzah"},
      {platform: "Read.cv", url: "https://read.cv/juanhamzah", label: "read.cv/juanhamzah"}
    ],
    posts: [
      {
        id: "post-01",
        author: "Juan Hamzah",
        timestamp: "2026-08-14T10:30:00Z",
        content: "There is something sacred about high-contrast serif typography on unbleached linen paper. In a digital world obsessed with hyper-slick minimalism, warmth and texture feel like an act of quiet rebellion.",
        image: "",
        likes: 14
      },
      {
        id: "post-02",
        author: "Juan Hamzah",
        timestamp: "2026-08-12T18:15:00Z",
        content: "Spent the afternoon setting up a new layout for my notes feed using Newsreader and JetBrains Mono. Small typographic details make the screen feel less like a browser window and more like a desk in autumn.",
        image: "",
        likes: 9
      }
    ]
  },
  professional: {
    name: "Juan Hamzah",
    title: "Product Designer & Design Engineer",
    tagline: "I design and build calm, human tools for creative work — with a particular fondness for music, maker, and community products.",
    available: true,
    focusAreas: [
      "Design systems",
      "Creative tooling",
      "Interaction & motion",
      "Music products",
      "Developer experience",
      "Community-led design"
    ],
    projects: [
      {
        id: "proj-01",
        name: "Sunroom Writer",
        shortDescription: "A typewriter-inspired browser space for distraction-free drafting.",
        description: "Sunroom is a browser-based writing space with a typewriter heart: no chrome, no toolbar theater, just an unbroken page, one ambient soundtrack, and a soft daily streak. It began as a weekend prototype to make my own drafting habit stick and quietly became the thing other writers asked for.\n\nI designed the session model around 'sit down, write, stand up' — the interface literally dims into your peripheral vision the longer you write, so the text is all that's left in the room.",
        tech: ["React", "Web Audio", "IndexedDB", "Vite"],
        githubUrl: "https://github.com/SignHolo/sunroom",
        liveUrl: "https://sunroom.signholo.dev",
        thumbnailUrl: ""
      },
      {
        id: "proj-02",
        name: "Monolith Sound Engine",
        shortDescription: "A modular Web Audio DSP synth engine & oscilloscope visualizer.",
        description: "Monolith is a zero-dependency Web Audio synthesizer engine engineered for browser-based sound design. It provides node graph wiring, low-latency oscillator nodes, customizable FM modulation, and real-time canvas visualizers.\n\nBuilt with performance in mind using AudioWorklets and custom DSP processing nodes.",
        tech: ["TypeScript", "Web Audio API", "Canvas 2D", "Web Worklets"],
        githubUrl: "https://github.com/SignHolo/monolith-audio",
        liveUrl: "https://monolith.signholo.dev",
        thumbnailUrl: ""
      },
      {
        id: "proj-03",
        name: "Koda Design Tokens",
        shortDescription: "An accessible multi-theme design system with CSS custom property contracts.",
        description: "Koda is an editorial design token architecture built for multi-context web applications. It drives seamless switching between high-contrast bookish serif interfaces and crisp technical dashboards with zero layout shifts and complete WCAG AAA contrast compliance.",
        tech: ["CSS Variables", "Tailwind CSS", "React", "Style Dictionary"],
        githubUrl: "https://github.com/SignHolo/koda-tokens",
        liveUrl: "",
        thumbnailUrl: ""
      }
    ],
    contact: { email: "juanhamzah@gmail.com", linkedin: "https://www.linkedin.com/in/juanhamzah", github: "https://github.com/SignHolo", resume: "" },
    posts: [
      {
        id: "post-pro-01",
        author: "Juan Hamzah",
        timestamp: "2026-08-13T14:20:00Z",
        content: "Density without noise is the single hardest UI challenge in modern tool design. Reducing chrome doesn't mean hiding functionality — it means sharpening visual typography so content is the interface.",
        image: "",
        likes: 18
      },
      {
        id: "post-pro-02",
        author: "Juan Hamzah",
        timestamp: "2026-08-10T09:15:00Z",
        content: "Exploring multi-world CSS contracts using semantic custom properties. By binding root variables dynamically based on viewport context, we achieve distinct aesthetic moods across the personal and professional spaces without duplicative code.",
        image: "",
        likes: 12
      }
    ]
  }
}