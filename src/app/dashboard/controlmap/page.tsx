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

export default function ControlMap() {
  const searchParams = useSearchParams()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([])

  const deviceId = searchParams.get('device_id')
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  useEffect(() => {
    if (!deviceId || !start || !end) return

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://ctucloja.com/api/trackgps/by-range?device_id=${deviceId}&start=${start}&end=${end}`
        )
        const data = await res.json()
        console.log('Datos recibidos:', data.data)
        if (data.status === 'success') {
          setTrackPoints(data.data)
        } else {
          console.warn('Respuesta inesperada:', data)
        }
      } catch (err) {
        console.error('Error consultando GPS:', err)
      }
    }

    fetchData()
  }, [deviceId, start, end])

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

    if (coords.length === 0) {
      console.error('Coordenadas inválidas:', trackPoints[0])
      return
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coords[0],
      zoom: 14,
    })

    map.on('load', () => {
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coords,
          },
        },
      })

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 4,
        },
      })

      // Marcadores con popup cerrado que muestran la hora de cada punto
      trackPoints.forEach((point) => {
        if (
          typeof point.lng === 'number' &&
          typeof point.lat === 'number' &&
          !isNaN(point.lng) &&
          !isNaN(point.lat)
        ) {
          new mapboxgl.Marker()
            .setLngLat([point.lng, point.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setText(
                point.timestamp
                  ? `Hora: ${new Date(point.timestamp).toLocaleTimeString()}`
                  : 'Sin hora'
              )
            )
            .addTo(map)
        }
      })

      // Marcadores especiales inicio y fin
      new mapboxgl.Marker({ color: 'green' })
        .setLngLat(coords[0])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Inicio'))
        .addTo(map)

      new mapboxgl.Marker({ color: 'red' })
        .setLngLat(coords[coords.length - 1])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Fin'))
        .addTo(map)
    })

    return () => map.remove()
  }, [trackPoints])

  return (
    <div className="w-full h-screen">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  )
}
