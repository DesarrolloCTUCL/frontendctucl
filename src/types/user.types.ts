export interface userAuht{
    username?:string,
    email:string,
    password:string
}

export interface LocalUser{

    name:string,
    lastname:string,
    accountType:string,
    address:string,
    register:string,
    email:string,
    username:string,
    uuid:string,
    id:number
}
export interface SessionState {
  user: LocalUser | null;
  setUser: (user: LocalUser) => void;
  clearUser: () => void;
  otherData: any; // Para almacenar otros datos de peticiones
  setOtherData: (data: any) => void;
}


export interface MqttData{
  id: string,
  name: string,
  lastname: string,
  command: string,
  date:string,
  time:string
}