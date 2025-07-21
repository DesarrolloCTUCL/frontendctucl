'use client'

import { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { fetchFromBackend } from '@/lib/api_backend'
import { DataTable } from '@/components/mqtt-table'
import { TableFilters } from '@/components/search'

type Recharge_point = {
    id: number
    business_name: string
    name: string
    ruc: string
    phone: string
    email: string
    address: string
    device_username: string
    device_password: string
    device_id: string
    contract: string
    lat: number
    long: number
    status: boolean
    create_at: string
    updated_at: string
}

const columns: ColumnDef<Recharge_point>[] = [
    { accessorKey: 'business_name', header: 'Local' },
    { accessorKey: 'name', header: 'Nombre' },
    { accessorKey: 'ruc', header: 'Ruc' },
    { accessorKey: 'phone', header: 'Telefono' },
    { accessorKey: 'email', header: 'Correo' },
    { accessorKey: 'address', header: 'Direccion' },
    { accessorKey: 'device_username', header: 'Usuario' },
    { accessorKey: 'device_password', header: 'Contraseña' },
    { accessorKey: 'contract', header: 'Contrato' },
    { accessorKey: 'status', header: 'Estado' },
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

export default function Recharge_point_page() {
    const [data, setData] = useState<Recharge_point[]>([])
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<{ [key: string]: string }>({})

    useEffect(() => {
        fetchFromBackend('/recharge-point')
            .then((res) => setData(res.data))
            .catch((err) => console.error('Error al cargar paradas:', err))
    }, [])

    const handleSetFilters = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const filteredData = data.filter((item) => {
        const matchesSearch = [item.business_name, item.name, item.address]
            .some((field) =>
                field.toString().toLowerCase().includes(search.toLowerCase())
            )

        const matchesFilters = Object.entries(filters).every(([key, value]) => {
            if (!value) return true


            return (item as any)[key]?.toString().toLowerCase().includes(value.toLowerCase())
        })

        return matchesSearch && matchesFilters
    })

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Puntos de recarga</h1>

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
            <DataTable columns={columns} data={filteredData} />
        </div>
    )
}