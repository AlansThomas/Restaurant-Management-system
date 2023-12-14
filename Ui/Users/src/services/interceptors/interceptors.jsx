import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
    baseURL: BASE_URL,
    headers: {},
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers["Authorization"] = token;
    }
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error?.response?.data === "User Denied") {
            localStorage.clear();
            window.location.replace("/");
        } else if (error?.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const accessToken = await refreshAccessToken();
            axiosPrivate.defaults.headers.common["Authorization"] = accessToken;
            return axiosPrivate(originalRequest);
        } else {
            throw error;
        }
    }
);
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const data = { refreshToken: refreshToken };

    try {
        const response = await axios.put(BASE_URL + "user/update", data);
        const accessToken = response?.data?.accessToken;
        const refreshToken = response?.data?.accessToken;

        localStorage.setItem("accessToken", accessToken);
        localStorage.accessToken("refreshToken", refreshToken)
        return accessToken;
    } catch (err) {
        localStorage.clear();
        window.location.replace("/");
    }
};
export const axiosPrivate = instance;