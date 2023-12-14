import axios from "axios";
import serverConfig from "./serverConfig";
import { refreshToken } from "./AdminServices";

export const axiosInstance = axios.create({
  baseURL: `${serverConfig.API_URL}`,
  headers: {
    "Content-type": "application/json",
  },
});

axiosInstance.interceptors.request.use((request) => {
  const token = localStorage.getItem("AccessToken");
  if (token) {
    request.headers.Authorization = `${token}`;
  }
  return request;
});

let isRefreshing = false; // Flag to prevent multiple refresh attempts

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // return error
    console.log("aaa");
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      error.config.url !== "user/update"
    ) {
      console.log("aaqq");
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const accessToken = await refreshAccessToken();
          axiosInstance.defaults.headers.common["Authorization"] = accessToken;
          originalRequest.headers["Authorization"] = accessToken;
          isRefreshing = false; // Reset the flag after a successful refresh
          return axiosInstance(originalRequest);
        } catch (error) {
          await alert("Invalid credentials.")
          //  Swal.fire({
          //   title: "Token Expired",
          //   text: "Your session has expired. Please log in again.",
          //   icon: "warning",
          //   confirmButtonText: "OK",
          // });
          localStorage.clear();
          window.location.replace("/login");
          return Promise.reject(error); // Reject the promise after handling the error
        }
      } else {
        // If refresh is already in progress, clear local storage and redirect to login
        localStorage.clear();
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  try {
    const res = await refreshToken();
    console.log("aaaa",res.data);
    const accessToken = res.data.accessToken;
    localStorage.setItem("AccessToken", accessToken);
    console.log("Access",accessToken);


    return accessToken;
  } catch (err) {
    throw new Error("Failed to refresh access token.");
  }
};
