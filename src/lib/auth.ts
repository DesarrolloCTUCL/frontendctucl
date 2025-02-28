import { userAuht } from "@/types/user.types";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
import { auth } from "@/lib/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from 'js-cookie';
export async function userAuthLogin(userData: userAuht) {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, userData.email,userData.password);
		const user = userCredential.user;
		if (user) {
			const token = await user.getIdToken();
			
			const response = await axios.post(
				`${API_URL}/api/auth/login`,
				{
					email: userData.email,
					password: userData.password,
					username: userData.username,
					firebase_token:token
				}
			);
			console.log("respuesta_api",response.data.result.localData);
			storeTokenInCookie(token); 
			return response.data.result.localData;
		}
	} catch (error) {
		throw error;
	}
}

export function storeTokenInCookie(token: string) {
	const expirationDate = new Date();
	expirationDate.setDate(expirationDate.getDate() + 7); // Expira en 7 días
  
	Cookies.set('auth_token', token, { expires: expirationDate, secure: true, sameSite: 'Strict' });
  }



export function getTokenFromCookie() {
  const token = Cookies.get('auth_token');
  return token;
}
