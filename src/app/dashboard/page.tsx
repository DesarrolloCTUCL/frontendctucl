"use client";

import * as React from "react";
import Link from "next/link";
import { Bot, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/store/session";

export default function HomePage() {
  const user = useSessionStore((state) => state.user);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-10 space-y-6">
        <h1 className="text-2xl font-bold">
          Bienvenido al sistema de control del Consorcio de Transportistas Urbanos Ciudad de Loja
        </h1>

        {user ? (
          <div className="flex items-center gap-6 mt-4">
            {/* Imagen del usuario */}
            {user.image && user.image !== "" ? (
              <img
                src={user.image}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                Sin foto
              </div>
            )}

            {/* Información del usuario */}
            <div className="space-y-2">
              <p className="text-lg">
                Usuario: <strong>{user.name || "Sin nombre"}</strong>
              </p>
              <p className="text-lg">
                Rol: <strong>{user.accountType?.toUpperCase() || "SIN ROL"}</strong>
              </p>
              <p className="text-lg">
                Correo: <strong>{user.email}</strong>
              </p>
            </div>
          </div>
        ) : (
          <p className="text-lg text-red-600">
            No hay sesión activa. Por favor inicia sesión.
          </p>
        )}
      </main>
    </div>
  );
}
