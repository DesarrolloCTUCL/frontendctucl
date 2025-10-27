'use client'

import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

type TrackPoint = {
  lat: number
  lng: number
  speed?: number
  timestamp?: string
}

type ControlPoint = {
  id: number
  name: string
  lat: number
  long: number
  route: string
  radius: number
}

type TimelineEvent = {
  time: string
  type: 'Inicio' | 'Fin' | 'Punto de control' | 'Trackpoint'
  description: string
  speed?: number
  lat?: number
  lng?: number
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function ControlMapContent() {
  const searchParams = useSearchParams()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const selectedMarkerRef = useRef<mapboxgl.Marker | null>(null)

  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([])
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([])
  const [nearbyPoints, setNearbyPoints] = useState<
    (ControlPoint & { passTime: string })[]
  >([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])

  const deviceId = searchParams.get('device_id')
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  // Fetch trackpoints
  useEffect(() => {
    if (!deviceId || !start || !end) return
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://ctucloja.com/api/trackgps/by-range?device_id=${deviceId}&start=${start}&end=${end}`
        )
        const data = await res.json()
        if (data.status === 'success') {
          setTrackPoints(data.data)
        }
      } catch (err) {
        console.error('Error consultando GPS:', err)
      }
    }
    fetchData()
  }, [deviceId, start, end])

  // Fetch control points
  useEffect(() => {
    const fetchControlPoints = async () => {
      try {
        const res = await fetch('https://ctucloja.com/api/bus-station/control-points')
        const data = await res.json()
        if (data.status === 'success') {
          setControlPoints(data.data.data)
        }
      } catch (err) {
        console.error('Error consultando puntos de control:', err)
      }
    }
    fetchControlPoints()
  }, [])

  // Detect nearby control points
  useEffect(() => {
    if (trackPoints.length === 0 || controlPoints.length === 0) return
    const nearby: (ControlPoint & { passTime: string })[] = []

    controlPoints.forEach((cp) => {
      let closestTp: TrackPoint | null = null
      let minDist = Infinity

      trackPoints.forEach((tp) => {
        const dist = haversine(tp.lat, tp.lng, cp.lat, cp.long)
        const radio = Math.max(cp.radius, 90)
        if (dist <= radio && dist < minDist) {
          minDist = dist
          closestTp = tp
        }
      })

      if (closestTp) {
        const passTime = closestTp.timestamp
          ? closestTp.timestamp.split('T')[1].split('.')[0]
          : 'Sin hora'
        nearby.push({ ...cp, passTime })
      }
    })
    setNearbyPoints(nearby)
  }, [trackPoints, controlPoints])

  // Build timeline
  useEffect(() => {
    if (trackPoints.length === 0) return

    const events: TimelineEvent[] = []

    // Inicio
    if (trackPoints[0].timestamp) {
      events.push({
        time: trackPoints[0].timestamp.split('T')[1].split('.')[0],
        type: 'Inicio',
        description: 'Inicio del recorrido',
        lat: trackPoints[0].lat,
        lng: trackPoints[0].lng,
      })
    }

    // Puntos de control
    nearbyPoints.forEach((cp) => {
      events.push({
        time: cp.passTime,
        type: 'Punto de control',
        description: cp.name,
        lat: cp.lat,
        lng: cp.long,
      })
    })

    // Trackpoints intermedios
    trackPoints.forEach((tp) => {
      if (tp.timestamp) {
        const hora = tp.timestamp.split('T')[1].split('.')[0]
        events.push({
          time: hora,
          type: 'Trackpoint',
          description: 'Posición registrada',
          speed: tp.speed,
          lat: tp.lat,
          lng: tp.lng,
        })
      }
    })

    // Fin
    const last = trackPoints[trackPoints.length - 1]
    if (last.timestamp) {
      events.push({
        time: last.timestamp.split('T')[1].split('.')[0],
        type: 'Fin',
        description: 'Fin del recorrido',
        lat: last.lat,
        lng: last.lng,
      })
    }

    events.sort((a, b) => a.time.localeCompare(b.time))
    setTimeline(events)
  }, [trackPoints, nearbyPoints])

  // Map rendering
  useEffect(() => {
    if (!mapContainerRef.current || trackPoints.length === 0) return

    const coords = trackPoints
      .filter(
        (p) =>
          typeof p.lng === 'number' &&
          typeof p.lat === 'number' &&
          !isNaN(p.lng) &&
          !isNaN(p.lat)
      )
      .map((p) => [p.lng, p.lat]) as [number, number][]

    if (coords.length === 0) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coords[0],
      zoom: 14,
    })
    mapRef.current = map

    map.on('load', () => {
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: coords },
        },
      })

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#3b82f6', 'line-width': 4 },
      })

      // Inicio y fin
      new mapboxgl.Marker({ color: 'green' })
        .setLngLat(coords[0])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Inicio'))
        .addTo(map)

      new mapboxgl.Marker({ color: 'red' })
        .setLngLat(coords[coords.length - 1])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Fin'))
        .addTo(map)

      // Puntos de control
      nearbyPoints.forEach((cp) => {
        new mapboxgl.Marker({ color: 'orange' })
          .setLngLat([cp.long, cp.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setText(
              `Punto: ${cp.name}\nHora paso: ${cp.passTime}`
            )
          )
          .addTo(map)
      })

      // Marcadores celestes cada 10 puntos
      trackPoints.forEach((tp, idx) => {
        if (idx % 10 === 0) {
          const hora = tp.timestamp
            ? tp.timestamp.split('T')[1].split('.')[0]
            : 'Sin hora'
          new mapboxgl.Marker({ color: '#38bdf8' })
            .setLngLat([tp.lng, tp.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setText(
                `Trackpoint\nHora: ${hora}\nVelocidad: ${tp.speed ?? 'N/A'} km/h`
              )
            )
            .addTo(map)
        }
      })
    })

    return () => map.remove()
  }, [trackPoints, nearbyPoints])

  // 🟡 Al hacer click en la tabla
  const handleRowClick = (e: TimelineEvent) => {
    if (!mapRef.current || !e.lat || !e.lng) return
  
    // Centrar mapa en ese punto
    mapRef.current.flyTo({ center: [e.lng, e.lat], zoom: 16 })
  
    // Crear popup con la hora
    const popup = new mapboxgl.Popup({ offset: 25 }).setText(
      `Hora: ${e.time}`
    )
  
    // Mover o crear marcador morado
    if (!selectedMarkerRef.current) {
      selectedMarkerRef.current = new mapboxgl.Marker({ color: '#8b5cf6' }) // morado
        .setLngLat([e.lng, e.lat])
        .setPopup(popup)
        .addTo(mapRef.current)
    } else {
      selectedMarkerRef.current
        .setLngLat([e.lng, e.lat])
        .setPopup(popup)
    }
  
    // Abrir el popup automáticamente
    selectedMarkerRef.current.togglePopup()
  }
  

  return (
    <div className="flex flex-row w-full h-screen gap-4 p-4">
      {/* Mapa cuadrado */}
      <div
        ref={mapContainerRef}
        className="w-[400px] h-[400px] flex-shrink-0 border"
      />
  
      {/* Tabla de eventos */}
      <div className="flex-1 bg-white p-4 border overflow-y-auto">
        <h3 className="font-bold text-lg mb-3">Registro de eventos (inicio → fin)</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1 text-left">Hora</th>
              <th className="border px-2 py-1 text-left">Tipo</th>
              <th className="border px-2 py-1 text-left">Descripción</th>
              <th className="border px-2 py-1 text-left">Velocidad</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((e, i) => (
              <tr
                key={i}
                onClick={() => handleRowClick(e)}
                className="hover:bg-blue-50 cursor-pointer"
              >
                <td className="border px-2 py-1">{e.time}</td>
                <td className="border px-2 py-1">{e.type}</td>
                <td className="border px-2 py-1">{e.description}</td>
                <td className="border px-2 py-1">
                  {e.speed !== undefined ? `${e.speed} km/h` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
  
}
