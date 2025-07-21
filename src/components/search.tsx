'use client'

import { ChangeEvent } from 'react'

type FilterProps = {
  search: string
  setSearch: (value: string) => void
  filters: { [key: string]: string }
  setFilters: (key: string, value: string) => void
  filterOptions?: { label: string; key: string; options: string[] }[]
}

export function TableFilters({
  search,
  setSearch,
  filters,
  setFilters,
  filterOptions = [],
}: FilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 mb-4">
      <input
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-64 p-2 border border-gray-300 rounded"
      />

      {filterOptions.map(({ label, key, options }) => (
        <select
          key={key}
          value={filters[key] || ''}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setFilters(key, e.target.value)
          }
          className="w-full md:w-48 p-2 border border-gray-300 rounded"
        >
          <option value="">{label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ))}
    </div>
  )
}
