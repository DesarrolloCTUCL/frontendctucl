"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db } from "@/lib/firebase-config";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Trash2 } from "lucide-react";

type UserData = {
  id: string;
  email: string;
  name: string;
  role: string;
  ci?: string;
  number?: string;
  birthday?: string;
  image?: string;
};

const ROLES = ["admin", "monitoreo", "sir", "sae", "secretaria", "taller", "gerencia", "credencializacion", "socio", "viewer"];

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  // Cargar usuarios desde Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList: UserData[] = [];
      querySnapshot.forEach((docSnap) => {
        userList.push({ id: docSnap.id, ...docSnap.data() } as UserData);
      });
      setUsers(userList);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Cambiar rol
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingRole(userId);
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
    } finally {
      setUpdatingRole(null);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      // Nota: Para eliminarlo también de Authentication, necesitarías credenciales de administrador en el backend (Admin SDK).
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin size-6" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Usuarios Registrados</h1>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Imagen</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">CI</th>
              <th className="px-4 py-2">Número</th>
              <th className="px-4 py-2">Cumpleaños</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-none">
                <td className="px-4 py-2">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={user.image || "/default-avatar.png"} />
                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <Select
                    defaultValue={user.role}
                    onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                    disabled={updatingRole === user.id}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-2">{user.ci || "-"}</td>
                <td className="px-4 py-2">{user.number || "-"}</td>
                <td className="px-4 py-2">{user.birthday || "-"}</td>
                <td className="px-4 py-2 text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
