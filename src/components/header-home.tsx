import { Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeaderHome() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo y nombre */}
        <Link href="/" className="flex items-center gap-2">
          <Bus className="h-6 w-6" />
          <span className="text-xl font-bold">CTUCL</span>
        </Link>

        {/* Botones a la derecha */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button>Iniciar Sesión</Button>
          </Link>

          <Link
            href="https://www.consorcioloja.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">Pagina Web</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}