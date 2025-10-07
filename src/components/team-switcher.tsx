"use client"

import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          {/* Imagen cuadrada (avatar o logo) */}
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden bg-sidebar-primary">
            <img
              src="/logoconsorcio.jpg"  // 👉 Cambia esto a la ruta de tu imagen
              alt="Logo CTUCL"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Nombre y descripción */}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">CTUCL</span>
            <span className="truncate text-xs">Página Web</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
