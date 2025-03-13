"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function Users(){
    const [registerForm,setRegisterForm] = useState(false);

    const openUserForm=()=>{

    }

    return(
        <>
            <div className="mx-auto p-6 bg-slate-50 shadow-lg rounded-lg">

                <h1 className="font-semibold ">Opciones:</h1>
                <div>
                    <Button onClick={()=>{setRegisterForm(true)}}>
                        Registrar Usuario
                    </Button>
                </div>
            </div>

            
        
        
        </>

    )


}