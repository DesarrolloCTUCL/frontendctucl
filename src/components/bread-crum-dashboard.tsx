'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "./ui/sidebar";

// Función para capitalizar y reemplazar guiones bajos o medios
function formatSegment(segment: string) {
  return segment
    .replace(/[-_]/g, " ") // Reemplaza - o _ por espacio
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitaliza cada palabra
}

export function BreadcrumbDashboard() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(segment => segment);

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center">
        <SidebarTrigger />

        {/* Enlace a Inicio */}
        <BreadcrumbItem key="home">
          <BreadcrumbLink>
            <Link href="/">Inicio</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <div className="flex items-center" key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formatSegment(decodeURIComponent(segment))}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink>
                    <Link href={href}>{formatSegment(decodeURIComponent(segment))}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
