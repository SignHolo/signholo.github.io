import { useState } from "react"
import Seal from "../components/Seal"
import styles from "./editor.module.css"

const EDITOR_PIN = "1234"

export default function PinGate({ onUnlock }) {
  const [value, setValue] = useState("")
  const [error, setError] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (value === EDITOR_PIN) {
      sessionStorage.setItem("signholo.pin", "ok")
      onUnlock()
    } else {
      setError(true)
      setValue("")
    }
  }

  return (
    <div className={styles.pinScreen}>
      <Seal size={64} iridescent />
      <h1 className={styles.pinTitle}>Content editor</h1>
      <p className={styles.pinSub}>This panel is for the owner's eyes only.</p>
      <form className={styles.pinForm} onSubmit={submit}>
        <input
          className={styles.pinInput}
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={value}
          onChange={(e) => {
            setValue(e.target.value.replace(/\D/g, ""))
            setError(false)
          }}
          placeholder="••••"
          aria-label="Editor PIN"
          autoFocus
        />
        {error && (
          <p className={styles.pinError} role="alert">
            That PIN didn't match. Try again.
          </p>
        )}
        <button type="submit" className={styles.pinButton}>
          Unlock
        </button>
      </form>
    </div>
  )
}