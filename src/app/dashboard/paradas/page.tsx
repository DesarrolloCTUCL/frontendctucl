'use client'

import { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { fetchFromBackend } from '@/lib/api_backend'
import { DataTable } from '@/components/mqtt-table'
import { TableFilters } from '@/components/search'

type BusStation = {
  id: number
  name: string
  lat: number
  long: number
  route: string
  radius: number
  type: string
  created_at: string
  updated_at: string
  status: boolean
}

const columns: ColumnDef<BusStation>[] = [
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'route', header: 'Ruta' },
  { accessorKey: 'lat', header: 'Latitud' },
  { accessorKey: 'long', header: 'Longitud' },
  { accessorKey: 'radius', header: 'Radio' },
  { accessorKey: 'type', header: 'Tipo' },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => (row.original.status ? 'Activa' : 'Inactiva'),
  },
]

export default function ParadasPage() {
  const [data, setData] = useState<BusStation[]>([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    fetchFromBackend('/bus-station')
      .then((res) => setData(res.data))
      .catch((err) => console.error('Error al cargar paradas:', err))
  }, [])

  const handleSetFilters = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filteredData = data.filter((item) => {
    const matchesSearch = [item.name, item.type, item.status ? 'activa' : 'inactiva']
      .some((field) =>
        field.toString().toLowerCase().includes(search.toLowerCase())
      )
  
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true
  
      if (key === 'route') {
        // Si el valor es L6 y el item tiene 'L6,L10', debe hacer match
        return item.route.toLowerCase().split(',').includes(value.toLowerCase())
      }
  
      const typedKey = key as keyof BusStation
      const fieldValue = item[typedKey]
  
      return fieldValue?.toString().toLowerCase() === value.toLowerCase()
    })
  
    return matchesSearch && matchesFilters
  })
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Paradas de Buses</h1>

      <TableFilters
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={handleSetFilters}
        filterOptions={[
          { label: 'Tipo', key: 'type', options: ['CONTROL_POINT', 'NORMAL_STOP'] },
          { label: 'Estado', key: 'status', options: ['true', 'false'] },
          { label: 'Ruta', key: 'route', options: Array.from({ length: 12 }, (_, i) => `L${i + 1}`) },
        ]}
      />

      <DataTable columns={columns} data={filteredData} />
    </div>
  )
}
