import SideBar from "@/components/side-bar";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){

    return(
      <html lang="es">
      <body>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
          <SideBar />
          <main className="lg:pl-64">
            <div className="px-4 py-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
    )

}