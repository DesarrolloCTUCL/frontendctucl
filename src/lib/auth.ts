import axios from "axios";
import Cookies from "js-cookie"; // Librería para manejar cookies en el navegador

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function userAuth() {
  try {
    // Obtener el token de la cookie
    const token = Cookies.get("token");

    if (!token) {
      throw new Error("No se encontró el token en las cookies.");
    }

    // Configuración de la petición
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        username: "johndoe",
        password: "securepassword123",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token en el header
        },
        withCredentials: true, // Para asegurar que las cookies se envíen en la petición
      }
    );

    console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en userAuth:", error);
    throw error;
  }
}
