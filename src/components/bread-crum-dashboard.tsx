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

export function BreadcrumbDashboard() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(segment => segment);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <SidebarTrigger />
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          return (
            < div className="flex flex-row justify-center items-center align-middle" key={href}>
              <BreadcrumbSeparator key={`sep-${index}`} />
              <BreadcrumbItem key={href}>
                {isLast ? (
                  <BreadcrumbPage>{decodeURIComponent(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink>
                    <Link href={href}>{decodeURIComponent(segment)}</Link>
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
