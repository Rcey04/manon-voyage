import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ ok: false })
  }

  const body = await req.json()

  await supabase.from("visits").insert({
    site: body.site || "manon-voyage",
    path: body.path || "/",
    referrer: body.referrer || null,
    user_agent: body.userAgent || null,
  })

  return NextResponse.json({ ok: true })
}

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ visits: [] })
  }

  const { data } = await supabase
    .from("visits")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  return NextResponse.json({ visits: data })
}
