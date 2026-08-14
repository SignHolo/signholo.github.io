import styles from "./Seal.module.css"

export default function Seal({ size = 40, iridescent = false, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`${styles.seal} ${iridescent ? styles.iridescent : ""} ${className}`}
    >
      <circle
        cx="32"
        cy="32"
        r="25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray="1 5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <path
        d="M27 41 C21 39 20 33 25 30 C31 27 40 30 42 25 C44 20 39 16 34 16"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="47" cy="16.5" r="2.6" fill="currentColor" />
    </svg>
  )
}