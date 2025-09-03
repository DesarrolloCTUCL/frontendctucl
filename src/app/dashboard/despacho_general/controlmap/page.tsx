'use client'

import { Suspense } from 'react'
import ControlMapContent from './controlMapContent'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Cargando mapa...</div>}>
      <ControlMapContent />
    </Suspense>
  )
}
