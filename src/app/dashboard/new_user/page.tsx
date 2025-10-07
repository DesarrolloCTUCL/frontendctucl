"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "@/lib/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const roles = ["admin", "monitoreo", "sir", "sae", "secretaria", "taller", "gerencia", "credencializacion", "socio", "viewer"];

export default function CreateUserPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [ci, setCi] = useState("");
  const [number, setNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Subir imagen a Storage
      let imageUrl = "";
      if (imageFile) {
        const storageRef = ref(storage, `usuarios/${firebaseUser.uid}.jpg`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Guardar en Firestore
      await addDoc(collection(db, "users"), {
        uid: firebaseUser.uid,
        email,
        name,
        role,
        ci,
        number,
        birthday,
        image: imageUrl,
        createdAt: new Date(),
      });

      alert("Usuario creado correctamente");
      router.push("/dashboard/usuarios");
    } catch (error: any) {
      console.error("Error creando usuario:", error);
      alert("Error creando usuario: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear Usuario</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>
        <div>
          <Label>Nombre</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label>Rol</Label>
          <select className="w-full border rounded px-2 py-1" value={role} onChange={(e) => setRole(e.target.value)}>
            {roles.map((r) => (
              <option key={r} value={r}>{r.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>CI</Label>
          <Input value={ci} onChange={(e) => setCi(e.target.value)} />
        </div>
        <div>
          <Label>Número</Label>
          <Input value={number} onChange={(e) => setNumber(e.target.value)} />
        </div>
        <div>
          <Label>Fecha de Nacimiento</Label>
          <Input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
        </div>
        <div>
          <Label>Imagen</Label>
          <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files ? e.target.files[0] : null)} />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />}
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creando..." : "Crear Usuario"}
        </Button>
      </form>
    </div>
  );
}
