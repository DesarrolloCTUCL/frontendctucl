"use client"
import * as React from "react"
import {
	Bot,
	Users2,
	Store,
	Smartphone,
	Bus,
	Settings,
	MonitorCog,
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
			icon: Store,
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
			],
		},

		,
		{
			title: "Puntos de recarga",
			url: "#",
			icon: Smartphone,
			isActive: false,
			items: [
				{
					title: "Listado de recargadores",
					url: "/dashboard/puntos_recarga",
				},
				{
					title: "Mapa de recargadores",
					url: "/dashboard/recargadores_mapa",
				},
				{
					title: "Agregar recargador",
					url: "/dashboard/pcontrol",
				},
			],
		},

		{	title: "Monitoreo",
			url: "#",
			icon: Bus,
			isActive: false,
			items: [
				{
					title: "Despacho general",
					url: "/dashboard/despacho_general",
					items: [
					  {
						title: "Papeleta Control",
						url: "/dashboard/despacho_general/papeleta_control",
						title2: "Mapa",
						url2: "/dashboard/despacho_general/controlmap",
					  }
					]
				  },
				{
					title: "Despacho por ruta",
					url: "/dashboard/despacho_ruta",
				},
		
				{
					title: "Mapa buses",
					url: "/dashboard/mapas_buses",
				},
				{
					title: "Itinerarios",
					url: "/dashboard/itinerarios",
				},
	
			]
		},
		{	title: "Control de flota",
			url: "#",
			icon: MonitorCog,
			isActive: false,
			items: [
				{
					title: "Crear itinerario",
					url: "/dashboard/despacho_general",
				},
	
				{
					title: "Asignar itinerario",
					url: "/dashboard/asignar_itinerario",
				},

				{
					title: "Franjas Horarias",
					url: "/dashboard/franjas_horarias",
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
