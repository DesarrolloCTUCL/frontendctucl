"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Cog, Volume2,Flag } from "lucide-react"
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import Swal from 'sweetalert2';
import { useSessionStore } from "@/store/session";
import React, { useState, useEffect } from "react";
import { toast } from "sonner"
import { DataTable } from "@/components/mqtt-table";
import { MqttApiQuery, MqttData } from "@/types/services.types";
import { MqttQuery,GetMqttHistory } from "@/services/MqttCommands";
import MqttButton from "@/components/mqtt-button";

export default function BusStop() {
    const user = useSessionStore((state) => state.user);
    const [mqttHistory, setMqttHistory] = useState<MqttData[]>([]);
    const [mqttTopic,setMqttTopic] = useState("");
    const [deviceOn,setDeviceOn] = useState(false);
    const MqttCommand =async(command:string,path:string)=>{
        const now = new Date();
        const fecha = now.toISOString().split('T')[0]; // Obtiene la fecha en formato YYYY-MM-DD
        const hora = now.toTimeString().split(' ')[0];
        const mqtt_data:MqttApiQuery = {
            user_id:user?.id||0,
            name: user?.name||"none",
            lastname:user?.lastname||"none",
            email:user?.email||"none",
            command:command,
            username:user?.username||"none",
            path:path,
            topic:mqttTopic === "" ? "desarrollo/commands" : mqttTopic
        }
        Swal.fire({
            title: "Comando Enviado Con Exito",
            icon: "success"
          });
        try {
            await MqttQuery(mqtt_data);
            const new_data:any = { ...mqtt_data, date:fecha, time:hora };
            setMqttHistory(prevHistory => [new_data, ...prevHistory]);
            
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "Algo Paso",
                text:error,
                icon: "error"
              });
        }
       
       

    }
    const handleChange = (value: string) => {
        setMqttTopic(value);
      };
    const connectDevice =()=>{
        if(mqttTopic!= ""){
            if(deviceOn){
                setDeviceOn(false);
            }else{
                setDeviceOn(true);
                toast("Event has been created", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    action: {
                      label: "Undo",
                      onClick: () => console.log("Undo"),
                    },
                  })
            }
        }else{
            setDeviceOn(false);
        }
    }
    useEffect(() => {
        // Llamar a GetMqttHistory cuando el componente se monte
        const fetchData = async () => {
          try {
            const data = await GetMqttHistory();
            setMqttHistory(data.data); // Guardar los datos en el estado
          } catch (err) {
           
            console.error("Error al obtener el historial MQTT:", err);
          } 
        };
    
        fetchData();
      }, []);

    return (
        <>



            <div className=" mx-auto p-6 bg-slate-50 shadow-lg rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="rounded-lg flex items-center justify-center md:col-span-2">
                    <Select value={mqttTopic} disabled={deviceOn} onValueChange={handleChange}>
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona la parada Automatizada" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desarrollo/commands">Consorcio Pruebas</SelectItem>
                            <SelectItem value="coliseo/commands">Coliseo SN</SelectItem>
                            <SelectItem value="paltas_sn/commands">Paltas SN</SelectItem>
                            <SelectItem value="jipiro_sn/commands">JIPIRO SN</SelectItem>
                            <SelectItem value="jipiro_ns/commands">JIPIRO NS</SelectItem>
                            <SelectItem value="valle_ns/commands">VALLE NS</SelectItem>
                            <SelectItem value="valle_sn/commands">VALLE SN</SelectItem>
                            <SelectItem value="podocarpus_sn/commands">PODOCARPUS SN</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    <div className=" text-white p-6 rounded-lg flex items-center justify-start">

                        <Button onClick={connectDevice}  >
                            {deviceOn?"DESCONECTARSE":"CONECTARSE"}
                        </Button>
                        
                    </div>
                    <div className=" text-black p-6 rounded-lg flex items-center justify-center"></div>
                    <div className=" rounded-lg flex items-center col-span-4 justify-start">
                        <h5 className="text-sm font-bold">
                            Comandos disponibles :
                        </h5>
                    </div>
                    <div className=" rounded-lg flex items-center col-span-4 justify-start">
                        <Label>
                            Controlar Audios
                        </Label>

                    </div>
                    <div className=" text-white rounded-lg flex items-center justify-center">
                        <MqttButton deviceOn={deviceOn} onClick={()=>{MqttCommand("warning_sound","audio")}} >
                                <Volume2 className="h-4 w-4" />
                            <span>Advertencia</span>
                        </MqttButton>
                    </div>
                    <div className=" text-white rounded-lg flex items-center justify-center">
                    <MqttButton deviceOn={deviceOn} onClick={()=>{MqttCommand("ctucl_slogan","audio")}} >
                                <Volume2 className="h-4 w-4" />
                            <span>Lema</span>
                        </MqttButton>
                    </div>
                    <div className=" text-white rounded-lg flex items-center justify-center">
                    <MqttButton deviceOn={deviceOn} onClick={()=>{MqttCommand("patience_sound","audio")}} >
                                <Volume2 className="h-4 w-4" />
                            <span>Indicaciones</span>
                        </MqttButton>
                    </div>
                    <div className=" rounded-lg flex items-center col-span-4 justify-start">
                        <Label>
                            Controlar Mecanismo
                        </Label>
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                    <MqttButton deviceOn={deviceOn} onClick={()=>{MqttCommand("generate_normal_pass","mecanism")}} activeColor="active:bg-blue-800"  hoverColor="hover:bg-blue-700" bgColor="bg-blue-600">
                                <Cog className="h-4 w-4" />
                            <span>Generar Pase</span>
       
                        </MqttButton>
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                        <MqttButton deviceOn={deviceOn} onClick={()=>{MqttCommand("generate_special_pass","mecanism")}} activeColor="active:bg-blue-800"  hoverColor="hover:bg-blue-700" bgColor="bg-blue-600">
                                <Cog className="h-4 w-4" />
                            <span>Generar Pase Especial</span>
                        </MqttButton>
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                        <MqttButton deviceOn={deviceOn} onClick={()=>{MqttCommand("test_lock","mecanism")}} activeColor="active:bg-blue-800"  hoverColor="hover:bg-blue-700" bgColor="bg-blue-600">
                                <Cog className="h-4 w-4" />
                            <span>Testear Cerradura</span>
                        </MqttButton>
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                    <MqttButton deviceOn={deviceOn} onClick={()=>{MqttCommand("test_arrow","mecanism")}} activeColor="active:bg-blue-800"  hoverColor="hover:bg-blue-700" bgColor="bg-blue-600">
                            <span>Testear Flecha</span>
                        </MqttButton>
                        
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                    <MqttButton deviceOn={deviceOn} onClick={()=>{MqttCommand("actuador_off","mecanism")}} activeColor="active:bg-blue-800"  hoverColor="hover:bg-blue-700" bgColor="bg-blue-600">                               
                                <Cog className="h-4 w-4" />
                            <span>Apagar Actuador</span>
                        </MqttButton>
                    </div>
                    <div className=" rounded-lg flex items-center col-span-4 justify-start">
                        <Label>
                            Eventos
                        </Label>
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                    <MqttButton deviceOn={deviceOn} onClick={()=>{MqttCommand("maintenance","events")}} activeColor="active:bg-amber-800"  hoverColor="hover:bg-amber-700" bgColor="bg-amber-600">                               
                                <Flag className="h-4 w-4" />
                            <span>Modo Mantenimiento</span>
                        </MqttButton>
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                    <MqttButton deviceOn={deviceOn} onClick={()=>{MqttCommand("restart","events")}} activeColor="active:bg-amber-800"  hoverColor="hover:bg-amber-700" bgColor="bg-amber-600">                               
                                <Flag className="h-4 w-4" />
                            <span>Reiniciar</span>
                        </MqttButton>
                    </div>
                    <div className=" rounded-lg flex items-center col-span-4 justify-start">
                            <DataTable columns={columns}  data={mqttHistory} />
                    </div>
                </div>
            </div>
        </>
    )

}



 const columns: ColumnDef<MqttData>[] = [
	{
	  accessorKey: "name",
	  header: "Nombre",
	},
	{
	  accessorKey: "lastname",
	  header: "Apellido",
	},
	{
		accessorKey: "command",
		header: "Commando",
	},
    {
		accessorKey: "topic",
		header: "Topico",
	},
	{
		accessorKey: "date",
		header: "Fecha",
	},
	{
		accessorKey:"time",
		header:"Hora"

	}
  ]