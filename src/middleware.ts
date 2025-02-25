import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    // Opción 2: Obtener el token del header `Authorization`
    const authHeader = req.headers.get('Authorization');
    const tokenFromHeader = authHeader?.split(' ')[1]; // Extraer el token de "Bearer <token>"
    if (!token && !tokenFromHeader) {
        console.log("No se pudo obtener el token");
        return NextResponse.redirect(new URL("/login", req.url)); // Redirigir al login
    }

  return NextResponse.next(); // Permitir acceso si hay token
}

// Aplicar el middleware solo a ciertas rutas protegidas
export const config = {
  matcher: ["/dashboard/:path*", "/perfil/:path*"], // Agrega más rutas si necesitas
  runtime: "nodejs",
};
