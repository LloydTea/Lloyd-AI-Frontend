import axios, { AxiosInstance } from "axios";

const BASE_URL = "https://ai.lloydtea.pro:5450";

const apiInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default apiInstance;
