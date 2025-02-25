import { MqttApiQuery } from "@/types/services.types";
import axios from "axios"


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export async function MqttQuery(params:MqttApiQuery) {
    try {
  
     
      const response = await axios.post(
        `${API_URL}/api/bus-station`,
       params,
        {
          headers: {
            "Content-Type": "application/json",
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
  
     
      const response = await axios.get(
        `${API_URL}/api/bus-station`,
        {
          headers: {
            "Content-Type": "application/json",
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