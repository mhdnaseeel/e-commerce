import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const auth = JSON.parse(localStorage.getItem("auth"));
        if (auth && auth.jwtToken) {
            config.headers.Authorization = `Bearer ${auth.jwtToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response, config } = error;
        if (response && response.status === 401) {
            const url = config?.url || "";
            // Never clear auth for public, login, or payment-related requests
            const isProtectedFromLogout =
                url.includes("/public/") ||
                url.includes("/auth/signin") ||
                url.includes("/stripe") ||
                url.includes("/paypal") ||
                url.includes("/order/");

            if (!isProtectedFromLogout) {
                localStorage.removeItem("auth");
            }
        }
        return Promise.reject(error);
    }
);

export default api;