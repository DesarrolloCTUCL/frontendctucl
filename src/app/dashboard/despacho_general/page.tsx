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
        accessorKey: 'date', header: 'Fecha', cell: ({ row }) => {
            const date = new Date(row.original.date)
            return date.toLocaleDateString('es-EC', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })
        },
    },
    { accessorKey: 'observations', header: 'Observaciones' },
    { accessorKey: 'driver', header: 'Conductor' },
    {
        accessorKey: 'create_at', header: 'Fecha registro', cell: ({ row }) => {
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

export default function Schedule_page() {
    const [data, setData] = useState<Dispatch[]>([])
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        fetchFromBackend('/schedule')
            .then((res) => setData(res.data))
            .catch((err) => console.error('Error al cargar paradas:', err))
    }, [])

    const router = useRouter()

    const handleRowDoubleClick = (row: Dispatch) => {
        const itinerary = encodeURIComponent(row.itinerary)
        const vehicle = encodeURIComponent(row.vehicle_id.toString())
        const dateObj = new Date(row.date)
        const formattedDate = dateObj.toISOString().split('T')[0]
        const date = encodeURIComponent(formattedDate)
      
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
            if (!value) return true

            if (key === 'itinerary') {
                return item.itinerary.toLowerCase().split(',').includes(value.toLowerCase())
            }

            return (item as any)[key]?.toString().toLowerCase().includes(value.toLowerCase())
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
                    { label: 'Línea', key: 'line_id', options: Array.from({ length: 12 }, (_, i) => `${i + 1}`), },]}
                    
            />
            <div className="mb-4">
                <input
                    type="date"
                    className="p-2 border border-gray-300 rounded"
                    value={filters.created_at || ''}
                    onChange={(e) => handleSetFilters('date', e.target.value)}
                />
            </div>
            <DataTable
                columns={columns}
                data={filteredData}
                onRowDoubleClick={handleRowDoubleClick}
            />

        </div>
    )
}