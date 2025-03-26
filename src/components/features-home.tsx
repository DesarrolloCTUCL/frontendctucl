import { Bus, BarChart3, Clock, Shield, MapPin, Users } from "lucide-react"
export default function FeaturesApp() {

	return (
		<div className="mx-auto  grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
			<div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
				<div className="rounded-full bg-primary p-2 text-primary-foreground">
					<BarChart3 className="h-6 w-6" />
				</div>
				<h3 className="text-xl font-bold">Análisis en Tiempo Real</h3>
				<p className="text-center text-muted-foreground">
					Monitoree el rendimiento de su flota con paneles de control intuitivos y reportes detallados.
				</p>
			</div>
			<div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
				<div className="rounded-full bg-primary p-2 text-primary-foreground">
					<Clock className="h-6 w-6" />
				</div>
				<h3 className="text-xl font-bold">Programación Eficiente</h3>
				<p className="text-center text-muted-foreground">
					Optimice rutas y horarios para maximizar la eficiencia y reducir costos operativos.
				</p>
			</div>
			<div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
				<div className="rounded-full bg-primary p-2 text-primary-foreground">
					<Shield className="h-6 w-6" />
				</div>
				<h3 className="text-xl font-bold">Mantenimiento Preventivo</h3>
				<p className="text-center text-muted-foreground">
					Programe y rastree el mantenimiento para prevenir averías y extender la vida útil de sus vehículos.
				</p>
			</div>
			<div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
				<div className="rounded-full bg-primary p-2 text-primary-foreground">
					<MapPin className="h-6 w-6" />
				</div>
				<h3 className="text-xl font-bold">Seguimiento GPS</h3>
				<p className="text-center text-muted-foreground">
					Localice sus vehículos en tiempo real y optimice rutas para mejorar la puntualidad.
				</p>
			</div>
			<div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
				<div className="rounded-full bg-primary p-2 text-primary-foreground">
					<Users className="h-6 w-6" />
				</div>
				<h3 className="text-xl font-bold">Gestión de Conductores</h3>
				<p className="text-center text-muted-foreground">
					Administre horarios, licencias y capacitación de conductores desde una plataforma centralizada.
				</p>
			</div>
			<div className="flex flex-col items-center space-y-2 rounded-lg border p-6">
				<div className="rounded-full bg-primary p-2 text-primary-foreground">
					<Bus className="h-6 w-6" />
				</div>
				<h3 className="text-xl font-bold">Gestión de Combustible</h3>
				<p className="text-center text-muted-foreground">
					Controle y analice el consumo de combustible para identificar oportunidades de ahorro.
				</p>
			</div>
		</div>
	);
}