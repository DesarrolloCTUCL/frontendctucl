'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { fetchFromBackend } from '@/lib/api_backend'

export default function RechargePointForm() {
  const [formData, setFormData] = useState({
    business_name: 'Punto de Recarga Loja',
    name: '',
    ruc: '9999999999001',
    phone: '0999999999',
    email: 'info@consorcioloja.com',
    address: '',
    device_username: 'user_default',
    device_password: '123456',
    device_id: 'device001',
    contract: 'CONTRATO-BASE',
    lat: '',
    long: '',
    status: true,
  })

  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetchFromBackend('/recharge-point', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          lat: parseFloat(formData.lat) || 0,
          long: parseFloat(formData.long) || 0,
        }),
      })

      if (response.status === 'success') {
        setMessage('✅ Punto de recarga creado correctamente.')
        // limpiar solo los campos editables
        setFormData({
          business_name: 'Punto de Recarga Loja',
          name: '',
          ruc: '9999999999001',
          phone: '0999999999',
          email: 'info@consorcioloja.com',
          address: '',
          device_username: 'user_default',
          device_password: '123456',
          device_id: 'device001',
          contract: 'CONTRATO-BASE',
          lat: '',
          long: '',
          status: true,
        })
      } else {
        setMessage('❌ Error al crear el punto.')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('⚠️ Ocurrió un error al enviar los datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrar Punto de Recarga</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes('✅')
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <Input name="business_name" value={formData.business_name} onChange={handleChange} placeholder="Razón social" />
        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre responsable" required />
        <Input name="ruc" value={formData.ruc} onChange={handleChange} placeholder="RUC" />
        <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" />
        <Input name="email" value={formData.email} onChange={handleChange} placeholder="Correo electrónico" />
        <Input name="address" value={formData.address} onChange={handleChange} placeholder="Dirección" required />
        <Input name="device_username" value={formData.device_username} onChange={handleChange} placeholder="Usuario del dispositivo" />
        <Input name="device_password" value={formData.device_password} onChange={handleChange} placeholder="Contraseña del dispositivo" />
        <Input name="device_id" value={formData.device_id} onChange={handleChange} placeholder="ID del dispositivo" />
        <Input name="contract" value={formData.contract} onChange={handleChange} placeholder="Contrato" />
        <Input name="lat" value={formData.lat} onChange={handleChange} placeholder="Latitud" required />
        <Input name="long" value={formData.long} onChange={handleChange} placeholder="Longitud" required />

        <div className="col-span-2 flex items-center space-x-2">
          <input
            type="checkbox"
            name="status"
            checked={formData.status}
            onChange={handleChange}
          />
          <label>Activo</label>
        </div>

        <div className="col-span-2">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Guardando...' : 'Guardar Punto de Recarga'}
          </Button>
        </div>
      </form>
    </div>
  )
}
