"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // Redirige a la página deseada
  }, []);

  return <p>Redirigiendo...</p>; // Muestra un mensaje antes de redirigir
}
