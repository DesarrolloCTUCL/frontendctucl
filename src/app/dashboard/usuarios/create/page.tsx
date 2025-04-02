"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

// Define the form schema with validation
const formSchema = z
    .object({
        name: z.string().min(5, {
            message: "El nombre debe tener al menos 5 caracteres.",
        }),
        lastname: z.string().min(5, {
            message: "El apellido debe tener al menos 5 caracteres.",
        }),
        email: z.string().email({
            message: "Por favor ingresa un correo electrónico válido.",
        }),
        phone: z.string().min(10, {
            message: "El Telefono debe tener al menos 10 digitos.",
        }),
        dni: z.string().min(10, {
            message: "El DNI debe tener al menos 10 digitos.",
        }),
        username: z.string(),
    })

export default function RegistrationForm() {
    // Initialize the form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            lastname: '',
            email: "",
            phone: "",
            dni: "",
            username: "",
        },
    })

    // Define the submit handler
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    return (
        <div className="mx-auto  space-y-6 p-6 bg-card rounded-lg shadow-md">
            <div className="space-y-2 text-start">
                <h1 className="text-3xl font-bold">Crear cuenta administrador</h1>
                <p className="text-muted-foreground">Ingresa los datos para registrar</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-row gap-5">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl >
                                        <Input placeholder="Juan " {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Apellido</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Pérez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Correo electrónico</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="ejemplo@correo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-row gap-5">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Usuario</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="juanPerez123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Telefono</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="+593 000 000 0000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dni"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Dni</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="1100000000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    <label
                        htmlFor="terms"
                        className="text-sm font-medium c leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Módulos
                    </label>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label
                            htmlFor="terms"
                            className="text-sm font-ligth c leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Paradas
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label
                            htmlFor="terms"
                            className="text-sm font-ligth c leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Usuarios
                        </label>
                    </div>
                    <div className="flex flex-row justify-end gap-5">
                        <Button type="button" className="bg-red-500 hover:bg-red-700 text-white">
                            Cancelar
                        </Button>

                        <Button type="submit" className="w-50 ">
                            Registrarse
                        </Button>
                    </div>
                </form>
            </Form>

        </div>
    )
}

