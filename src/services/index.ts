import axios from "../../node_modules/axios/index";

import { API, TOKEN } from "../config";

const token = localStorage.getItem(TOKEN);

const AxiosInstances = axios.create({
  baseURL: API,
  headers: {
    Authorization: `${token ? `Bearer ${token}` : ""}`,
  },
});

AxiosInstances.interceptors.request.use(
  function (config) {
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Handle request errors
    return Promise.reject(error);
  }
);

AxiosInstances.interceptors.response.use(
  (response) => response,
  (error) => {
    // All api error handle here
    throw error;
  }
);

export default AxiosInstances;
