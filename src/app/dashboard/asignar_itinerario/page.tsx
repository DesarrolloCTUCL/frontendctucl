"use client";

import { useState } from "react";

export default function SchedulePage() {
  const [formData, setFormData] = useState({
    vehicle_id: "",
    date: "",
    itinerary: "",
    line_id: "",
    user_id: "",
    driver: "",
    observations: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("https://ctucloja.com/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          vehicle_id: Number(formData.vehicle_id),
          line_id: Number(formData.line_id),
          user_id: Number(formData.user_id),
          driver: Number(formData.driver),
          date: formData.date
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al crear el despacho");
      }

      setMessage("✅ Despacho asignado correctamente");
      setFormData({
        vehicle_id: "",
        date: "",
        itinerary: "",
        line_id: "",
        user_id: "",
        driver: "",
        observations: "",
      });
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Asignar Despacho</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="number"
          name="vehicle_id"
          placeholder="ID del Vehículo"
          value={formData.vehicle_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="itinerary"
          placeholder="Itinerario"
          value={formData.itinerary}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="line_id"
          placeholder="ID de la Línea"
          value={formData.line_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="user_id"
          placeholder="ID del Usuario"
          value={formData.user_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="driver"
          placeholder="ID del Conductor"
          value={formData.driver}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="observations"
          placeholder="Observaciones"
          value={formData.observations}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Guardando..." : "Asignar Despacho"}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-2 text-center font-semibold">
          {message}
        </div>
      )}
    </div>
  );
}
