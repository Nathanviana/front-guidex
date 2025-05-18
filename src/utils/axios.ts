import axios from "axios";

// Definindo a URL base para as requisições (alterar conforme necessário)
const api = axios.create({
  baseURL: "http://localhost:4000/api", // Altere para sua URL de produção
  withCredentials: true, // Envia cookies automaticamente nas requisições
});

export default api;
