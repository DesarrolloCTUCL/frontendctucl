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
  const itineraryParam = searchParams.get('itinerary')

  const [itinerarios, setItinerarios] = useState<Itinerario[]>([])
  const [selectedItinerario, setSelectedItinerario] = useState<Itinerario | null>(null)
  const [gpsData, setGpsData] = useState<GPSData[]>([])
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    if (vehicleId){
      document.title = `Bus ${vehicleId} — Papeleta`

    } else{
 document.title = 'Papeleta de Control'
    }

  }, [])
  // 🕒 Actualiza la hora cada 5 segundos
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeStr = now.toTimeString().substring(0, 8) // hh:mm:ss
      setCurrentTime(timeStr)
    }

    updateTime()
    const interval = setInterval(updateTime, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!vehicleId || !date) return

    const endpoint = `/despacho_display/bus/${vehicleId}/itinerarios?date=${date}`
    fetchFromBackend(endpoint)
      .then((res) => {
        if (res.status === 'success') {
          setItinerarios(res.data.itinerarios as Itinerario[])
        }
      })
      .catch((err) => console.error('Error al consultar:', err))
  }, [vehicleId, date])

  const handleRowDoubleClick = async (row: Itinerario) => {
    setSelectedItinerario(row)
    setGpsData([])
  
    if (!vehicleId || !date) return
  
    const shiftId = row.turno.shift_id || Number(row.turno.itinerary) || null
    if (!shiftId) return
  
    // 🔹 Parsear las horas originales
    const [hStart, mStart, sStart] = row.hora_despacho.split(':').map(Number)
    const [hEnd, mEnd, sEnd] = row.hora_fin.split(':').map(Number)
  
    // 🔹 Crear objetos Date basados en la fecha y horas
    const startDate = new Date(date)
    startDate.setHours(hStart, mStart - 2, sStart) // 2 minutos antes
  
    const endDate = new Date(date)
    endDate.setHours(hEnd, mEnd + 8, sEnd) // 8 minutos después
  
    // 🔹 Formatear igual que antes: "YYYY-MM-DD HH:MM:SS"
    const pad = (n: number) => n.toString().padStart(2, '0')
    const startDatetime = `${date} ${pad(startDate.getHours())}:${pad(startDate.getMinutes())}:${pad(startDate.getSeconds())}`
    const endDatetime = `${date} ${pad(endDate.getHours())}:${pad(endDate.getMinutes())}:${pad(endDate.getSeconds())}`
  
    // 🔹 Mantiene el formato original que sí devolvía datos
    const gpsUrl = `/logGPS/filter/strict?vehicle_id=${vehicleId}&shift_id=${shiftId}&start_datetime=${startDatetime}&end_datetime=${endDatetime}`
  
    try {
      const res = await fetchFromBackend(gpsUrl)
      if (res.status === 'success') {
        setGpsData(res.data)
      } else {
        console.warn('Respuesta sin éxito:', res)
      }
    } catch (error) {
      console.error('Error consultando logGPS/filter/strict:', error)
    }
  }
  

  const handleMapClick = (itinerario: Itinerario) => {
    if (!vehicleId) return

    const start = `${date}T${itinerario.hora_despacho}`
    const end = `${date}T${itinerario.hora_fin}`
    const url = `/dashboard/despacho_general/controlmap?device_id=${vehicleId}&start=${start}&end=${end}`
    window.open(url, "_blank")
  }

  const parseTimeToSeconds = (timeStr: string) => {
    const [h, m, s] = timeStr.split(':').map(Number)
    return h * 3600 + m * 60 + s
  }

  const itineraryColumns: ColumnDef<Itinerario>[] = [
    { accessorKey: 'recorrido', header: 'Recorrido' },
    { accessorKey: 'hora_despacho', header: 'Hora despacho' },
    { accessorKey: 'hora_fin', header: 'Hora fin' },
    //{
     // accessorKey: 'turno.itinerary',
     // header: 'Turno',
    //  cell: ({ row }) => row.original.turno.itinerary,
   // },
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
        const gps = gpsData.find(g => Number(g.control_point_id) === Number(row.original.numero))
        return gps?.datetime ? gps.datetime.substring(11, 19) : '—'
      },
    },
    {
      header: 'Diferencia',
      cell: ({ row }) => {
        const gps = gpsData.find(g => Number(g.control_point_id) === Number(row.original.numero))
        if (!gps) return '—'

        try {
          const gpsTimeStr = gps.datetime.substring(11, 19)
          const pcTimeStr = row.original.hora
          const gpsSeconds = parseTimeToSeconds(gpsTimeStr)
          const pcSeconds = parseTimeToSeconds(pcTimeStr)
          const diffSeconds = pcSeconds - gpsSeconds
          const sign = diffSeconds > 0 ? '+' : diffSeconds < 0 ? '-' : ''
          const absDiff = Math.abs(diffSeconds)
          const minutes = Math.floor(absDiff / 60)
          const seconds = Math.floor(absDiff % 60)
          const color =
            diffSeconds > 0 ? 'text-green-600' :
            diffSeconds < 0 ? 'text-red-600' :
            'text-gray-600'

          return <span className={color}>{sign}{minutes}m {seconds}s</span>
        } catch {
          return '—'
        }
      },
    },
    {
      header: 'Velocidad',
      cell: ({ row }) => {
        const gps = gpsData.find(g => Number(g.control_point_id) === Number(row.original.numero))
        return gps?.speed || '—'
      },
    },
    {
      header: 'Tiempo servidor',
      cell: ({ row }) => {
        const gps = gpsData.find(g => Number(g.control_point_id) === Number(row.original.numero))
        if (!gps?.create_at) return '—'
        const dateObj = new Date(gps.create_at)
        const fecha = dateObj.toLocaleDateString('es-CA')
        const hora = dateObj.toLocaleTimeString('es-ES', { hour12: false })
        return `${fecha} ${hora}`
      },
    },
  ]

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">
        Papeleta de Control
        {vehicleId && <span className="text-gray-700 text-lg ml-2">— Vehículo: <span className="font-semibold text-blue-700">{vehicleId}</span></span>}
        {date && <span className="text-gray-700 text-lg ml-2">— Fecha: <span className="font-semibold text-blue-700">{date}</span></span>}
        {selectedItinerario && <span className="text-gray-700 text-lg ml-2">— Itinerario: <span className="font-semibold text-blue-700">{itineraryParam}</span></span>}
      </h1>

      <div className="flex gap-8 items-start">
        {/* Tabla de itinerarios */}
        <div className="flex-1">
          <DataTable
            columns={itineraryColumns}
            data={itinerarios}
            onRowDoubleClick={handleRowDoubleClick}
            getRowClassName={(row) => {
              if (!currentTime) return ''
              const currentSeconds = parseTimeToSeconds(currentTime)
              const startSeconds = parseTimeToSeconds(row.hora_despacho)
              const endSeconds = parseTimeToSeconds(row.hora_fin)
              const isCurrent = currentSeconds >= startSeconds && currentSeconds <= endSeconds

              if (isCurrent) return 'bg-green-200 text-green-900 font-semibold'
              if (
                selectedItinerario?.recorrido === row.recorrido &&
                selectedItinerario?.hora_despacho === row.hora_despacho &&
                selectedItinerario?.hora_fin === row.hora_fin
              ) return 'bg-blue-100 text-blue-800'

              return ''
            }}
          />
        </div>

        {/* Tabla de puntos de control */}
        {selectedItinerario && (
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">
              Ruta: {selectedItinerario.recorrido}
            </h2>
            <h2 className="text-lg font-semibold mb-4">
              Horario: {selectedItinerario.hora_despacho} - {selectedItinerario.hora_fin}
            </h2>

            <DataTable
              columns={chainpcColumns}
              data={selectedItinerario.turno.chainpc}
              getRowClassName={(row) => {
                if (!currentTime || !selectedItinerario) return ''
                const currentSeconds = parseTimeToSeconds(currentTime)
                const index = selectedItinerario.turno.chainpc.findIndex(pc => pc.numero === row.numero)
                if (index === -1) return ''

                const currentPCSeconds = parseTimeToSeconds(row.hora)
                const prevPCSeconds =
                  index > 0
                    ? parseTimeToSeconds(selectedItinerario.turno.chainpc[index - 1].hora)
                    : currentPCSeconds - 300
                const nextPCSeconds =
                  index < selectedItinerario.turno.chainpc.length - 1
                    ? parseTimeToSeconds(selectedItinerario.turno.chainpc[index + 1].hora)
                    : currentPCSeconds + 300

                const isCurrent = currentSeconds >= prevPCSeconds && currentSeconds <= nextPCSeconds
                return isCurrent ? 'bg-green-200 text-green-900 font-semibold' : ''
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
