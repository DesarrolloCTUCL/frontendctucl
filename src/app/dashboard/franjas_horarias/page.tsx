'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { fetchFromBackend } from '@/lib/api_backend'

type ControlStrip = {
  id?: number
  description: string
  startTime: string
  endTime: string
  chainStrip: string
  type: 'se sanciona' | 'se justifica' | 'no sancionable'
}

type ControlPoint = {
  id: number
  name: string
}

export default function ControlStripPage() {
  const [formData, setFormData] = useState<ControlStrip>({
    description: '',
    startTime: '',
    endTime: '',
    chainStrip: '',
    type: 'se sanciona',
  })

  const [controlStrips, setControlStrips] = useState<ControlStrip[]>([])
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchControlStrips = async () => {
    try {
      const res = await fetchFromBackend('/control-strip')
      setControlStrips(res.data)
    } catch (error) {
      console.error('Error al cargar los strips:', error)
    }
  }

  const fetchControlPoints = async () => {
    try {
      const res = await fetch('https://ctucloja.com/api/bus-station/control-points')
      const json = await res.json()
      if (json.status === 'success') {
        setControlPoints(json.data.data)
      }
    } catch (error) {
      console.error('Error al cargar puntos de control:', error)
    }
  }

  useEffect(() => {
    fetchControlStrips()
    fetchControlPoints()
  }, [])

  const handleInputChange = (field: keyof ControlStrip, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleChainStripChange = (selected: string[]) => {
    setFormData((prev) => ({
      ...prev,
      chainStrip: selected.join(','),
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/control-strip/${editingId}` : '/control-strip'

      const startTimeWithSeconds =
        formData.startTime.length === 5 ? formData.startTime + ':00' : formData.startTime
      const endTimeWithSeconds =
        formData.endTime.length === 5 ? formData.endTime + ':00' : formData.endTime

      const bodyToSend = {
        ...formData,
        startTime: startTimeWithSeconds,
        endTime: endTimeWithSeconds,
      }

      await fetchFromBackend(url, {
        method,
        body: JSON.stringify(bodyToSend),
      })

      alert(editingId ? 'Registro actualizado' : 'Registro creado')

      setFormData({
        description: '',
        startTime: '',
        endTime: '',
        chainStrip: '',
        type: 'se sanciona',
      })
      setEditingId(null)
      fetchControlStrips()
    } catch (error) {
      console.error('Error al guardar:', error)
      alert('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (strip: ControlStrip) => {
    setFormData(strip)
    setEditingId(strip.id || null)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingId ? 'Editar' : 'Crear'} Franja Horaria
      </h1>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <Input
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Hora Inicio</label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Hora Fin</label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Puntos de Control</label>
          <select
            multiple
            className="w-full border rounded px-2 py-1 h-32"
            value={formData.chainStrip.split(',').filter(Boolean)}
            onChange={(e) =>
              handleChainStripChange(Array.from(e.target.selectedOptions).map((opt) => opt.value))
            }
          >
            {controlPoints.map((point) => (
              <option key={point.id} value={point.name}>
                {point.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Tipo</label>
          <select
            value={formData.type}
            onChange={(e) =>
              handleInputChange(
                'type',
                e.target.value as 'se sanciona' | 'se justifica' | 'no sancionable'
              )
            }
            className="w-full border rounded px-2 py-1"
          >
            <option value="se sanciona">Se sanciona</option>
            <option value="se justifica">Se justifica</option>
            <option value="no sancionable">No sancionable</option>
          </select>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading
            ? 'Guardando...'
            : editingId
            ? 'Actualizar Registro'
            : 'Crear Registro'}
        </Button>

        {editingId && (
          <Button
            variant="outline"
            onClick={() => {
              setEditingId(null)
              setFormData({
                description: '',
                startTime: '',
                endTime: '',
                chainStrip: '',
                type: 'se sanciona',
              })
            }}
            className="w-full"
          >
            Cancelar edición
          </Button>
        )}
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2">Registros existentes</h2>
      <div className="space-y-2">
        {controlStrips.map((strip) => (
          <div
            key={strip.id}
            className="p-4 border rounded hover:bg-gray-50 flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{strip.description}</div>
              <div className="text-sm text-gray-500">
                {strip.startTime} - {strip.endTime} | {strip.chainStrip} |{' '}
                <em>{strip.type}</em>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleEdit(strip)}
            >
              Editar
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
