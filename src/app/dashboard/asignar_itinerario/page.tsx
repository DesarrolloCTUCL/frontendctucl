"use client";

import { useState, useEffect } from "react";

interface BusLine {
  id: number;
  name: string;
  number: number;
}

interface Itinerary {
  key: string;
  data: any; // puedes cambiar según lo que tengas
}

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

  const [lines, setLines] = useState<BusLine[]>([]);
  const [allItineraries, setAllItineraries] = useState<string[]>([]);
  const [filteredItineraries, setFilteredItineraries] = useState<string[]>([]);
  const [prefixFilter, setPrefixFilter] = useState<string[]>([]); // ahora es un array para checkboxes
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Cargar líneas de bus
  useEffect(() => {
    const fetchLines = async () => {
      try {
        const res = await fetch("https://ctucloja.com/api/bus-line");
        if (!res.ok) throw new Error("Error al cargar las líneas");
        const json = await res.json();
        setLines(json.data);
      } catch (err: any) {
        setMessage(`❌ ${err.message}`);
      }
    };
    fetchLines();
  }, []);

  // Cargar itinerarios al seleccionar línea
  useEffect(() => {
    const fetchItineraries = async () => {
      if (!formData.line_id) {
        setAllItineraries([]);
        setFilteredItineraries([]);
        setFormData(prev => ({ ...prev, itinerary: "" }));
        return;
      }

      try {
        const selectedLine = lines.find(line => line.number === Number(formData.line_id));
        if (!selectedLine) return;

        const lineNumber = "L" + selectedLine.number;
        const endpoint = `https://ctucloja.com/api/itineraries/line/${lineNumber}`;
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Error al cargar itinerarios");

        const json = await res.json();
        const keys = Object.keys(json.data || {});

        setAllItineraries(keys);
        setFilteredItineraries(keys);
        setFormData(prev => ({ ...prev, itinerary: "" }));
      } catch (err: any) {
        console.error(err);
        setMessage(`❌ ${err.message}`);
        setAllItineraries([]);
        setFilteredItineraries([]);
      }
    };

    fetchItineraries();
  }, [formData.line_id, lines]);

  // Filtrar itinerarios según prefijos seleccionados
  useEffect(() => {
    if (prefixFilter.length === 0) {
      setFilteredItineraries(allItineraries);
    } else {
      setFilteredItineraries(
        allItineraries.filter(itinerary =>
          prefixFilter.some(prefix => itinerary.startsWith(prefix))
        )
      );
    }
    setFormData(prev => ({ ...prev, itinerary: "" })); // resetear itinerario al cambiar filtro
  }, [prefixFilter, allItineraries]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrefixChange = (prefix: string) => {
    setPrefixFilter(prev =>
      prev.includes(prefix)
        ? prev.filter(p => p !== prefix)
        : [...prev, prefix]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("https://ctucloja.com/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          vehicle_id: Number(formData.vehicle_id),
          line_id: Number(formData.line_id),
          user_id: Number(formData.user_id),
          driver: Number(formData.driver),
          date: formData.date,
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
      setAllItineraries([]);
      setFilteredItineraries([]);
      setPrefixFilter([]);
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

        {/* Checkboxes de prefijos */}
        <div className="flex gap-4">
          {["H", "FH", "FD", "V"].map(prefix => (
            <label key={prefix} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={prefixFilter.includes(prefix)}
                onChange={() => handlePrefixChange(prefix)}
              />
              {prefix}
            </label>
          ))}
        </div>

        {/* Select de líneas */}
        <select
          name="line_id"
          value={formData.line_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Selecciona una línea</option>
          {[...lines]
            .sort((a, b) => a.number - b.number)
            .map((line) => (
              <option key={line.id} value={line.number}>
                {line.number} - {line.name}
              </option>
            ))}
        </select>



        {/* Select de itinerarios */}
        <select
          name="itinerary"
          value={formData.itinerary}
          onChange={handleChange}
          className="border p-2 rounded"
          required
          disabled={!filteredItineraries.length}
        >
          <option value="">Selecciona un itinerario</option>
          {filteredItineraries.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

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
        <div className="mt-4 p-2 text-center font-semibold">{message}</div>
      )}
    </div>
  );
}
