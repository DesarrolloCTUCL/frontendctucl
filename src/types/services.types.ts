export interface MqttApiQuery{
    user_id:number,
    name:string,
    lastname:string,
    email:string,
    command:string,
    username:string,
    path:string,
    topic:string
}

export interface MqttData{
    id: string,
    name: string,
    lastname: string,
    command: string,
    topic:string,
    date:string,
    time:string
  }