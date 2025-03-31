"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import {
    Dialog
} from "@/components/ui/dialog"

import Link from 'next/link';
export default function Users() {


    return (
        <>
            <div className="mx-auto p-6 bg-slate-50 shadow-lg rounded-lg">
                <h1 className="font-semibold ">Opciones:</h1>
                <div>
                    <Dialog>
                        <Link href="/dashboard/usuarios/create">
                            <Button>
                                Registrar Usuario
                            </Button>
                        </Link>
                    </Dialog>
                </div>
            </div>
        </>

    )


}