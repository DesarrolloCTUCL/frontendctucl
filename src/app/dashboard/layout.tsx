import { BreadcrumbDashboard } from "@/components/bread-crum-dashboard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (

		<SidebarProvider className="min-h-screen ">
			<AppSidebar />
			<SidebarInset >
				<main className="p-10 dark:bg-gray-950 bg-gray-100 ">
					<BreadcrumbDashboard />
					<div className="px-4 py-4 sm:px-6 lg:px-8 w-full">{children}</div>
				</main>
			</SidebarInset>
		</SidebarProvider>


	)

}