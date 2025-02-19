import { userAuht } from "@/types/user.types";
import axios from "axios";
import Cookies from "js-cookie";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function userAuthLogin(user: userAuht) {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        email: user.email,
        password: user.password,
        username: user.username,
      },
      {
        withCredentials: true, // 👈 Permite enviar y recibir cookies
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}


export async function getChargingPoints(user:userAuht) {
  try {

    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No se encontró el token en las cookies.");
    }
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        username:user.username,
        password:user.password
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
