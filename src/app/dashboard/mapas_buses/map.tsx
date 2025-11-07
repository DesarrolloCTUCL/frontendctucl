'use client'

import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

type TrackPoint = {
 
  device_id: number
  lat: number
  lng: number
  speed?: number
  timestamp?: string
  created_at?: string
}

interface MapBusTrackerProps {
  deviceId: string
}

export default function MapBusTracker({ deviceId }: MapBusTrackerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)

  const [lastPosition, setLastPosition] = useState<TrackPoint | null>(null)

  // Inicializar el mapa
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-79.2036, -3.9931],
        zoom: 13,
      })
    }
  }, [])

  // Función para obtener la última posición del bus
  const fetchLastPosition = async () => {
    try {
      if (!deviceId) return

      const url = `https://ctucloja.com/api/trackgps/last?device_id=${deviceId}`
      const res = await fetch(url)
      const json = await res.json()
      if (json.status === 'success' && json.data) {
        setLastPosition(json.data)
      } else {
        console.warn('No se encontró posición para el bus.')
      }
    } catch (error) {
      console.error('Error consultando última posición:', error)
    }
  }

  function formatTimestamp(timestamp?: string) {
    if (!timestamp) return 'Sin hora'
    const fixedTimestamp = timestamp.replace('Z', '') // quitar Z para evitar desfase
    return new Date(fixedTimestamp).toLocaleTimeString('es-EC', {
      timeZone: 'America/Guayaquil',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  // Actualizar cada 30s
  useEffect(() => {
    fetchLastPosition()
    const interval = setInterval(fetchLastPosition, 15000)
    return () => clearInterval(interval)
  }, [deviceId])


  // Actualizar marcador en el mapa
  useEffect(() => {
    if (lastPosition && mapRef.current) {
      const { lat, lng, timestamp } = lastPosition

      const fixedTimestamp = timestamp ? timestamp.replace('Z', '') : null
      const formattedTime = formatTimestamp
        ? new Date(fixedTimestamp).toLocaleTimeString('es-EC', {
            timeZone: 'America/Guayaquil',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })
        : 'Sin hora'

      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(`Hora: ${formattedTime}`))
          .addTo(mapRef.current)
      } else {
        markerRef.current.setLngLat([lng, lat])
        markerRef.current.getPopup()?.setText(`Hora: ${formattedTime}`)
      }

      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 15,
        speed: 0.7,
      })
    }
  }, [lastPosition])


  
  return (
    <div className="flex w-full h-screen">
      {/* Mapa a la izquierda */}
      <div ref={mapContainerRef} className="flex-1 h-full" />


      {/* Panel info a la derecha */}
      <div className="w-80 bg-white shadow-xl border-l p-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>Información del Bus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lastPosition ? (
              <>
                <p><strong>Dispositivo:</strong> {lastPosition.device_id}</p>
                <p><strong>Latitud:</strong> {lastPosition.lat.toFixed(6)}</p>
                <p><strong>Longitud:</strong> {lastPosition.lng.toFixed(6)}</p>
                <p><strong>Velocidad:</strong> {lastPosition.speed ?? 0} km/h</p>
                <p><strong>Hora:</strong> {formatTimestamp(lastPosition.timestamp)}</p>
              </>
            ) : (
              <p className="text-gray-500">Cargando datos...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
