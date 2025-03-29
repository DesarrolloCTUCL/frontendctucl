import { BreadcrumbDashboard } from "@/components/bread-crum-dashboard";
import { SidebarProvider} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		
		<SidebarProvider className="min-h-screen  dark:bg-gray-950 bg-gray-100 p-10">
				<AppSidebar />
				<main>
						<BreadcrumbDashboard />
					<div className="px-4 py-4 sm:px-6 lg:px-8 w-full">{children}</div>
				</main>
		</SidebarProvider>
		

	)

}