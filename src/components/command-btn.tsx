import { Download, Send, Star, Shield, Settings } from "lucide-react"

export default function MqTTButtons(){
return(
    <div className="flex min-h-[300px] flex-col items-start justify-center gap-4 bg-gray-50 p-8">
    {/* Botón Principal - Azul */}
    <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
      <Send className="h-4 w-4" />
      <span>Enviar mensaje</span>
    </button>

    {/* Botón Secundario - Verde */}
    <button className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
      <Download className="h-4 w-4" />
      <span>Descargar archivo</span>
    </button>

    {/* Botón Terciario - Morado */}
    <button className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-purple-700">
      <Star className="h-4 w-4" />
      <span>Añadir a favoritos</span>
    </button>

    {/* Botón Outline */}
    <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
      <Settings className="h-4 w-4" />
      <span>Configuración</span>
    </button>

    {/* Botón Dark */}
    <button className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800">
      <Shield className="h-4 w-4" />
      <span>Acceso seguro</span>
    </button>
  </div>
)
}