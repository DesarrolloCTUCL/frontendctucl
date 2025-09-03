'use client'

import { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/mqtt-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { fetchFromBackend } from '@/lib/api_backend'

type Itinerario = {
  id: number
  code: string
  route: string
  start_time: string
  end_time: string
  itinerary: string
  shift_id: number
  km_traveled: string
}

const LINEAS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'LESP']

export default function Page() {
  const [lineaSeleccionada, setLineaSeleccionada] = useState('L3')
  const [dataItinerariosPorClave, setDataItinerariosPorClave] = useState<Record<string, Itinerario[]>>({})
  const [selectedItinerary, setSelectedItinerary] = useState('') // '' = todos
  const [tablaData, setTablaData] = useState<Itinerario[]>([])
  const [selected, setSelected] = useState<Itinerario | null>(null)
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [route, setRoute] = useState('')
  const [kmTraveled, setKmTraveled] = useState('')
  const [shiftId, setShiftId] = useState<number | null>(null)
  const [endTimeCalculado, setEndTimeCalculado] = useState('')
  const [timesShift, setTimesShift] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para sumar los tiempos en formato "times"
  function sumarTimes(horaInicio: string, timesStr: string): string {
    if (!horaInicio || !timesStr) return ''
  
    const [horaStr, minutoStr] = horaInicio.split(':')
    const hora = parseInt(horaStr)
    const minuto = parseInt(minutoStr)
  
    if (isNaN(hora) || isNaN(minuto)) return ''
  
    let totalSegundos = (hora * 3600) + (minuto * 60)
  
    const tiempos = timesStr.split(',').map(t => parseFloat(t))
    for (const tiempo of tiempos) {
      const minutos = Math.floor(tiempo)
      const segundos = Math.round((tiempo - minutos) * 60)
      totalSegundos += (minutos * 60) + segundos
    }
  
    const horasResultantes = Math.floor(totalSegundos / 3600) % 24
    const minutosResultantes = Math.floor((totalSegundos % 3600) / 60)
  
    const hh = horasResultantes.toString().padStart(2, '0')
    const mm = minutosResultantes.toString().padStart(2, '0')
  
    return `${hh}:${mm}`
  }
  
  // Traer datos de la línea
  const getItinerarios = async (linea: string) => {
    console.log('> Cargando itinerarios línea:', linea)
    try {
      const json = await fetchFromBackend(`/itineraries/line/${linea}`)
      console.log('> Respuesta de backend:', json)

      const dataPorClave = json.data as Record<string, Itinerario[]>

      setDataItinerariosPorClave(dataPorClave)
      setError(null)

      const todos = Object.values(dataPorClave).flat()
      setTablaData(todos)
      setSelectedItinerary('')
    } catch (err: any) {
      console.error('> Error al cargar itinerarios:', err)
      setError(err.message || 'Error desconocido')
      setDataItinerariosPorClave({})
      setTablaData([])
    }
    setSelected(null)
  }

  useEffect(() => {
    getItinerarios(lineaSeleccionada)
  }, [lineaSeleccionada])

  const columns: ColumnDef<Itinerario>[] = [
    { accessorKey: 'code', header: 'Código' },
    { accessorKey: 'route', header: 'Ruta' },
    { accessorKey: 'start_time', header: 'Hora Inicio' },
    { accessorKey: 'end_time', header: 'Hora Fin' },
    { accessorKey: 'itinerary', header: 'Itinerario' },
  ]

  const clavesItinerarios = Object.keys(dataItinerariosPorClave).sort()

  const onItineraryChange = (itinerary: string) => {
    setSelectedItinerary(itinerary)
    setSelected(null)
    if (itinerary === '') {
      setTablaData(Object.values(dataItinerariosPorClave).flat())
    } else {
      setTablaData(dataItinerariosPorClave[itinerary] || [])
    }
  }

  const handleRowDoubleClick = (row: Itinerario) => {
    console.log('> Doble clic en fila:', row)
    setSelected(row)
    setStartTime(row.start_time)
    setEndTime(row.end_time)
    setRoute(row.route)
    setKmTraveled(row.km_traveled)
    setShiftId(row.shift_id)
    setEndTimeCalculado('') // limpio el calculado
    setTimesShift('')
  }

  const handleStartTimeChange = async (hora: string) => {
    setStartTime(hora)
  
    if (!selected) return
  
    try {
      const res = await fetch(`https://ctucloja.com/api/shift/${selected.shift_id}`)
      if (!res.ok) throw new Error('Error al obtener shift')
      const json = await res.json()
      const timesStr = json.data.times || ''
      setTimesShift(timesStr)
  
      const nuevaHoraFin = sumarTimes(hora, timesStr)
      setEndTimeCalculado(nuevaHoraFin) // solo calculamos, no cambiamos endTime directamente
    } catch (error) {
      console.error('Error fetching shift times:', error)
      setTimesShift('')
      setEndTimeCalculado('')
    }
  }

  // Aquí está el handleUpdate para enviar los cambios y crear una nueva versión
  const handleUpdate = async () => {
    if (!selected || shiftId === null) return
    setLoading(true)
    console.log('> Actualizando itinerario:', selected.code, { startTime, endTime, route, kmTraveled, shiftId })

    try {
      const res = await fetchFromBackend(`/itineraries/${selected.code}`, {
        method: 'PUT',
        body: JSON.stringify({
          start_time: startTime,
          end_time: endTime,
          route,
          km_traveled: kmTraveled,
          shift_id: shiftId.toString(),
        }),
      })
      console.log('> Respuesta actualización:', res)

      alert('Itinerario actualizado')
      setSelected(null)
      getItinerarios(lineaSeleccionada)
      setEndTimeCalculado('')
      setTimesShift('')
    } catch (err: any) {
      console.error('> Error al actualizar:', err)
      alert('Error al actualizar: ' + (err.message || 'Error desconocido'))
    }
    setLoading(false)
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Itinerarios - Línea: {lineaSeleccionada}</h1>

      {/* Selector línea */}
      <div className="mb-4 flex items-center gap-6">
        <div>
          <label htmlFor="linea-select" className="font-semibold mr-2">
            Seleccionar línea:
          </label>
          <select
            id="linea-select"
            value={lineaSeleccionada}
            onChange={(e) => setLineaSeleccionada(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {LINEAS.map((linea) => (
              <option key={linea} value={linea}>
                {linea}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="itinerary-select" className="font-semibold mr-2">
            Seleccionar itinerario:
          </label>
          <select
            id="itinerary-select"
            value={selectedItinerary}
            onChange={(e) => onItineraryChange(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            {clavesItinerarios.map((clave) => (
              <option key={clave} value={clave}>
                {clave}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
          Error: {error}
        </div>
      )}

      {/* Contenedor flex para tabla + edición */}
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <DataTable columns={columns} data={tablaData} onRowDoubleClick={handleRowDoubleClick} />
        </div>

        {selected && (
          <div className="w-96 border p-4 rounded-md bg-gray-100 flex-shrink-0">
            <h2 className="text-lg font-semibold mb-4">Editar Itinerario: {selected.code}</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1">Ruta</label>
                <Input
                  type="text"
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1">Hora Inicio</label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1">Hora Fin Calculada</label>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={endTimeCalculado}
                    readOnly
                    className="w-full bg-gray-200"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setEndTime(endTimeCalculado)}
                    disabled={!endTimeCalculado}
                  >
                    Usar
                  </Button>
                </div>
              </div>

              <div>
                <label className="block mb-1">Hora Fin (editable)</label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1">Km Recorridos</label>
                <Input
                  type="text"
                  value={kmTraveled}
                  onChange={(e) => setKmTraveled(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-1">Shift ID</label>
                <Input
                  type="number"
                  value={shiftId || ''}
                  onChange={(e) => setShiftId(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <Button onClick={handleUpdate} disabled={loading} className="flex-1">
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button variant="outline" onClick={() => setSelected(null)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
