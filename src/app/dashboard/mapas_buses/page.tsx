'use client'

import { useState } from 'react'
import MapBusTracker from './map'

export default function Page() {
  const [deviceId, setDeviceId] = useState('')

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-2 bg-gray-100 flex gap-2 items-center">
        <input
          type="text"
          placeholder="ID del bus"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          className="border p-1 rounded"
        />
      </div>
      {deviceId ? (
        <MapBusTracker deviceId={deviceId} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Ingresa el numero de bus  para ver en el mapa
        </div>
      )}
    </div>
  )
}
