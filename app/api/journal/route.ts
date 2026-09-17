import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ entries: [] })
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("date", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ entries: data })
}

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ ok: true, synced: false })
  }

  const entry = await req.json()

  const { error } = await supabase.from("journal_entries").upsert(
    {
      id: entry.id,
      date: entry.date,
      etape_id: entry.etapeId,
      texte: entry.texte,
      humeur: entry.humeur,
      photos: entry.photos || [],
      created_at: entry.createdAt,
      updated_at: entry.updatedAt,
    },
    { onConflict: "id" }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, synced: true })
}
