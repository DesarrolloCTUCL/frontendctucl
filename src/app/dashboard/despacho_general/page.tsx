'use client'

import { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { fetchFromBackend } from '@/lib/api_backend'
import { DataTable } from '@/components/mqtt-table'
import { TableFilters } from '@/components/search'
import { useRouter } from 'next/navigation'

type Dispatch = {
    id: number
    itinerary: string
    vehicle_id: number
    line_id: number
    date: string
    observations: string
    user_id: number
    driver: number
    create_at: string
    updated_at: string
}

const columns: ColumnDef<Dispatch>[] = [
    { accessorKey: 'itinerary', header: 'Itinerario' },
    { accessorKey: 'vehicle_id', header: 'Vehiculo' },
    { accessorKey: 'line_id', header: 'Linea' },
    {
        accessorKey: 'date',
        header: 'Fecha',
        cell: ({ row }) => {
          const isoDate = row.original.date // "2025-07-22T00:00:00.000Z"
          const fecha = isoDate.slice(0, 10).split('-').reverse().join('/')
          return fecha // "22/07/2025"
        },
      },
    { accessorKey: 'observations', header: 'Observaciones' },
    { accessorKey: 'driver', header: 'Conductor' },
    {
        accessorKey: 'create_at',
        header: 'Fecha registro',
        cell: ({ row }) => {
            const date = new Date(row.original.create_at)
            return date.toLocaleDateString('es-EC', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            })
        },
    },
]

export default function SchedulePage() {
    const [data, setData] = useState<Dispatch[]>([])
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const fetchByDate = async (date: string) => {
        try {
            setLoading(true)
            const res = await fetchFromBackend(`/schedule/by-exact-date?date=${date}`)
            setData(res.data)
        } catch (err) {
            console.error('Error al filtrar por fecha:', err)
            setData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (filters.date) {
            fetchByDate(filters.date)
        }
    }, [filters.date])

    const handleRowDoubleClick = (row: Dispatch) => {
        const itinerary = encodeURIComponent(row.itinerary)
        const vehicle = encodeURIComponent(row.vehicle_id.toString())
        const date = encodeURIComponent(row.date.split('T')[0]) // Asegura formato YYYY-MM-DD
        router.push(`/dashboard/papeleta_control?itinerary=${itinerary}&vehicle_id=${vehicle}&date=${date}`)
    }

    const handleSetFilters = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const filteredData = data.filter((item) => {
        const matchesSearch = [item.itinerary, item.date, item.vehicle_id]
            .some((field) =>
                field.toString().toLowerCase().includes(search.toLowerCase())
            )

        const matchesFilters = Object.entries(filters).every(([key, value]) => {
            if (!value || key === 'date') return true

            if (key === 'itinerary') {
                return item.itinerary.toLowerCase().split(',').includes(value.toLowerCase())
            }

            const typedKey = key as keyof Dispatch
            const fieldValue = item[typedKey]
            return fieldValue?.toString().toLowerCase().includes(value.toLowerCase())
        })

        return matchesSearch && matchesFilters
    })

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Despachos</h1>

            <TableFilters
                search={search}
                setSearch={setSearch}
                filters={filters}
                setFilters={handleSetFilters}
                filterOptions={[
                    {
                        label: 'Línea',
                        key: 'line_id',
                        options: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
                    },
                ]}
            />

            <div className="mb-4">
                <label className="mr-2">Filtrar por fecha:</label>
                <input
                    type="date"
                    className="p-2 border border-gray-300 rounded"
                    value={filters.date || ''}
                    onChange={(e) => handleSetFilters('date', e.target.value)}
                />
            </div>

            {loading ? (
                <p className="text-gray-500">Cargando datos...</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredData}
                    onRowDoubleClick={handleRowDoubleClick}
                />
            )}
        </div>
    )
}
