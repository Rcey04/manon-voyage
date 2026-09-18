import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Pixel tracker — ajouter sur n'importe quel site :
// <img src="https://manon-voyage.vercel.app/api/pixel?site=rojhat.ch" width="1" height="1" />
export async function GET(req: NextRequest) {
  const site = req.nextUrl.searchParams.get("site") || "unknown"
  const referrer = req.headers.get("referer") || null
  const userAgent = req.headers.get("user-agent") || null

  if (supabase) {
    await supabase.from("visits").insert({
      site,
      path: req.nextUrl.searchParams.get("path") || "/",
      referrer,
      user_agent: userAgent,
    })
  }

  // Retourne un GIF transparent 1x1
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  )

  return new NextResponse(pixel, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  })
}
