import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Obtener el token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirigir si no está autenticado
  }

  return NextResponse.next(); // Permitir acceso si hay token
}

// Aplicar el middleware solo a ciertas rutas protegidas
export const config = {
  matcher: ["/dashboard/:path*", "/perfil/:path*"], // Agrega más rutas si necesitas
};
