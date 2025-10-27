'use client'

import { useEffect, useState, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/mqtt-table'

type Shift = {
    id: number
    shiftcode: string
    route: string
    chainpc: string
    times: string
}

type ControlPoint = {
    id: number
    name: string
}

type ChainTime = {
    point: string
    time: string
}

export default function ShiftPage() {
    const [data, setData] = useState<Shift[]>([])
    const [controlPoints, setControlPoints] = useState<ControlPoint[]>([])
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
    const [chainData, setChainData] = useState<ChainTime[]>([])
    const [totalTime, setTotalTime] = useState<string>('')

    const [editIndex, setEditIndex] = useState<number | null>(null) // fila en edición
    const [editedTimes, setEditedTimes] = useState<string[]>([]) // tiempos editados

    // 🔹 Cargar shifts
    useEffect(() => {
        fetch('https://ctucloja.com/api/shift')
            .then((res) => res.json())
            .then((json) => json.status === 'success' && setData(json.data))
            .catch(console.error)
    }, [])

    // 🔹 Cargar puntos de control
    useEffect(() => {
        fetch('https://ctucloja.com/api/bus-station/control-points')
            .then((res) => res.json())
            .then((json) => json.status === 'success' && json.data?.data && setControlPoints(json.data.data))
            .catch(console.error)
    }, [])

    // 🔹 Agrupar turnos por grupo (L1, L2, etc.)
    const groupedShifts = useMemo(() => {
        const groups: Record<string, Shift[]> = {}
        data.forEach((shift) => {
            const key = shift.shiftcode.match(/^L\d+/)?.[0] || shift.shiftcode
            if (!groups[key]) groups[key] = []
            groups[key].push(shift)
        })
        return groups
    }, [data])

    // 🔹 Calcular tabla de tiempos
    useEffect(() => {
        if (!selectedShift || controlPoints.length === 0) return

        const chainList = selectedShift.chainpc.split(',').map((p) => p.trim())
        const timeList = selectedShift.times.split(',').map((t) => t.trim())

        const formatted: ChainTime[] = chainList.map((id, i) => {
            const point = controlPoints.find((cp) => cp.id === Number(id))
            return { point: point ? point.name : `Punto ${id}`, time: timeList[i] || '0' }
        })

        setChainData(formatted)
        setEditedTimes(timeList)
        calcularTotal(timeList)
    }, [selectedShift, controlPoints])

    const calcularTotal = (timeList: string[]) => {
        let totalMinutes = 0
        for (const t of timeList) {
            if (!t) continue
            const [minStr, decStr] = t.split('.')
            const minutes = parseInt(minStr) || 0
            const decimal = decStr ? parseInt(decStr) : 0
            const extraMinutes = decimal === 3 ? 0.5 : decimal / 10
            totalMinutes += minutes + extraMinutes
        }
        const totalMins = Math.floor(totalMinutes)
        const totalSecs = Math.round((totalMinutes - totalMins) * 60)
        setTotalTime(`${totalMins} min ${totalSecs} s`)
    }

    const handleEdit = (index: number) => setEditIndex(index)

    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...editedTimes]
        newTimes[index] = value
        setEditedTimes(newTimes)
        calcularTotal(newTimes)
    }

    const handleSave = async () => {
        if (!selectedShift) return
        try {
            const response = await fetch(`https://ctucloja.com/api/shift/${selectedShift.id}/times`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ times: editedTimes.join(',') }),
            })
            if (response.ok) {
                alert('✅ Tiempos actualizados correctamente.')
                setEditIndex(null)
                setSelectedShift({
                    ...selectedShift,
                    times: editedTimes.join(','),
                })
            } else {
                const errorText = await response.text()
                console.error('Error al guardar:', errorText)
                alert('❌ Error al guardar los cambios.')
            }
        } catch (err) {
            console.error('Error en la solicitud:', err)
            alert('❌ Error de red o servidor.')
        }
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Itinerarios por Ruta</h1>

            {/* 🔹 Botones por grupo */}
            <div className="flex flex-wrap gap-2 mb-2">
                {Object.keys(groupedShifts).map((groupKey) => (
                    <button
                        key={groupKey}
                        onClick={() => {
                            setSelectedGroup(groupKey)
                            setSelectedShift(null)
                            setChainData([])
                            setTotalTime('')
                        }}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold border ${selectedGroup === groupKey
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                            }`}
                    >
                        {groupKey}
                    </button>
                ))}
            </div>

            {/* 🔹 Turnos del grupo */}
            {selectedGroup && groupedShifts[selectedGroup] && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {groupedShifts[selectedGroup].map((shift) => (
                        <button
                            key={shift.id}
                            onClick={() => setSelectedShift(shift)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium border ${selectedShift?.id === shift.id
                                    ? 'bg-green-600 text-white border-green-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            {shift.shiftcode}
                        </button>
                    ))}
                </div>
            )}

            {/* 🔹 Tabla editable */}
            {selectedShift ? (
                <>
                    <h2 className="text-xl font-semibold mb-2">
                        Ruta: {selectedShift.route.toUpperCase()} — Turno: {selectedShift.shiftcode}
                    </h2>

                    <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="px-4 py-2 w-12 text-center">#</th>
                                    <th className="px-4 py-2">Punto de Control</th>
                                    <th className="px-4 py-2">Tiempo (min)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chainData.map((row, index) => (
                                    <tr
                                        key={index}
                                        onDoubleClick={() => handleEdit(index)}
                                        className="border-t hover:bg-gray-50 cursor-pointer"
                                    >
                                        {/* 🔹 Columna enumerada */}
                                        <td className="px-4 py-2 text-center font-medium">{index + 1}</td>

                                        <td className="px-4 py-2">{row.point}</td>
                                        <td className="px-4 py-2">
                                            {editIndex === index ? (
                                                <input
                                                    type="text"
                                                    value={editedTimes[index]}
                                                    onChange={(e) => handleTimeChange(index, e.target.value)}
                                                    onBlur={() => setEditIndex(null)}
                                                    className="border rounded px-2 py-1 w-20 text-center"
                                                    autoFocus
                                                />
                                            ) : (
                                                editedTimes[index]
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* 🔹 Fila de total */}
                        <div className="flex justify-between px-4 py-2 bg-gray-100 border-t font-semibold">
                            <span>Total recorrido</span>
                            <span>{totalTime}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Guardar cambios
                    </button>
                </>
            ) : selectedGroup ? (
                <p className="text-gray-500">Selecciona un turno del grupo {selectedGroup}.</p>
            ) : (
                <p className="text-gray-500">Selecciona una ruta (L1, L2, etc.) para comenzar.</p>
            )}
        </div>
    )
}
