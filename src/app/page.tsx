import Image from "next/image"
import bgImage from '@/assets/buses.jpg';
import FeaturesApp from "@/components/features-home";
export default function Home() {
	return (
				<section className="w-full   p-3">
					<div className="px-4 md:px-6">
						<h1 className="text-3xl text-white font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
							Sistema Integral de Monitoreo para el transporte Urbano
						</h1>
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-6">
							<div className="col-span-4 flex flex-col justify-center space-y-4">
								<FeaturesApp />
							</div>
							<div className="flex items-center justify-center col-span-4 md:col-span-2">
								<Image
									src={bgImage}
									width={650}
									height={650}
									alt="Bus Simtra Dashboard"
									className="rounded-lg object-cover w-full h-auto max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[650px]"
									/>
							</div>
						</div>
					</div>
				</section>
	)
}

