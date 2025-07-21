import { NextRequest, NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

// export async function middleware(req: NextRequest) {
// //   const cookieStore = cookies();  // Obtener el acceso a las cookies
// //   const token = (await cookieStore).get('auth_token');  // Obtener el token de la cookie

// //   if (!token) {
// //     console.log("No se pudo obtener el token");
// //     return NextResponse.redirect(new URL("/login", req.url));  // Redirigir al login si no se encuentra el token
// //   }

// //   return NextResponse.next();  // Si el token existe, continuar con la solicitud
//  }

// // Configurar el matcher para que se aplique a todas las rutas protegidas
// export const config = {
//   matcher: ['/dashboard/:path*', '/perfil/:path*'],  // Rutas protegidas
//   runtime: 'nodejs',
// };

export default function middleware(request: NextRequest) {
  return NextResponse.next()
}
