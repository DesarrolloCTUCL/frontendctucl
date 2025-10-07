import { userAuht, LocalUser } from "@/types/user.types";
import { auth, db } from "@/lib/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function userAuthLogin(userData: userAuht): Promise<LocalUser> {
  try {
    // Autenticación con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);
    const firebaseUser = userCredential.user;

    // Consultar Firestore para traer rol, nombre y foto
    const q = query(
      collection(db, "users"),
      where("email", "==", firebaseUser.email)  // campo "email" en Firestore
    );
    const querySnapshot = await getDocs(q);

    // Valores por defecto
    let localUserData: LocalUser = {
      id: 0,
      uuid: firebaseUser.uid,
      username: firebaseUser.email || "",
      email: firebaseUser.email || "",
      name: "",
      lastname: "",
      accountType: "usuario",
      address: "",
      register: "",
      image: "", // campo para la foto
    };

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      localUserData = {
        ...localUserData,
        name: data.name || "",
        accountType: data.role || "usuario",
        image: data.image || "",
      };
    });

    // Guardar rol en localStorage para usar en Sidebar u otros componentes
    localStorage.setItem("userRole", localUserData.accountType);

    console.log("Usuario autenticado:", localUserData);

    return localUserData;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
}
