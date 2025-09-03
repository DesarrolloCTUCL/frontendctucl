'use client'

import mapboxgl from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

// Tipo según la estructura esperada del endpoint
type RechargePoint = {
    id: number
    lat: number
    long: number
    business_name?: string
    address?: string
  }
  

export default function MapRechargePointsPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [points, setPoints] = useState<RechargePoint[]>([])

  // Inicializar el mapa solo una vez
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-79.2036, -3.9931], // centro inicial, ajústalo según tus puntos
        zoom: 12,
      })
    }
  }, [])

  // Fetch para obtener puntos de recarga
  useEffect(() => {
    async function fetchPoints() {
      try {
        const res = await fetch('https://ctucloja.com/api/recharge-point')
        const json = await res.json()

        // Aquí depende cómo venga el JSON, asumo json.data es un array de puntos
        if (json.status === 'success' && Array.isArray(json.data)) {
          setPoints(json.data)
        } else {
          console.warn('No se encontraron puntos de recarga')
        }
      } catch (error) {
        console.error('Error cargando puntos de recarga:', error)
      }
    }
    fetchPoints()
  }, [])

  // Agregar marcadores cada vez que cambian los puntos
  useEffect(() => {
    if (!mapRef.current) return
  
  }, [points])

  // Mejor manejo con array de markers en un ref para limpiar antes de pintar nuevos
  const markersRef = useRef<mapboxgl.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current) return

    // Limpiar marcadores previos
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    points.forEach((point) => {
        if (typeof point.lat !== 'number' || typeof point.long !== 'number') return
      
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <strong>Nombre local:</strong> ${point.business_name ?? 'Sin nombre'}<br/>
          <strong>Dirección:</strong> ${point.address ?? 'Sin dirección'}
        `)
      
        const marker = new mapboxgl.Marker({ color: 'blue' })
          .setLngLat([point.long, point.lat])
          .setPopup(popup)
          .addTo(mapRef.current!)
      
        markersRef.current.push(marker)
      })
      

    // Opcional: centrar el mapa en el primer punto (si hay)
    if (points.length > 0) {
      const { lat, long } = points[0]
      mapRef.current.flyTo({ center: [long, lat], zoom: 13, speed: 0.7 })
    }
  }, [points])

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '100vh' }}
      className="map-container"
    />
  )
}
