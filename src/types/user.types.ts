/* eslint-disable @typescript-eslint/no-explicit-any */
export interface userAuht{
    username?:string,
    email:string,
    password:string
}

export interface LocalUser {
  id: number;
  uuid: string;
  username: string;
  email: string;
  name: string;
  lastname: string;
  accountType: string;
  address: string;
  register: string;
  image?: string; // <-- agregamos la foto como opcional
}
export interface SessionState {
  user: LocalUser | null;
  setUser: (user: LocalUser) => void;
  clearUser: () => void;
  otherData: any; // Para almacenar otros datos de peticiones
  setOtherData: (data: any) => void;
}
