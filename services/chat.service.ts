import axios, { AxiosResponse, AxiosProgressEvent } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_SOCKET_API_URL;


export const uploadFile = (data: FormData, onUploadProgress?: 
(progressEvent: AxiosProgressEvent) => void): 
Promise<AxiosResponse<any>> => {
    return axios.post(`${API_URL}/chats/mediaUpload`, data, {
        onUploadProgress: onUploadProgress
    });
};
/*getChats(senderId: number, receiverId: number){
    return this.http.get(this.getEndPoint()+`/chats/records?senderId=${senderId}&receiverId=${receiverId}`, this.httpOptions);
  }*/
  
 