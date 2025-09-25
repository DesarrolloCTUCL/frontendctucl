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
  km_traveled: string,
  end_time_calculado?: string
}

const LINEAS = ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10','L11','L12','LESP']

export default function Page() {
  const [lineaSeleccionada, setLineaSeleccionada] = useState('L3')
  const [dataItinerariosPorClave, setDataItinerariosPorClave] = useState<Record<string, Itinerario[]>>({})
  const [selectedItinerary, setSelectedItinerary] = useState('') // '' = todos
  const [tablaData, setTablaData] = useState<Itinerario[]>([])
  const [selectedRows, setSelectedRows] = useState<Itinerario[]>([])
  const [editedRows, setEditedRows] = useState<Record<number, Partial<Itinerario & { end_time_calculado?: string }>>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para sumar tiempos
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
    const hh = horasResultantes.toString().padStart(2,'0')
    const mm = minutosResultantes.toString().padStart(2,'0')
    return `${hh}:${mm}`
  }

  // Traer datos de la línea
  const getItinerarios = async (linea: string) => {
    console.log('> Cargando itinerarios línea:', linea)
    try {
      const json = await fetchFromBackend(`/itineraries/line/${linea}`)
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
    setSelectedRows([])
    setEditedRows({})
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
    setSelectedRows([])
    setEditedRows({})
    if (itinerary === '') {
      setTablaData(Object.values(dataItinerariosPorClave).flat())
    } else {
      setTablaData(dataItinerariosPorClave[itinerary] || [])
    }
  }

  // Seleccionar todas las filas de un itinerario
  const handleRowDoubleClick = (row: Itinerario) => {
    if (!selectedItinerary) return
    const filas = dataItinerariosPorClave[selectedItinerary] || []
    setSelectedRows(filas)

    // Inicializar estados de edición por fila
    const initialEdits: Record<number, Partial<Itinerario>> = {}
    filas.forEach(f => {
      initialEdits[f.id] = {
        route: f.route,
        start_time: f.start_time,
        end_time: f.end_time,
        km_traveled: f.km_traveled,
        shift_id: f.shift_id,
        end_time_calculado: ''
      }
    })
    setEditedRows(initialEdits)
  }

  // Recalcular hora fin cuando cambie hora inicio
  const handleStartTimeChange = async (row: Itinerario, hora: string) => {
    setEditedRows(prev => ({
      ...prev,
      [row.id]: { ...prev[row.id], start_time: hora }
    }))

    try {
      if (!row.shift_id) return
      const res = await fetch(`https://ctucloja.com/api/shift/${row.shift_id}`)
      if (!res.ok) throw new Error('Error al obtener shift')
      const json = await res.json()
      const timesStr = json.data.times || ''
      const nuevaHoraFin = sumarTimes(hora, timesStr)

      setEditedRows(prev => ({
        ...prev,
        [row.id]: { ...prev[row.id], end_time_calculado: nuevaHoraFin }
      }))
    } catch (error) {
      console.error(error)
      setEditedRows(prev => ({
        ...prev,
        [row.id]: { ...prev[row.id], end_time_calculado: '' }
      }))
    }
  }

  // Actualizar todo el itinerario
  const handleUpdateMultiple = async () => {
    if (!selectedRows.length) return
    setLoading(true)
    try {
      const promises = selectedRows.map(row => {
        const edit = editedRows[row.id] || {}
        return fetchFromBackend(`/itineraries/${row.code}`, {
          method: 'PUT',
          body: JSON.stringify({
            start_time: edit.start_time,
            end_time: edit.end_time,
            route: edit.route,
            km_traveled: edit.km_traveled,
            shift_id: String(edit.shift_id),
          }),
        })
      })
      await Promise.all(promises)
      alert('Itinerario actualizado correctamente')
      setSelectedRows([])
      setEditedRows({})
      getItinerarios(lineaSeleccionada)
    } catch (err: any) {
      console.error(err)
      alert('Error al actualizar: ' + (err.message || 'Error desconocido'))
    }
    setLoading(false)
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Itinerarios - Línea: {lineaSeleccionada}</h1>

      <div className="mb-4 flex items-center gap-6">
        <div>
          <label htmlFor="linea-select" className="font-semibold mr-2">Seleccionar línea:</label>
          <select
            id="linea-select"
            value={lineaSeleccionada}
            onChange={(e) => setLineaSeleccionada(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {LINEAS.map(linea => <option key={linea} value={linea}>{linea}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="itinerary-select" className="font-semibold mr-2">Seleccionar itinerario:</label>
          <select
            id="itinerary-select"
            value={selectedItinerary}
            onChange={(e) => onItineraryChange(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Todos</option>
            {clavesItinerarios.map(clave => <option key={clave} value={clave}>{clave}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">Error: {error}</div>
      )}

      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <DataTable columns={columns} data={tablaData} onRowDoubleClick={handleRowDoubleClick} />
        </div>

        {selectedRows.length > 0 && (
          <div className="w-96 border p-4 rounded-md bg-gray-100 flex-shrink-0 overflow-y-auto max-h-[80vh]">
            <h2 className="text-lg font-semibold mb-4">Editar Itinerario: {selectedItinerary}</h2>
            {selectedRows.map((row, index) => {
              const edit = editedRows[row.id] || {}
              return (
                <div key={row.id} className="mb-4 p-2 border rounded bg-white">
                  <h3 className="font-semibold mb-2">Fila {index + 1} - Código: {row.code}</h3>
                  <Input
                    type="text"
                    value={edit.route || ''}
                    onChange={(e) =>
                      setEditedRows(prev => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], route: e.target.value }
                      }))
                    }
                    placeholder="Ruta"
                    className="mb-2 w-full"
                  />
                  <Input
                    type="time"
                    value={edit.start_time || ''}
                    onChange={(e) => handleStartTimeChange(row, e.target.value)}
                    className="mb-2 w-full"
                  />
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="time"
                      value={edit.end_time_calculado || ''}
                      readOnly
                      className="w-full bg-gray-200"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        setEditedRows(prev => ({
                          ...prev,
                          [row.id]: { ...prev[row.id], end_time: edit.end_time_calculado }
                        }))
                      }
                      disabled={!edit.end_time_calculado}
                    >
                      Usar
                    </Button>
                  </div>
                  <Input
                    type="time"
                    value={edit.end_time || ''}
                    onChange={(e) =>
                      setEditedRows(prev => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], end_time: e.target.value }
                      }))
                    }
                    className="mb-2 w-full"
                  />
                  <Input
                    type="text"
                    value={edit.km_traveled || ''}
                    onChange={(e) =>
                      setEditedRows(prev => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], km_traveled: e.target.value }
                      }))
                    }
                    placeholder="Km Recorridos"
                    className="mb-2 w-full"
                  />
                  <Input
                    type="number"
                    value={edit.shift_id || ''}
                    onChange={(e) =>
                      setEditedRows(prev => ({
                        ...prev,
                        [row.id]: { ...prev[row.id], shift_id: Number(e.target.value) }
                      }))
                    }
                    placeholder="Shift ID"
                    className="mb-2 w-full"
                  />
                </div>
              )
            })}
            <Button onClick={handleUpdateMultiple} disabled={loading} className="mt-2 w-full">
              {loading ? 'Guardando...' : 'Guardar Cambios en Todo el Itinerario'}
            </Button>
            <Button variant="outline" onClick={()=>setSelectedRows([])} className="mt-2 w-full">Cancelar</Button>
          </div>
        )}
      </div>
    </div>
  )
}