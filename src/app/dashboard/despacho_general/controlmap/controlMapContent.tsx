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

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000 // metros
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
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([])
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([])
  const [nearbyPoints, setNearbyPoints] = useState<
    (ControlPoint & { passTime: string })[]
  >([])

  const deviceId = searchParams.get('device_id')
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  // Fetch del recorrido
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

  // Fetch de puntos de control
  useEffect(() => {
    const fetchControlPoints = async () => {
      try {
        const res = await fetch('https://ctucloja.com/api/bus-station/control-points')
        const data = await res.json()
        if (data.status === 'success') {
          setControlPoints(data.data.data) // ojo: endpoint devuelve data.data
        }
      } catch (err) {
        console.error('Error consultando puntos de control:', err)
      }
    }

    fetchControlPoints()
  }, [])

  // Filtrar puntos cercanos al recorrido y asignar hora de paso
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

  // Dibujar mapa
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

    map.on('load', () => {
      // Ruta del bus
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

      // Marcadores de trackpoints (hora exacta)
      trackPoints.forEach((point) => {
        if (
          typeof point.lng === 'number' &&
          typeof point.lat === 'number' &&
          !isNaN(point.lng) &&
          !isNaN(point.lat)
        ) {
          const horaExacta = point.timestamp
            ? point.timestamp.split('T')[1].split('.')[0]
            : 'Sin hora'

          new mapboxgl.Marker()
            .setLngLat([point.lng, point.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setText(`Hora: ${horaExacta}`)
            )
            .addTo(map)
        }
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

      // Puntos de control alcanzados
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
    })

    return () => map.remove()
  }, [trackPoints, nearbyPoints])

  return (
    <div className="flex w-full h-screen">
      {/* Mapa */}
      <div ref={mapContainerRef} className="w-3/4 h-full" />

      {/* Lista de puntos alcanzados */}
      <div className="w-1/4 h-full overflow-y-auto bg-gray-100 p-4">
        <h2 className="font-bold text-lg mb-2">Puntos de control alcanzados</h2>
        {nearbyPoints.length === 0 ? (
          <p className="text-sm text-gray-500">Ningún punto alcanzado</p>
        ) : (
          <ul className="space-y-2">
            {nearbyPoints.map((cp) => (
              <li key={cp.id} className="p-2 bg-white rounded shadow">
                <p className="font-semibold">{cp.name}</p>
                <p className="text-xs text-gray-500">Ruta: {cp.route}</p>
                <p className="text-xs text-gray-700">
                  Hora paso: {cp.passTime}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
