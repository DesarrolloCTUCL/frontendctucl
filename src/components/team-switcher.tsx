"use client"

import * as React from "react"
import Link from "next/link"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="https://www.consorcioloja.com" target="_blank" rel="noopener noreferrer">
          <SidebarMenuButton
            size="lg"
            className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            {/* Imagen cuadrada (avatar o logo) */}
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden bg-sidebar-primary">
              <img
                src="/logoconsorcio.jpg"
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
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
