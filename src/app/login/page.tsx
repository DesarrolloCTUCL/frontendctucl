"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn, Lock, Mail } from "lucide-react"
import { userAuthLogin } from "@/lib/auth"
import type { userAuht } from "@/types/user.types"
import { useSessionStore } from "@/store/session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription,CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Home() {
	const [showPassword, setShowPassword] = useState(false)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const setUser = useSessionStore((state) => state.setUser)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		const credentials: userAuht = { email, password }
		try {
			const userData = await userAuthLogin(credentials)
			setUser(userData)
			localStorage.setItem("userRole", userData.accountType)
			router.push("/dashboard/")
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<main className="w-full   items-center  flex-1  bg-[url('/purple.jpg')] bg-cover bg-center">

		<div className="flex items-center h-screen  justify-center bg-gradient-to-br  to-muted ">
		

				<Card className="border-border/50 shadow-lg w-96">
					<CardHeader className="space-y-1">
					<div className="text-center mb-8">
					<h1 className="text-3xl font-bold tracking-tight text-primary">CTUCL</h1>
					<p className="text-muted-foreground mt-2">Inicia Sesion</p>
				</div>
						<CardTitle className="text-2xl text-center">Bienvenido Nuevamente!</CardTitle>
						<CardDescription className="text-center">Ingresa tus credenciales para continuar</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
									<Input
										id="email"
										type="email"
										placeholder="name@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="password">Contraseña</Label>
								</div>
								<div className="relative">
									<Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="••••••••"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="pl-10"
										required
									/>
									<button
										type="button"
										className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-5 w-5" aria-hidden="true" />
										) : (
											<Eye className="h-5 w-5" aria-hidden="true" />
										)}
										<span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
									</button>
								</div>
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? (
									<span className="flex items-center justify-center">
										<svg
											className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Processing...
									</span>
								) : (
									<span className="flex items-center justify-center">
										<LogIn className="mr-2 h-4 w-4" />
										Iniciar Sesión
									</span>
								)}
							</Button>
						</form>
					</CardContent>

					
				</Card>

			</div>

		</main>
	)
}

