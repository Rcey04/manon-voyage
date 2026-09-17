"use client"

/**
 * Bon voyage, Manon — page unique
 *
 * ?jour=2026-09-01  → avant le départ
 * ?jour=2026-09-12  → Puerto Escondido
 * ?jour=2026-09-24  → vol Mexique→Nicaragua
 * ?jour=2026-10-14  → retour
 * ?jour=2026-10-16  → après le voyage
 */

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import {
  VOYAGE,
  PORTES,
  COULEURS_ENCRE,
  HUMEUR_ICONS,
  type Etape,
  type JournalEntry,
  type Humeur,
} from "@/data/voyage"

const DATE_DEPART = new Date("2026-09-03")
const DATE_RETOUR = new Date("2026-10-15")
const DUREE_TOTALE = 43
const JOURNAL_KEY = "manon-journal"

// ─── Journal helpers ───

function loadJournal(): Record<string, JournalEntry> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(JOURNAL_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveJournal(entries: Record<string, JournalEntry>) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries))
}

function getEtapeForDate(dateStr: string): number {
  const d = new Date(dateStr + "T12:00:00")
  for (let i = VOYAGE.length - 1; i >= 0; i--) {
    const etape = VOYAGE[i]
    if (etape.unlock === "ouvert") continue
    if (d >= new Date(etape.unlock)) return i
  }
  return 0
}

function compressImage(file: File, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ratio = Math.min(maxWidth / img.width, 1)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", quality))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function exportJournal(entries: Record<string, JournalEntry>) {
  const data = Object.values(entries).sort((a, b) => a.date.localeCompare(b.date))
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `journal-manon-${new Date().toISOString().split("T")[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Carte Leaflet (dynamic import — needs window) ───

const CarteLeaflet = dynamic(() => import("@/components/carte-leaflet"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#2A2318] flex items-center justify-center">
      <span className="titulo text-xs text-[#F3E9D6] opacity-40">Chargement...</span>
    </div>
  ),
})

function CarteCarte({
  vue,
  setVue,
  aujourdhui,
  onClickPoint,
}: {
  vue: "mexique" | "nicaragua"
  setVue: (v: "mexique" | "nicaragua") => void
  aujourdhui: Date
  onClickPoint: (id: number) => void
}) {
  return (
    <section className="mb-12">
      {/* Onglets */}
      <div className="flex gap-6 mb-4 border-b border-[#1A151220]">
        {(["mexique", "nicaragua"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVue(v)}
            className={`pb-2 text-sm titulo transition-opacity ${
              vue === v
                ? "opacity-100 border-b-2 border-[#1A1512]"
                : "opacity-40 hover:opacity-70"
            }`}
          >
            {v === "mexique" ? "Mexique" : "Nicaragua"}
          </button>
        ))}
      </div>

      {/* Map container — shorter on mobile */}
      <div className="border-2 border-[#1A1512] overflow-hidden h-[260px] sm:h-[340px]">
        <CarteLeaflet
          vue={vue}
          aujourdhui={aujourdhui}
          onClickPoint={onClickPoint}
        />
      </div>
    </section>
  )
}

// ─── Papel picado SVG ───
function PapelPicado() {
  return (
    <svg viewBox="0 0 600 40" className="w-full h-auto" aria-hidden="true" preserveAspectRatio="none">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const x = i * 50
        const colors = ["#D6301F", "#E8A712", "#1E7A4C", "#D6301F", "#E8A712", "#1E7A4C"]
        const c = colors[i % 6]
        return (
          <g key={i}>
            <path
              d={`M${x},0 L${x + 50},0 L${x + 50},30 L${x + 40},25 L${x + 35},32 L${x + 25},22 L${x + 15},32 L${x + 10},25 L${x},30 Z`}
              fill={c}
              opacity="0.8"
            />
            {/* Découpes */}
            <circle cx={x + 25} cy={12} r={4} fill="#F3E9D6" />
            <rect x={x + 10} y={6} width={4} height={4} fill="#F3E9D6" transform={`rotate(45 ${x + 12} 8)`} />
            <rect x={x + 36} y={6} width={4} height={4} fill="#F3E9D6" transform={`rotate(45 ${x + 38} 8)`} />
          </g>
        )
      })}
    </svg>
  )
}

// ─── Placeholder illustration ───
function IllustrationPlaceholder({ sujet, encre }: { sujet: string; encre: string }) {
  return (
    <div
      className="w-full aspect-square flex items-center justify-center border-2 border-dashed rounded-sm"
      style={{ borderColor: encre + "40", color: encre }}
    >
      <span className="titulo text-xs text-center px-2 opacity-60">{sujet}</span>
    </div>
  )
}

// ─── Carte de lotería ───
function getPhotosForEtape(etapeId: number, entries: Record<string, JournalEntry>): string[] {
  return Object.values(entries)
    .filter((e) => e.etapeId === etapeId && e.photos && e.photos.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .flatMap((e) => e.photos)
}

function CarteLoteria({
  etape,
  deverrouille,
  estNouvelle,
  isOpen,
  onToggle,
  journalEntries,
}: {
  etape: Etape
  deverrouille: boolean
  estNouvelle: boolean
  isOpen: boolean
  onToggle: () => void
  journalEntries: Record<string, JournalEntry>
}) {
  const encre = COULEURS_ENCRE[etape.encre]
  const rotation = ((etape.id % 2 === 0 ? 1 : -1) * (0.5 + (etape.id * 0.3) % 1)).toFixed(1)
  const photos = getPhotosForEtape(etape.id, journalEntries)
  const coverPhoto = photos[0] || null

  return (
    <div className="flex flex-col">
      <button
        onClick={deverrouille ? onToggle : undefined}
        className={`relative border-2 border-[#1A1512] overflow-hidden transition-transform ${
          deverrouille ? "cursor-pointer hover:scale-[1.02]" : "cursor-default"
        } ${estNouvelle && deverrouille ? "card-flip-in" : ""}`}
        style={{ transform: `rotate(${rotation}deg)` }}
        aria-label={`${etape.lieu}${deverrouille ? "" : ", verrouillée, s'ouvre le " + etape.datesAffichees}`}
        aria-expanded={deverrouille ? isOpen : undefined}
        disabled={!deverrouille}
      >
        {deverrouille ? (
          /* ── Face visible ── */
          <div className="bg-[#F3E9D6] p-3 pb-4" style={{ minHeight: 200 }}>
            {/* Numéro en haut à gauche */}
            <span
              className="titulo text-5xl leading-none block mb-2"
              style={{
                color: "transparent",
                WebkitTextStroke: `1.5px ${encre}`,
              }}
            >
              {String(etape.id).padStart(2, "0")}
            </span>

            {/* Photo du journal ou placeholder */}
            <div className="flex justify-center my-3 px-2">
              {coverPhoto ? (
                <img
                  src={coverPhoto}
                  alt={etape.lieu}
                  className="w-full aspect-square object-cover border border-[#1A151220]"
                  style={{ filter: "contrast(1.05) sepia(0.1)" }}
                />
              ) : (
                <img
                  src={etape.image}
                  alt={etape.lieu}
                  className="w-full aspect-square object-cover border border-[#1A151220]"
                  style={{ filter: "contrast(1.05) sepia(0.15)" }}
                />
              )}
            </div>

            {/* Nom et dates */}
            <p className="titulo text-sm text-center leading-tight" style={{ color: encre }}>
              {etape.lieu}
            </p>
            <p className="text-center text-[10px] mt-1 opacity-60 tracking-wide uppercase">
              {etape.datesAffichees}
            </p>
          </div>
        ) : (
          /* ── Face cachée ── */
          <div className="bg-[#1A1512] motif-precol p-3 flex flex-col items-center justify-center" style={{ minHeight: 200 }}>
            {/* Numéro central */}
            <span
              className="titulo text-6xl leading-none"
              style={{
                color: "transparent",
                WebkitTextStroke: "1.5px #F3E9D620",
              }}
            >
              {String(etape.id).padStart(2, "0")}
            </span>

            {/* Tampon date */}
            <div className="tampon mt-4" style={{ color: "#F3E9D680" }}>
              {etape.unlock !== "ouvert"
                ? new Date(etape.unlock).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                  })
                : ""}
            </div>
          </div>
        )}
      </button>

      {/* Message en accordéon, pleine largeur */}
      {deverrouille && (
        <div className={`accordeon col-span-2 ${isOpen ? "open" : ""}`}>
          <div>
            <div
              className="border-x-2 border-b-2 border-[#1A1512] p-5"
              style={{ transform: `rotate(${rotation}deg)`, background: "#F3E9D6" }}
            >
              <p className="prose-lettre" style={{ color: "#1A1512" }}>
                {etape.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Porte spéciale (long press 3s pour ouvrir) ───

function PorteSpeciale({
  porte,
  ouverte,
  onOpen,
}: {
  porte: { situation: string; texte: string }
  ouverte: boolean
  onOpen: () => void
}) {
  const [pressing, setPressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [unlocked, setUnlocked] = useState(false)
  const [hint, setHint] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(0)

  const HOLD_DURATION = 3000 // 3 seconds

  function startPress() {
    if (unlocked) return
    setPressing(true)
    setHint(false)
    startRef.current = Date.now()

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const p = Math.min(elapsed / HOLD_DURATION, 1)
      setProgress(p)

      if (p >= 1) {
        stopPress()
        setUnlocked(true)
        onOpen()
      }
    }, 30)
  }

  function stopPress() {
    setPressing(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (!unlocked && progress > 0 && progress < 1) {
      setProgress(0)
      setHint(true)
    }
  }

  function handleClick() {
    if (unlocked) onOpen()
  }

  return (
    <div className="mt-10 border-4 border-double border-[#D6301F] p-4 relative overflow-hidden">
      {/* Progress bar background */}
      {!unlocked && pressing && (
        <div
          className="absolute inset-0 bg-[#D6301F] transition-none"
          style={{ opacity: 0.08, width: `${progress * 100}%` }}
        />
      )}

      <button
        onMouseDown={!unlocked ? startPress : undefined}
        onMouseUp={!unlocked ? stopPress : undefined}
        onMouseLeave={!unlocked ? stopPress : undefined}
        onTouchStart={!unlocked ? startPress : undefined}
        onTouchEnd={!unlocked ? stopPress : undefined}
        onClick={handleClick}
        className="w-full flex items-center justify-between text-left relative z-10 select-none"
        aria-expanded={ouverte}
      >
        <span className="titulo text-sm" style={{ color: "#D6301F" }}>
          {porte.situation}
        </span>
        {unlocked ? (
          <span
            className="text-xl font-light transition-transform shrink-0"
            style={{
              color: "#D6301F",
              transform: ouverte ? "rotate(45deg)" : "none",
            }}
          >
            +
          </span>
        ) : (
          <span className="flex gap-1 shrink-0">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{
                  background: progress > (i + 1) / 3 ? "#D6301F" : "#D6301F30",
                }}
              />
            ))}
          </span>
        )}
      </button>

      {/* Hint text */}
      {hint && !unlocked && (
        <p className="text-[10px] mt-2 italic opacity-40 text-center" style={{ color: "#D6301F" }}>
          Maintiens appuyé si tu es sûre...
        </p>
      )}

      {/* Content */}
      {unlocked && (
        <div className={`accordeon ${ouverte ? "open" : ""}`}>
          <div>
            <div className="pt-4">
              <p className="prose-lettre">{porte.texte}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Journal : Calendrier + Formulaire ───

const COULEURS_HUMEUR: Record<Humeur, string> = {
  soleil: "#E8A712",
  nuage: "#8B8B8B",
  pluie: "#5B7FA5",
  orage: "#4A3560",
  "arc-en-ciel": "#D6301F",
}

function JournalSection({
  entries,
  setEntries,
  aujourdhui,
}: {
  entries: Record<string, JournalEntry>
  setEntries: (e: Record<string, JournalEntry>) => void
  aujourdhui: Date
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [texte, setTexte] = useState("")
  const [humeur, setHumeur] = useState<Humeur | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate 43 days
  const jours: string[] = []
  for (let i = 0; i < DUREE_TOTALE; i++) {
    const d = new Date(DATE_DEPART)
    d.setDate(d.getDate() + i)
    jours.push(d.toISOString().split("T")[0])
  }

  function openDay(dateStr: string) {
    setSelectedDate(dateStr)
    const entry = entries[dateStr]
    if (entry) {
      setTexte(entry.texte)
      setHumeur(entry.humeur)
      setPhotos(entry.photos || [])
    } else {
      setTexte("")
      setHumeur(null)
      setPhotos([])
    }
  }

  function closeDay() {
    setSelectedDate(null)
    setTexte("")
    setHumeur(null)
    setPhotos([])
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    const remaining = 3 - photos.length
    const toProcess = Array.from(files).slice(0, remaining)
    const compressed = await Promise.all(toProcess.map((f) => compressImage(f)))
    setPhotos((prev) => [...prev, ...compressed].slice(0, 3))
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  function save() {
    if (!selectedDate) return
    setSaving(true)

    const now = new Date().toISOString()
    const existing = entries[selectedDate]

    const entry: JournalEntry = {
      id: existing?.id || crypto.randomUUID(),
      date: selectedDate,
      etapeId: getEtapeForDate(selectedDate),
      texte,
      humeur,
      photos,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      synced: false,
    }

    const updated = { ...entries, [selectedDate]: entry }
    setEntries(updated)
    saveJournal(updated)

    // Try sync to Supabase
    syncEntry(entry)

    setTimeout(() => {
      setSaving(false)
      closeDay()
    }, 300)
  }

  async function syncEntry(entry: JournalEntry) {
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      })
      if (res.ok) {
        const updated = { ...entries, [entry.date]: { ...entry, synced: true } }
        setEntries(updated)
        saveJournal(updated)
      }
    } catch {
      // Offline — will sync later
    }
  }

  // Sync all unsynced on mount
  useEffect(() => {
    const unsynced = Object.values(entries).filter((e) => !e.synced)
    unsynced.forEach((entry) => syncEntry(entry))
  }, [])

  const unsyncedCount = Object.values(entries).filter((e) => !e.synced).length
  const totalEntries = Object.keys(entries).length

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="titulo text-lg">Journal</h2>
        <div className="flex items-center gap-3">
          {/* Sync indicator */}
          {totalEntries > 0 && (
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider opacity-50">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: unsyncedCount === 0 ? "#1E7A4C" : "#E8A712" }}
              />
              {unsyncedCount === 0 ? "sync" : `${unsyncedCount} en attente`}
            </span>
          )}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Header */}
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={i} className="text-center text-[10px] opacity-40 titulo pb-1">
            {d}
          </div>
        ))}

        {/* Offset for Sept 3 (Wednesday = index 2, but starting week from Monday) */}
        {/* Sept 3, 2026 is a Thursday → offset 3 */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {/* Days */}
        {jours.map((dateStr) => {
          const entry = entries[dateStr]
          const d = new Date(dateStr + "T12:00:00")
          const dayNum = d.getDate()
          const isPast = d <= aujourdhui
          const isToday = dateStr === aujourdhui.toISOString().split("T")[0]
          const hasEntry = !!entry && (entry.texte || entry.humeur)

          return (
            <button
              key={dateStr}
              onClick={() => isPast ? openDay(dateStr) : undefined}
              disabled={!isPast}
              className={`relative aspect-square flex items-center justify-center text-xs transition-all ${
                isPast
                  ? "cursor-pointer hover:bg-[#1A151210]"
                  : "cursor-default opacity-25"
              } ${isToday ? "ring-1 ring-[#D6301F]" : ""}`}
              style={{
                border: hasEntry ? "none" : "1px dashed #1A151225",
                borderRadius: 2,
                background: hasEntry && entry.humeur
                  ? COULEURS_HUMEUR[entry.humeur] + "20"
                  : undefined,
              }}
              title={dateStr}
            >
              <span className={`titulo ${isToday ? "text-[#D6301F]" : ""}`} style={{ fontSize: 11 }}>
                {dayNum}
              </span>
              {hasEntry && entry.humeur && (
                <span className="absolute -top-0.5 -right-0.5 text-[8px]">
                  {HUMEUR_ICONS[entry.humeur]}
                </span>
              )}
              {hasEntry && !entry.humeur && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: "#1E7A4C" }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Export button */}
      {totalEntries > 0 && (
        <button
          onClick={() => exportJournal(entries)}
          className="w-full py-2 border border-dashed border-[#1A151240] text-xs titulo opacity-50 hover:opacity-80 transition-opacity"
        >
          Recuperer le journal ({totalEntries} entree{totalEntries > 1 ? "s" : ""})
        </button>
      )}

      {/* Modal for day entry */}
      {selectedDate && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          style={{ background: "#1A151280", backdropFilter: "blur(4px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDay()
          }}
        >
          <div
            className="w-full sm:max-w-md h-full sm:h-auto sm:max-h-[85vh] overflow-y-auto sm:border-2 border-[#1A1512] p-4 sm:p-5"
            style={{ background: "#F3E9D6" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="titulo text-sm">
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <p className="text-[10px] opacity-40 uppercase tracking-wider mt-0.5">
                  {VOYAGE[getEtapeForDate(selectedDate)]?.lieu}
                </p>
              </div>
              <button
                onClick={closeDay}
                className="titulo text-xl opacity-40 hover:opacity-80 p-1"
              >
                x
              </button>
            </div>

            {/* Humeur */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider opacity-40 mb-2">Humeur</p>
              <div className="flex gap-2">
                {(Object.keys(HUMEUR_ICONS) as Humeur[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => setHumeur(humeur === h ? null : h)}
                    className={`w-10 h-10 flex items-center justify-center text-lg rounded-sm border transition-all ${
                      humeur === h
                        ? "border-[#1A1512] scale-110"
                        : "border-[#1A151220] opacity-50 hover:opacity-80"
                    }`}
                    title={h}
                  >
                    {HUMEUR_ICONS[h]}
                  </button>
                ))}
              </div>
            </div>

            {/* Texte */}
            <div className="mb-4">
              <textarea
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                placeholder="Raconte ta journee..."
                className="w-full h-36 p-3 prose-lettre bg-transparent border border-[#1A151220] rounded-none resize-none outline-none focus:border-[#1A1512] appearance-none"
                style={{ fontSize: 14, WebkitAppearance: "none" }}
              />
            </div>

            {/* Photos */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider opacity-40 mb-2">
                Photos ({photos.length}/3)
              </p>
              <div className="flex gap-2 flex-wrap">
                {photos.map((photo, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img
                      src={photo}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover border border-[#1A151220]"
                    />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#D6301F] text-[#F3E9D6] text-xs flex items-center justify-center rounded-full"
                    >
                      x
                    </button>
                  </div>
                ))}
                {photos.length < 3 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 border border-dashed border-[#1A151230] flex items-center justify-center text-2xl opacity-30 hover:opacity-60 transition-opacity"
                  >
                    +
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Save */}
            <button
              onClick={save}
              disabled={saving || (!texte && !humeur && photos.length === 0)}
              className="w-full py-3 titulo text-sm text-[#F3E9D6] bg-[#1A1512] hover:bg-[#2A2318] disabled:opacity-30 transition-all"
            >
              {saving ? "..." : "Sauvegarder"}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

// ─── Tuto onboarding ───
function Tuto({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      emoji: "🎴",
      titre: "Les cartes",
      texte: "Chaque étape de ton voyage a sa carte. Elles se déverrouillent automatiquement quand tu arrives à destination. Clique dessus pour lire le message.",
    },
    {
      emoji: "🗺️",
      titre: "La carte",
      texte: "Une carte interactive avec ton itinéraire. Clique sur les points pour voir des fun facts sur chaque lieu.",
    },
    {
      emoji: "📖",
      titre: "Le journal",
      texte: "Ton journal de bord. Chaque jour tu peux écrire ce que tu veux, choisir ton humeur et ajouter des photos. Tout est sauvegardé automatiquement.",
    },
    {
      emoji: "🚪",
      titre: "Les portes",
      texte: "En bas, des messages à ouvrir selon ton humeur du moment. Genre quand t'as le mal du pays, quand tu doutes, ou quand c'est le plus beau jour du voyage.",
    },
    {
      emoji: "❤️",
      titre: "C'est parti",
      texte: "C'est ton espace à toi Manon. Profite de chaque jour. Je t'aime.",
    },
  ]

  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#1A1512]/80 backdrop-blur-sm p-4">
      <div className="bg-[#F3E9D6] border-2 border-[#1A1512] max-w-sm w-full p-6 text-center">
        <span className="text-5xl block mb-4">{current.emoji}</span>
        <h2 className="titulo text-xl mb-3">{current.titre}</h2>
        <p className="prose-lettre text-sm opacity-70 mb-6">{current.texte}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === step ? "#1A1512" : "#1A151230" }}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (isLast) {
                localStorage.setItem("manon-tuto-done", "1")
                onClose()
              } else {
                setStep(step + 1)
              }
            }}
            className="titulo text-sm px-5 py-2 bg-[#1A1512] text-[#F3E9D6] hover:bg-[#2A2318] transition-colors"
          >
            {isLast ? "C'est parti !" : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ───
function PageContent() {
  const searchParams = useSearchParams()
  const [carteOuverte, setCarteOuverte] = useState<number | null>(null)
  const [portesOuvertes, setPortesOuvertes] = useState<Set<number>>(new Set())
  const [vueCarte, setVueCarte] = useState<"mexique" | "nicaragua">("mexique")
  const [nouvelles, setNouvelles] = useState<Set<number>>(new Set())
  const [journalEntries, setJournalEntries] = useState<Record<string, JournalEntry>>({})
  const [showTuto, setShowTuto] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("manon-tuto-done")) setShowTuto(true)
  }, [])

  const aujourdhui = (() => {
    const param = searchParams.get("jour")
    if (param) {
      const d = new Date(param + "T12:00:00")
      if (!isNaN(d.getTime())) return d
    }
    return new Date()
  })()

  // Load journal from localStorage
  useEffect(() => {
    setJournalEntries(loadJournal())
  }, [])

  // Vue par défaut selon la date
  useEffect(() => {
    if (aujourdhui >= new Date("2026-09-24")) {
      setVueCarte("nicaragua")
    }
  }, [])

  // Marquer les cartes nouvellement déverrouillées
  useEffect(() => {
    const today = aujourdhui.toISOString().split("T")[0]
    const news = new Set<number>()
    VOYAGE.forEach((e) => {
      if (e.unlock === today) news.add(e.id)
    })
    setNouvelles(news)
  }, [])

  function getEtapeEnCours(): number {
    if (aujourdhui < DATE_DEPART) return 0
    if (aujourdhui >= DATE_RETOUR) return 10
    for (let i = VOYAGE.length - 1; i >= 0; i--) {
      const etape = VOYAGE[i]
      if (etape.unlock === "ouvert") continue
      if (aujourdhui >= new Date(etape.unlock)) return i
    }
    return 0
  }

  const etapeEnCours = getEtapeEnCours()
  const etapeCourante = VOYAGE[etapeEnCours]

  const joursDepuisDepart = Math.floor(
    (aujourdhui.getTime() - DATE_DEPART.getTime()) / 86400000
  )
  const jourActuel = Math.max(0, Math.min(joursDepuisDepart + 1, DUREE_TOTALE))
  const joursAvantRetour = Math.max(
    0,
    Math.ceil((DATE_RETOUR.getTime() - aujourdhui.getTime()) / 86400000)
  )
  const joursAvantDepart = Math.max(
    0,
    Math.ceil((DATE_DEPART.getTime() - aujourdhui.getTime()) / 86400000)
  )

  const estAvant = aujourdhui < DATE_DEPART
  const estApres = aujourdhui >= DATE_RETOUR

  function estDeverrouille(etape: Etape) {
    if (etape.unlock === "ouvert") return true
    return aujourdhui >= new Date(etape.unlock)
  }

  function togglePorte(id: number) {
    setPortesOuvertes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function scrollToCard(id: number) {
    const el = document.getElementById(`carte-${id}`)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
    setCarteOuverte(id)
  }

  return (
    <>
    {showTuto && <Tuto onClose={() => setShowTuto(false)} />}
    <main className="max-w-[620px] mx-auto px-4 pb-16">
      {/* ── EN-TÊTE ── */}
      <header className="pt-10 pb-6 text-left">
        {estAvant ? (
          <>
            <h1 className="titulo text-4xl md:text-5xl">Avant de partir</h1>
            <p className="mt-2 text-lg opacity-60">
              {joursAvantDepart <= 1 ? "C'est demain." : `Depart dans ${joursAvantDepart} jours`}
            </p>
            <p className="text-sm opacity-40 mt-1">43 jours de voyage t'attendent</p>
          </>
        ) : estApres ? (
          <>
            <h1 className="titulo text-4xl md:text-5xl">Bienvenue</h1>
            <p className="mt-2 text-lg opacity-60">43 jours, 2 pays, 11 cartes</p>
            <p className="text-sm opacity-40 mt-1">Tout est deverrouille</p>
          </>
        ) : (
          <>
            <h1 className="titulo text-4xl md:text-5xl">{etapeCourante.lieu}</h1>
            <p className="mt-2 text-lg opacity-60">
              jour {jourActuel} sur {DUREE_TOTALE}
            </p>
            <p className="text-sm opacity-40 mt-1">
              {joursAvantRetour === 0
                ? "Tu rentres aujourd'hui."
                : joursAvantRetour === 1
                  ? "Plus qu'un jour."
                  : `${joursAvantRetour} jours avant la Suisse`}
            </p>
          </>
        )}
      </header>

      {/* ── PAPEL PICADO ── */}
      <div className="mb-8 -mx-4">
        <PapelPicado />
      </div>

      {/* ── CARTE ── */}
      <CarteCarte
        vue={vueCarte}
        setVue={setVueCarte}
        aujourdhui={aujourdhui}
        onClickPoint={scrollToCard}
      />

      {/* ── PLANCHE DE LOTERÍA ── */}
      <section className="mb-16">
        <div className="grid grid-cols-2 gap-3">
          {VOYAGE.map((etape) => {
            const deverrouille = estDeverrouille(etape)
            const isOpen = carteOuverte === etape.id

            return (
              <div
                key={etape.id}
                id={`carte-${etape.id}`}
                className={isOpen ? "col-span-2" : ""}
              >
                <CarteLoteria
                  etape={etape}
                  deverrouille={deverrouille}
                  estNouvelle={nouvelles.has(etape.id)}
                  isOpen={isOpen}
                  onToggle={() => setCarteOuverte(isOpen ? null : etape.id)}
                  journalEntries={journalEntries}
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* ── JOURNAL ── */}
      <JournalSection
        entries={journalEntries}
        setEntries={setJournalEntries}
        aujourdhui={aujourdhui}
      />

      {/* ── PORTES ── */}
      <section className="mb-12">
        <div className="border-t-2 border-[#1A1512]">
          {PORTES.filter((p) => p.id <= 8).map((porte) => {
            const ouverte = portesOuvertes.has(porte.id)
            return (
              <div key={porte.id} className="border-b border-[#1A1512]">
                <button
                  onClick={() => togglePorte(porte.id)}
                  className="w-full flex items-center justify-between py-4 px-1 text-left group"
                  aria-expanded={ouverte}
                >
                  <span className="titulo text-sm pr-4">{porte.situation}</span>
                  <span
                    className="text-xl font-light opacity-50 transition-transform shrink-0"
                    style={{ transform: ouverte ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
                <div className={`accordeon ${ouverte ? "open" : ""}`}>
                  <div>
                    <div className="pb-5 px-1">
                      <p className="prose-lettre">{porte.texte}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Porte spéciale */}
        {(() => {
          const porteSpeciale = PORTES.find((p) => p.id === 9)!
          const ouverte = portesOuvertes.has(9)
          return <PorteSpeciale porte={porteSpeciale} ouverte={ouverte} onOpen={() => togglePorte(9)} />
        })()}
      </section>

      {/* Message final */}
      {estApres && (
        <section className="py-8 text-center border-t-2 border-[#1A1512]">
          <p className="prose-lettre italic max-w-md mx-auto">
            C'est fini. Enfin, le voyage est fini. Le reste, non. T'es partie, t'as tenu, t'as vécu des trucs que personne d'autre vivra jamais de la même manière. Quarante-trois jours, et t'es revenue un peu différente, un peu plus grande, un peu plus toi. Bienvenue chou. Je t'aime.
          </p>
        </section>
      )}
    </main>
    </>
  )
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center opacity-40">
          Chargement...
        </div>
      }
    >
      <PageContent />
    </Suspense>
  )
}
