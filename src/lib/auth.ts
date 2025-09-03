import { userAuht, LocalUser } from "@/types/user.types";
import { auth } from "@/lib/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function userAuthLogin(userData: userAuht): Promise<LocalUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);
    const firebaseUser = userCredential.user;

    // Construir el objeto LocalUser para que no de error TS
    const localUser: LocalUser = {
      id: 0,
      uuid: firebaseUser.uid,
      username: firebaseUser.email || "",
      email: firebaseUser.email || "",
      name: "",
      lastname: "",
      accountType: "",
      address: "",
      register: ""
    };

    return localUser;
  } catch (error) {
    throw error;
  }
}
