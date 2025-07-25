'use client'

import * as React from "react"
import Link from "next/link"
import {
  Bot,
  Users2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const data = {
  user: {
    name: "Cristian",
    role: "Administrador", // <- puedes cambiarlo dinámicamente si quieres
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Usuarios",
      url: "#",
      icon: Users2,
      isActive: false,
      items: [
        { title: "Administradores", url: "/dashboard/usuarios" },
        { title: "Buses", url: "/dashboard/buses" }
      ],
    },
    {
      title: "Paradas",
      url: "#",
      icon: Bot,
      isActive: false,
      items: [
        { title: "Automatizadas", url: "/dashboard/paradas_automatizadas" },
        { title: "Generales", url: "/dashboard/paradas" },
        { title: "Puntos de control", url: "/dashboard/pcontrol" },
      ],
    },
    {
      title: "Puntos de recarga",
      url: "#",
      icon: Bot,
      isActive: false,
      items: [
        { title: "Listado de recargadores", url: "/dashboard/puntos_recarga" },
        { title: "Mapa de recargadores", url: "/dashboard/paradas" },
        { title: "Agregar recargador", url: "/dashboard/pcontrol" },
      ],
    },
    {
      title: "Control de flota",
      url: "#",
      icon: Bot,
      isActive: false,
      items: [
        { title: "Despacho general", url: "/dashboard/despacho_general" },
        { title: "Despacho por ruta", url: "/dashboard/despacho_ruta" },
        { title: "Despacho por bus", url: "/dashboard/despacho_bus" },
        { title: "Mapa buses", url: "/dashboard/mapa_buses" },
        { title: "Itinerarios", url: "/dashboard/itinerarios" },
        { title: "Asignación rutas", url: "/dashboard/asignacion_rutas" },
      ],
    }
  ],
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-10 space-y-6">
        <h1 className="text-2xl font-bold">Bienvenidos al sistema de control del Consorcio de Transportistas Urbanos Ciudad de Loja</h1>
        <p className="text-lg">Usuario: <strong>{data.user.name}</strong></p>
        <p className="text-lg">Rol: <strong>{data.user.role}</strong></p>

        <div className="mt-6 space-x-4">
          <Link href="/dashboard/usuarios">
            <Button>Administradores</Button>
          </Link>
          <Link href="/dashboard/buses">
            <Button>Buses</Button>
          </Link>
          <Link href="/dashboard/paradas">
            <Button>Paradas</Button>
          </Link>
          <Link href="/dashboard/puntos_recarga">
            <Button>Puntos de Recarga</Button>
          </Link>
          <Link href="/dashboard/despacho_general">
            <Button>Despacho General</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}


