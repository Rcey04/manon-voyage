"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { VOYAGE, COULEURS_ENCRE, BOUNDS, type Etape } from "@/data/voyage"

export default function CarteLeaflet({
  vue,
  aujourdhui,
  onClickPoint,
}: {
  vue: "mexique" | "nicaragua"
  aujourdhui: Date
  onClickPoint: (id: number) => void
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const layerGroup = useRef<L.LayerGroup | null>(null)

  function estAtteint(etape: Etape) {
    if (etape.unlock === "ouvert") return true
    return aujourdhui >= new Date(etape.unlock)
  }

  function getEtapesForVue(v: "mexique" | "nicaragua") {
    return VOYAGE.filter((e) => {
      if (v === "mexique") return e.pays === "mx" && e.id !== 0
      return e.pays === "ni"
    })
  }

  function updateMarkers(map: L.Map, v: "mexique" | "nicaragua") {
    if (layerGroup.current) layerGroup.current.clearLayers()
    else layerGroup.current = L.layerGroup().addTo(map)

    const etapes = getEtapesForVue(v)
    const atteintes = etapes.filter((e) => estAtteint(e))

    // Future route (dashed)
    if (etapes.length > 1) {
      L.polyline(
        etapes.map((e) => [e.coords[1], e.coords[0]] as L.LatLngExpression),
        { color: "#1A151240", weight: 1.5, dashArray: "8 8" }
      ).addTo(layerGroup.current!)
    }

    // Past route (solid)
    if (atteintes.length > 1) {
      const color = v === "mexique" ? "#D6301F" : "#1E7A4C"
      L.polyline(
        atteintes.map((e) => [e.coords[1], e.coords[0]] as L.LatLngExpression),
        { color, weight: 2.5, dashArray: "10 5" }
      ).addTo(layerGroup.current!)
    }

    // Markers
    etapes.forEach((etape) => {
      const atteint = estAtteint(etape)
      const couleur = COULEURS_ENCRE[etape.encre]

      const icon = L.divIcon({
        className: "",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        html: `<svg viewBox="0 0 20 20" width="20" height="20">
          <circle cx="10" cy="10" r="7" fill="${atteint ? couleur : "none"}" stroke="${couleur}" stroke-width="${atteint ? 0 : 2}" opacity="${atteint ? 1 : 0.4}" />
          ${atteint ? '<circle cx="10" cy="10" r="2.5" fill="#F3E9D6" />' : ""}
        </svg>`,
      })

      const marker = L.marker([etape.coords[1], etape.coords[0]], { icon }).addTo(layerGroup.current!)

      if (atteint) {
        marker.bindPopup(
          `<div style="font-family: system-ui; padding: 4px 0; min-width: 180px;">
            <p style="font-weight: 800; text-transform: uppercase; letter-spacing: -0.02em; font-size: 14px; margin: 0 0 4px; color: ${couleur};">${etape.lieu}</p>
            <p style="font-size: 11px; opacity: 0.5; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">${etape.datesAffichees}</p>
            <p style="font-size: 13px; line-height: 1.6; margin: 0; color: #1A1512;">${etape.funFact}</p>
          </div>`,
          { maxWidth: 260, className: "popup-vintage" }
        )
      }

      marker.on("click", () => onClickPoint(etape.id))
    })
  }

  // Init
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const bounds = BOUNDS[vue]
    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    })

    // Tiles OpenStreetMap classiques
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 12,
      minZoom: 4,
      subdomains: ["a", "b", "c"],
    }).addTo(map)

    // Filtre vintage sépia
    const tilePane = map.getPane("tilePane")
    if (tilePane) {
      tilePane.style.filter = "sepia(0.35) brightness(0.92) contrast(0.95)"
    }

    map.fitBounds([
      [bounds[0][1], bounds[0][0]],
      [bounds[1][1], bounds[1][0]],
    ], { padding: [30, 30] })

    mapInstance.current = map
    updateMarkers(map, vue)

    return () => {
      map.remove()
      mapInstance.current = null
      layerGroup.current = null
    }
  }, [])

  // Switch vue
  useEffect(() => {
    if (!mapInstance.current) return
    const bounds = BOUNDS[vue]
    mapInstance.current.flyToBounds([
      [bounds[0][1], bounds[0][0]],
      [bounds[1][1], bounds[1][0]],
    ], { padding: [30, 30], duration: 0.8 })
    updateMarkers(mapInstance.current, vue)
  }, [vue])

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
}
