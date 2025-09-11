'use client'

import { useState } from 'react'

export default function ImportItinerariesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage('Selecciona un archivo primero')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('https://ctucloja.com/api/itineraries/import-excel', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Error al subir el archivo')
      }

      const data = await res.json()
      setMessage(`✅ ${data.updated} itinerarios actualizados`)
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold">Importar Itinerarios desde Excel</h1>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="block w-full border border-gray-300 rounded p-2"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Subir Excel
      </button>

      {message && (
        <div className="mt-4 p-2 border rounded bg-gray-100">{message}</div>
      )}
    </div>
  )
}
