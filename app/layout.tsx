import type { Metadata } from "next"
import { Archivo, Newsreader } from "next/font/google"
import "./globals.css"

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
})

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Bon voyage, Manon",
  description: "43 jours, deux pays, onze cartes.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${archivo.variable} ${newsreader.variable}`}>
      <body className="min-h-dvh bg-[#F3E9D6] text-[#1A1512]">{children}</body>
    </html>
  )
}
