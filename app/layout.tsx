import type { Metadata } from "next"
import Script from "next/script"
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
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${archivo.variable} ${newsreader.variable}`}>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-8G82YT1ZRJ" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8G82YT1ZRJ');`}
        </Script>
      </head>
      <body className="min-h-dvh bg-[#F3E9D6] text-[#1A1512]">{children}</body>
    </html>
  )
}
