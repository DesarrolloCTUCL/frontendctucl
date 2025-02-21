import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Cog, Volume2 } from "lucide-react"
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { MqttData } from "@/types/user.types";
   
export const columns: ColumnDef<MqttData>[] = [
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
		accessorKey: "date",
		header: "Fecha",
	},
	{
		accessorKey:"hour",
		header:"Hora"

	}
  ]
import { DataTable } from "@/components/mqtt-table";
export default function BusStop() {


    return (
        <>



            <div className=" mx-auto p-6 bg-slate-50 shadow-lg rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="rounded-lg flex items-center justify-center md:col-span-2">
                        <Select defaultValue="coliseo">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona la parada Automatizada" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="coliseo">Coliseo SN</SelectItem>
                                <SelectItem value="paltas_sn">Paltas SN</SelectItem>
                                <SelectItem value="valle_sn">Valle SN</SelectItem>
                                <SelectItem value="valle_ns">Valle NS</SelectItem>
                                <SelectItem value="jipiro_sn">JIPIRO SN</SelectItem>
                                <SelectItem value="jipiro_ns">JIPIRO NS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className=" text-white p-6 rounded-lg flex items-center justify-start">

                        <Button>
                            CONECTAR
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
                        <button className="w-full inline-flex items-center gap-2 rounded-md bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 active:bg-gray-950 active:text-gray-200">
                                <Volume2 className="h-4 w-4" />
                            <span>Advertencia</span>
                        </button>
                    </div>
                    <div className=" text-white rounded-lg flex items-center justify-center">
                        <button className="w-full inline-flex items-center gap-2 rounded-md bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 active:bg-gray-950 active:text-gray-200">
                                <Volume2 className="h-4 w-4" />
                            <span>Lema</span>
                        </button>
                    </div>
                    <div className=" text-white rounded-lg flex items-center justify-center">
                        <button className="w-full inline-flex items-center gap-2 rounded-md bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 active:bg-gray-950 active:text-gray-200">
                                <Volume2 className="h-4 w-4" />
                            <span>Indicaciones</span>
                        </button>
                    </div>
                    <div className=" rounded-lg flex items-center col-span-4 justify-start">
                        <Label>
                            Controlar Mecanismo
                        </Label>
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                        <button className="w-full  inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 active:text-blue-100">
                                <Cog className="h-4 w-4" />
                            <span>Generar Pase</span>
                        </button>
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                        <button className="w-full  inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 active:text-blue-100">
                                <Cog className="h-4 w-4" />
                            <span>Generar Pase Especial</span>
                        </button>
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                        <button className="w-full  inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 active:text-blue-100">
                                <Cog className="h-4 w-4" />
                            <span>Testear Cerradura</span>
                        </button>
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                        <button className="w-full  inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 active:text-blue-100">
                                <Cog className="h-4 w-4" />
                            <span>Testear Flecha</span>
                        </button>
                        
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                        <button className="w-full  inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 active:text-blue-100">
                                <Cog className="h-4 w-4" />
                            <span>Apagar Actuador</span>
                        </button>
                    </div>
                    <div className=" rounded-lg flex items-center col-span-4 justify-start">
                        <Label>
                            Eventos
                        </Label>
                    </div>
                    <div className=" text-black rounded-lg flex items-center justify-center">
                    <button className="w-full inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800 active:text-emerald-100">
                            <Cog className="h-4 w-4" />
                            <span>Modo Mantenimiento</span>
                        </button>
                    </div>
                    <div className=" rounded-lg flex items-center col-span-4 justify-start">
                            <DataTable columns={columns}  data={test_data} />
                    </div>
                </div>
            </div>
        </>
    )

}

const test_data:MqttData[] =  [
	{name:"jhon",lastname:'doe',command:"/generar_pase",date:"2-21-2025",id:"",hour:"12:35:00"},
	{name:"jhon",lastname:'doe',command:"/generar_pase",date:"2-21-2025",id:"",hour:"12:35:00"},
	{name:"jhon",lastname:'doe',command:"/generar_pase",date:"2-21-2025",id:"",hour:"12:35:00"},
	{name:"jhon",lastname:'doe',command:"/generar_pase",date:"2-21-2025",id:"",hour:"12:35:00"},
	{name:"jhon",lastname:'doe',command:"/generar_pase",date:"2-21-2025",id:"",hour:"12:35:00"},
	{name:"jhon",lastname:'doe',command:"/generar_pase",date:"2-21-2025",id:"",hour:"12:35:00"},
	{name:"jhon",lastname:'doe',command:"/generar_pase",date:"2-21-2025",id:"",hour:"12:35:00"},
	{name:"jhon",lastname:'doe',command:"/generar_pase",date:"2-21-2025",id:"",hour:"12:35:00"}
]