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


const rolePermissions: Record<string, { [section: string]: string[] }> = {
	admin: {
	  Usuarios: ["Personal", "Socios - Buses", "Conductores"],
	  Paradas: ["Automatizadas", "Generales"],
	  "Puntos de recarga": ["Listado de recargadores", "Mapa de recargadores", "Agregar recargador"],
	  Monitoreo: ["Despacho general", "Despacho por ruta", "Mapa buses", "Itinerarios"],
	  "Control de flota": ["Crear itinerario","Editar itinerario","Asignar itinerario","Franjas Horarias","Crear-Editar Líneas"]
	},
	monitoreo: {
	  Monitoreo: ["Despacho general", "Despacho por ruta", "Mapa buses", "Itinerarios"]
	},
	sir: {
	  "Puntos de recarga": ["Listado de recargadores", "Mapa de recargadores", "Agregar recargador"],
	  Monitoreo: ["Despacho general", "Despacho por ruta", "Mapa buses", "Itinerarios"]
	},
	sae: {
	  "Puntos de recarga": ["Listado de recargadores", "Mapa de recargadores", "Agregar recargador"],
	  Monitoreo: ["Despacho general", "Despacho por ruta", "Mapa buses", "Itinerarios"]
	},
	secretaria: {
	  "Puntos de recarga": ["Listado de recargadores", "Mapa de recargadores", "Agregar recargador"],
	  Monitoreo: ["Despacho general", "Despacho por ruta", "Mapa buses", "Itinerarios"]
	},
	taller: {
	  "Puntos de recarga": ["Listado de recargadores", "Mapa de recargadores", "Agregar recargador"],
	  Monitoreo: ["Despacho general", "Despacho por ruta", "Mapa buses", "Itinerarios"]
	},
	gerencia: {
	  "Puntos de recarga": ["Listado de recargadores", "Mapa de recargadores", "Agregar recargador"],
	  Monitoreo: ["Despacho general", "Despacho por ruta", "Mapa buses", "Itinerarios"]
	},
	credencializacion: {
	  "Puntos de recarga": ["Listado de recargadores", "Mapa de recargadores", "Agregar recargador"],
	  Monitoreo: ["Despacho general", "Despacho por ruta", "Mapa buses", "Itinerarios"]
	},
	socio: {
	  "Puntos de recarga": ["Listado de recargadores", "Mapa de recargadores", "Agregar recargador"],
	  Monitoreo: ["Despacho general", "Despacho por ruta", "Mapa buses", "Itinerarios"]
	},
	viewer: {
	  "Puntos de recarga": ["Listado de recargadores", "Mapa de recargadores"],
	  Monitoreo: ["Despacho general", "Mapa buses"]
	},
	usuario:{}
  };
  
  


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
					title: "Personal",
					url: "/dashboard/usuarios",
				},
				{
					title: "Socios - Buses",
					url: "/dashboard/buses-socios",
				},
				{
					title: "Conductores",
					url: "/dashboard/usuarios",
				},
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
					url: "/dashboard/crear_itinerario",
				},
	
				{
					title: "Editar itinerario",
					url: "/dashboard/editar_itinerario",
				},
				{
					title: "Asignar itinerario",
					url: "/dashboard/asignar_itinerario",
				},

				{
					title: "Franjas Horarias",
					url: "/dashboard/franjas_horarias",
				},
				,

				{
					title: "Crear-Editar Líneas",
					url: "/dashboard/crear_editar_linea",
				},
			]
		}
	],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const [role, setRole] = React.useState<string | null>(null);
  
	React.useEffect(() => {
	  const r = localStorage.getItem("userRole");
	  setRole(r);
	}, []);
  
	const filteredNavMain = React.useMemo(() => {
	  if (!role) return [];
	  const permissions = rolePermissions[role] || {};
  
	  return data.navMain
		.filter(section => permissions[section.title])
		.map(section => ({
		  ...section,
		  items: section.items.filter(item => permissions[section.title].includes(item.title))
		}));
	}, [role]);
  
	return (
	  <Sidebar collapsible="icon" {...props}>
		<SidebarHeader>
		  <TeamSwitcher />
		</SidebarHeader>
		<SidebarContent>
		  <NavMain items={filteredNavMain} />
		</SidebarContent>
		<SidebarFooter>
		  <NavUser />
		</SidebarFooter>
		<SidebarRail />
	  </Sidebar>
	);
  }
  