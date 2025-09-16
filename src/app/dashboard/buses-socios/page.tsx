'use client'

import { useEffect, useState, useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/mqtt-table"
import { TableFilters } from "@/components/search"

type Vehicle = {
  id: number
  register: number
  partner: string
  dni: string | null
  phone: string | null
  company: string
  plate: string | null
  operation_status: string
  grupo: string
  status: boolean
}

export default function VehiclePage() {
  const [data, setData] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  // estados de búsqueda y filtros
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<{ [key: string]: string }>({})

  // columnas de la tabla
  const columns: ColumnDef<Vehicle>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "register", header: "Registro" },
    { accessorKey: "partner", header: "Socio" },
    { accessorKey: "company", header: "Compañía" },
    { accessorKey: "operation_status", header: "Estado Operación" },
    { accessorKey: "grupo", header: "Grupo" },
    {
      accessorKey: "status",
      header: "Activo",
      cell: ({ row }) => (row.original.status ? "✅" : "❌"),
    },
  ]

  // traer datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://ctucloja.com/api/vehicle")
        const json = await res.json()
        setData(json.data)
      } catch (error) {
        console.error("Error al obtener vehículos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // aplicar filtros y búsqueda
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchMatch =
        search === "" ||
        item.register.toString().includes(search) ||
        item.partner.toLowerCase().includes(search.toLowerCase())

      const companyMatch =
        !filters.company || item.company === filters.company

      const grupoMatch = !filters.grupo || item.grupo === filters.grupo

      return searchMatch && companyMatch && grupoMatch
    })
  }, [data, search, filters])

  // opciones únicas para los filtros dinámicos
  const filterOptions = [
    {
      label: "Filtrar por Compañía",
      key: "company",
      options: Array.from(new Set(data.map((v) => v.company))),
    },
    {
      label: "Filtrar por Grupo",
      key: "grupo",
      options: Array.from(new Set(data.map((v) => v.grupo))),
    },
  ]

  if (loading) {
    return <p className="p-4">Cargando vehículos...</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Listado de Vehículos</h1>

      {/* componente de búsqueda y filtros */}
      <TableFilters
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        filterOptions={filterOptions}
      />

      {/* tabla */}
      <DataTable
        columns={columns}
        data={filteredData}
        onRowDoubleClick={(row) => {
          console.log("Doble click en:", row)
        }}
      />
    </div>
  )
}
