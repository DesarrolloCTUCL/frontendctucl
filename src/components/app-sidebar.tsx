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
					url: "/dashboard/paradas",
				}
			],
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
