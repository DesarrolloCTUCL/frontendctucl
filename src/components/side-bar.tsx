"use client"
import { useSessionStore } from "@/store/session";
import * as React from "react"
import Link from "next/link"
import { Bot,User } from "lucide-react";
import { usePathname } from "next/navigation"
import {
	Cog6ToothIcon,
} from "@heroicons/react/24/outline"

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"

// const navigation = [
// 	{ name: "Dashboard", href: "/dashboard", icon: HomeIcon, active: true },
// 	{ name: "Puntos de Control", href: "/dashboard/charging_points", icon: MapPinIcon, active: false },
// 	{ name: "Paradas", href: "/dashboard/bus_stop", icon: Bot, active: false },
// ]
const navigation = [
	{ name: "Paradas Automatizadas", href: "/dashboard/bus_stop", icon: Bot, active: false },
	{ name: "Usuarios", href: "/dashboard/users", icon: User, active: false },
]

export default function Sidebar() {
	const [isOpen, setIsOpen] = React.useState(true)
	const user = useSessionStore((state) => state.user);
	const pathname = usePathname()

	return (
		<>
			{/* Botón móvil */}

			{/* Overlay para móvil */}
			{isOpen && <div className="fixed inset-0 z-30 bg-gray-800/50 lg:hidden" onClick={() => setIsOpen(false)} />}

			{/* Sidebar */}
			<aside
				className={`${isOpen ? "translate-x-0" : "-translate-x-full"
					} fixed inset-y-0 left-0 z-30 w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0`}
			>
				{/* Header */}
				<div className="border-b border-gray-200 px-4 py-6 dark:border-gray-800">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-800">
							<span className="text-lg font-semibold text-white">A</span>
						</div>
						<div>
							<h2 className="font-semibold text-gray-900 dark:text-white">Ctucl Manager</h2>
							<p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="space-y-1 px-3 py-6">
					{navigation.map((item) => {
						const isActive = pathname === item.href
						return (
							<Link
								key={item.name}
								href={item.href}
								className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
									? "bg-slate-800 text-slate-200 dark:bg-gray-800 dark:text-white"
									: "text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white"
									}`}
							>
								<item.icon className="h-5 w-5 flex-shrink-0" />
								<span>{item.name}</span>
							</Link>
						)
					})}
				</nav>

				{/* Footer */}
				<div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarImage src="https://github.com/shadcn.png" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div className="flex-1 truncate">
							<h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">{user?.name} {user?.lastname}</h3>
							<p className="truncate text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
						</div>
						<button
							type="button"
							className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
						>
							<Cog6ToothIcon className="h-5 w-5" />
						</button>
					</div>
				</div>
			</aside>
		</>
	)
}

