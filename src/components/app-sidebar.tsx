"use client"
import * as React from "react"
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

// This is sample data.
const data = {
	user: {
		name: "shadcn",
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
				{
					title: "Administradores",
					url: "/dashboard/usuarios",
				},
				{
					title: "Buses",
					url: "/dashboard/buses",
				}
			],
		},
		{
			title: "Paradas",
			url: "#",
			icon: Bot,
			isActive: false,
			items: [
				{
					title: "Automatizadas",
					url: "/dashboard/paradas_automatizadas",
				},
				{
					title: "Generales",
					url: "/dashboard/paradas",
				},
				{
					title: "Puntos de control",
					url: "/dashboard/pcontrol",
				},
			],
		},

		,
		{
			title: "Puntos de recarga",
			url: "#",
			icon: Bot,
			isActive: false,
			items: [
				{
					title: "Listado de recargadores",
					url: "/dashboard/puntos_recarga",
				},
				{
					title: "Mapa de recargadores",
					url: "/dashboard/paradas",
				},
				{
					title: "Agregar recargador",
					url: "/dashboard/pcontrol",
				},
			],
		},

		{	title: "Control de flota",
			url: "#",
			icon: Bot,
			isActive: false,
			items: [
				{
					title: "Despacho general",
					url: "/dashboard/despacho_general",
				},
				{
					title: "Despacho por ruta",
					url: "/dashboard/despacho_ruta",
				},
				{
					title: "Despacho por bus",
					url: "/dashboard/despacho_bus",
				},
				{
					title: "Mapa buses",
					url: "/dashboard/mapa_buses",
				},
				{
					title: "Itinerarios",
					url: "/dashboard/itinerarios",
				},
				{
					title: "Asignación rutas",
					url: "/dashboard/asignacion_rutas",
				},
			]
		}
	],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser/>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
