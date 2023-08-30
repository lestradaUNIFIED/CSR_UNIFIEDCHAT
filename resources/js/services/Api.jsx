import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || `https://csr-unifiedchat.azurewebsites.net`;

const CHAT_API_URL = "http://localhost:8086/";
export const httpClient = axios.create({
  baseURL: `${BASE_URL}/api`,
});

//,  Authorization: `Bearer ${auth?.token?.token}`
export const httpPrivate = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export const httpPlain = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
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
