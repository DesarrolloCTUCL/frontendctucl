import { MqttApiQuery } from "@/types/services.types";
import { getTokenFromCookie } from "@/lib/auth";
import axios from "axios"


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export async function MqttQuery(params:MqttApiQuery) {
    try {
      const token = getTokenFromCookie();
      if (!token) {
        throw new Error("No token found in cookies");
      }
      const response = await axios.post(
        `${API_URL}/api/bus-station`,
       params,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  export async function GetMqttHistory() {
    try {
      // Obtener el token de la cookie
      const token = getTokenFromCookie();
      
      // Si no hay token, lanzar un error
      if (!token) {
        throw new Error("No token found in cookies");
      }
  
      // Realizar la solicitud con el token en los encabezados
      const response = await axios.get(
        `${API_URL}/api/bus-station`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token como Bearer en los encabezados
          },
          withCredentials: true, // Asegurar que las cookies se envíen si es necesario
        }
      );
  
      console.log("Respuesta del servidor:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error en GetMqttHistory:", error);
      throw error;
    }
  }