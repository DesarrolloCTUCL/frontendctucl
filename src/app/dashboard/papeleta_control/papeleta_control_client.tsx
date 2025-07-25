// app/dashboard/papeleta_control/PapeletaControlClient.tsx
'use client'

import { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { fetchFromBackend } from '@/lib/api_backend'
import { DataTable } from '@/components/mqtt-table'
import { useSearchParams } from 'next/navigation'
import { MapPin } from "lucide-react"

type ChainPC = {
  numero: number
  radius: number
  name: string
  lat: number
  long: number
  hora: string
}

type Turno = {
  itinerary: string
  chainpc: ChainPC[]
  shift_id?: number
}

type Itinerario = {
  recorrido: string
  hora_despacho: string
  hora_fin: string
  turno: Turno
}

type GPSData = {
  control_point_id: number
  datetime: string
  speed: string
  create_at: string
}

export default function PapeletaControlClient() {
  const searchParams = useSearchParams()
  const vehicleId = searchParams.get('vehicle_id')
  const date = searchParams.get('date')

  const [itinerarios, setItinerarios] = useState<Itinerario[]>([])
  const [selectedItinerario, setSelectedItinerario] = useState<Itinerario | null>(null)
  const [gpsData, setGpsData] = useState<GPSData[]>([])

  useEffect(() => {
    if (!vehicleId || !date) return

    const endpoint = `/despacho_display/bus/${vehicleId}/itinerarios?date=${date}`
    console.log('Consultando endpoint:', endpoint)

    fetchFromBackend(endpoint)
      .then((res) => {
        console.log('Respuesta API:', res)
        if (res.status === 'success') {
          const lista = res.data.itinerarios as Itinerario[]
          setItinerarios(lista)
        }
      })
      .catch((err) => console.error('Error al consultar:', err))
  }, [vehicleId, date])

  const handleRowDoubleClick = async (row: Itinerario) => {
    setSelectedItinerario(row)
    setGpsData([]) // limpiar datos previos

    if (!vehicleId || !date) return

    const shiftId = row.turno.shift_id || Number(row.turno.itinerary) || null
    if (!shiftId) {
      console.warn('No se encontró shift_id en el turno')
      return
    }

    const startDatetime = `${date}T${row.hora_despacho}`
    const endDatetime = `${date}T${row.hora_fin}`

    const gpsUrl = `/logGPS/filter/strict?vehicle_id=${vehicleId}&shift_id=${shiftId}&start_datetime=${startDatetime}&end_datetime=${endDatetime}`
    console.log('Consultando datos GPS con:', gpsUrl)

    try {
      const res = await fetchFromBackend(gpsUrl)
      if (res.status === 'success') {
        console.log('Datos recibidos del endpoint logGPS/filter/strict:', res.data)
        setGpsData(res.data)
      } else {
        console.warn('Error en respuesta del endpoint logGPS/filter/strict:', res)
      }
    } catch (error) {
      console.error('Error consultando logGPS/filter/strict:', error)
    }
  }

  const handleMapClick = (itinerario: Itinerario) => {
    if (!vehicleId) {
      alert('Falta vehicle_id')
      return
    }
  
    const start = `${date}T${itinerario.hora_despacho}`
    const end = `${date}T${itinerario.hora_fin}`
    const url = `/dashboard/controlmap?device_id=${vehicleId}&start=${start}&end=${end}`
  
    window.open(url, "_blank")
  }
  
  const itineraryColumns: ColumnDef<Itinerario>[] = [
    { accessorKey: 'recorrido', header: 'Recorrido' },
    { accessorKey: 'hora_despacho', header: 'Hora despacho' },
    { accessorKey: 'hora_fin', header: 'Hora fin' },
    {
      accessorKey: 'turno.itinerary',
      header: 'Turno',
      cell: ({ row }) => row.original.turno.itinerary,
    },
    {
      id: 'ver-mapa',
      header: 'Mapa',
      cell: ({ row }) => (
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => handleMapClick(row.original)}
          title="Ver en mapa"
        >
          <MapPin className="w-5 h-5" />
        </button>
      ),
    }
  ]
  const chainpcColumns: ColumnDef<ChainPC>[] = [
    { accessorKey: 'name', header: 'Punto de control' },
    { accessorKey: 'hora', header: 'Hora de llegada' },
    {
      header: 'Hora GPS',
      cell: ({ row }) => {
        const pcNumero = row.original.numero
        const gps = gpsData.find(g => Number(g.control_point_id) === Number(pcNumero))
        if (!gps?.datetime) return '—'
        return gps.datetime.substring(11, 19) // hh:mm:ss
        
      }
    },
    {
      header: 'Diferencia',
      cell: ({ row }) => {
        const pcNumero = row.original.numero
        const gps = gpsData.find(g => Number(g.control_point_id) === Number(pcNumero))
        if (!gps) return '—'
    
        try {
          const parseTimeToSeconds = (timeStr: string) => {
            const [h, m, s] = timeStr.split(':').map(Number)
            return h * 3600 + m * 60 + s
          }
    
          const gpsTimeStr = gps.datetime.substring(11, 19)
          const pcTimeStr = row.original.hora
    
          const gpsSeconds = parseTimeToSeconds(gpsTimeStr)
          const pcSeconds = parseTimeToSeconds(pcTimeStr)
    
          const diffSeconds = pcSeconds - gpsSeconds // invertimos para que positivo = adelantado
          const sign = diffSeconds > 0 ? '+' : diffSeconds < 0 ? '-' : ''
    
          const absDiff = Math.abs(diffSeconds)
          const minutes = Math.floor(absDiff / 60)
          const seconds = Math.floor(absDiff % 60)
    
          const color =
            diffSeconds > 0
              ? 'text-green-600' // adelantado
              : diffSeconds < 0
              ? 'text-red-600' // retrasado
              : 'text-gray-600' // sin diferencia
    
          return (
            <span className={color}>
              {sign}{minutes}m {seconds}s
            </span>
          )
        } catch {
          return '—'
        }
      }
    }
    
    ,
    {
      header: 'Velocidad',
      cell: ({ row }) => {
        const pcNumero = row.original.numero
        const gps = gpsData.find(g => Number(g.control_point_id) === Number(pcNumero))
        return gps?.speed || '—'
      }
    },
    {
      header: 'Tiempo servidor',
      cell: ({ row }) => {
        const pcNumero = row.original.numero
        const gps = gpsData.find(g => Number(g.control_point_id) === Number(pcNumero))
        if (!gps?.create_at) return '—'
        const dateObj = new Date(gps.create_at)
        const fecha = dateObj.toLocaleDateString('es-CA')
        const hora = dateObj.toLocaleTimeString('es-ES', { hour12: false })
        return `${fecha} ${hora}`
      }
    },
  ]

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Papeleta de Control</h1>
      <div className="flex gap-8 items-start">
        {/* Tabla de itinerarios - lado izquierdo */}
        <div className="flex-1">
          <DataTable
            columns={itineraryColumns}
            data={itinerarios}
            onRowDoubleClick={handleRowDoubleClick}
          />
        </div>

        {/* Tabla de puntos de control - lado derecho */}
        {selectedItinerario && (
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">
              Puntos de Control: {selectedItinerario.recorrido}
            </h2>
            <h2 className="text-lg font-semibold mb-4">
              Horario: {selectedItinerario.hora_despacho} - {selectedItinerario.hora_fin}
            </h2>
            <DataTable columns={chainpcColumns} data={selectedItinerario.turno.chainpc} />
          </div>
        )}
      </div>
    </div>
  )
}
