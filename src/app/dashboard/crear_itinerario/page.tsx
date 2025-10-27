'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'

export default function ImportItinerariesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string>('')
  const [previewData, setPreviewData] = useState<any[][]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setMessage('')
    setPreviewData([])

    const reader = new FileReader()
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result
      if (!arrayBuffer) return

      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      // ✅ Tipado correcto para TypeScript
      const jsonData = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 }) as string[][]

      if (jsonData && jsonData.length > 0) {
        setPreviewData(jsonData.slice(0, 10)) // mostrar solo las primeras 10 filas
      } else {
        setMessage('⚠️ No se encontraron datos en el archivo Excel')
      }
    }

    reader.readAsArrayBuffer(selectedFile)
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
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Importar Itinerarios desde Excel</h1>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="block w-full border border-gray-300 rounded p-2"
      />

      {/* Tabla de previsualización */}
      {previewData.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2 text-gray-700">
            📋 Previsualización (primeras filas)
          </h2>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {previewData[0].map((header, index) => (
                    <th key={index} className="border px-3 py-1 font-semibold">
                      {header || `Col ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border px-3 py-1">
                        {cell ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {message && (
        <div className="mt-4 p-2 border rounded bg-gray-100">{message}</div>
      )}

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Subir Excel
      </button>
    </div>
  )
}
