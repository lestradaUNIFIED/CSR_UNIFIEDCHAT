import axios from "axios";


const BASE_URL = "https://csr-unifiedchat.azurewebsites.net";
//const BASE_URL = "http://web.unifiedchat.ph";

//const BASE_URL = 'https://172.168.1.6:8000'
const CHAT_API_URL = "http://localhost:8086/";

export const httpClient = axios.create({
  //baseURL: "https://172.168.1.6:8000/api",
  baseURL: `${BASE_URL}/api`,
});

//,  Authorization: `Bearer ${auth?.token?.token}`
export const httpPrivate = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept : "application/json"
  },
  withCredentials: true,
});

export const httpAuth = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const CHAT_API = axios.create({
  baseURL: CHAT_API_URL,
});

export default httpClient;
