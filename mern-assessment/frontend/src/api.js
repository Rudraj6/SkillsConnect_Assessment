import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getContactDetails(id) {
  return api.get(`/api/contacts/${id}`);
}


export default api;
