"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/mqtt-table"
import { Button } from "@/components/ui/button";

interface BusLine {
  id: number;
  number: number;
  name: string;
  description: string;
}

export default function BusLinePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: null as number | null,
    number: "",
    name: "",
    description: "",
  });

  const [lines, setLines] = useState<BusLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Cargar todas las líneas
  const fetchLines = async () => {
    try {
      const res = await fetch("https://ctucloja.com/api/bus-line");
      if (!res.ok) throw new Error("Error al cargar las líneas");
      const json = await res.json();
      setLines(json.data); // ⬅️ importante
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  useEffect(() => {
    fetchLines();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const method = formData.id ? "PATCH" : "POST";
      const url = formData.id
        ? `https://ctucloja.com/api/bus-line/${formData.id}`
        : `https://ctucloja.com/api/bus-line`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: Number(formData.number),
          name: formData.name,
          description: formData.description,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al guardar la línea");
      }

      setMessage(formData.id ? "✅ Línea actualizada" : "✅ Línea creada");
      setFormData({ id: null, number: "", name: "", description: "" });
      fetchLines();
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (line: BusLine) => {
    setFormData({
      id: line.id,
      number: String(line.number),
      name: line.name,
      description: line.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta línea?")) return;
    try {
      const res = await fetch(`https://ctucloja.com/api/bus-line/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      setMessage("✅ Línea eliminada");
      fetchLines();
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const columns: ColumnDef<BusLine, any>[] = [
    { header: "Número", accessorKey: "number" },
    { header: "Nombre", accessorKey: "name" },
    { header: "Descripción", accessorKey: "description" },
    {
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleEdit(row.original)}>Editar</Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(row.original.id)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">
        {formData.id ? "Editar Línea de Bus" : "Crear Línea de Bus"}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-8">
        <input
          type="number"
          name="number"
          placeholder="Número de línea"
          value={formData.number}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Nombre de la línea"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Guardando..." : formData.id ? "Actualizar Línea" : "Crear Línea"}
        </button>
      </form>

      {message && <div className="mb-4 p-2 text-center font-semibold">{message}</div>}

      <DataTable
        columns={columns}
        data={lines}
        getRowClassName={(row) => (row.id === formData.id ? "bg-gray-100" : "")}
      />
    </div>
  );
}
