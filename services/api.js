import axios from "axios";
export const API = {
    putu: "https://api.siputzx.my.id/api",
    rex: "https://velyn.biz.id/api"
};
export const Request = {
    get: async (apiBase, options) => {
        const baseURL = API[apiBase];
        if (!baseURL)
            throw new Error(`API base '${apiBase}' not found`);
        const { path, params, headers } = options;
        try {
            const response = await axios.get(`${baseURL}${path}`, {
                params,
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                    "User-Agent": "Seaavey-Request"
                }
            });
            return response.data;
        }
        catch (error) {
            throw new Error(error.response?.data || error.message);
        }
    },
    create: async (apiBase, options) => {
        const baseURL = API[apiBase];
        if (!baseURL)
            throw new Error(`API base '${apiBase}' not found`);
        const { path, params } = options;
        const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
        return `${baseURL}${path}${queryString}`;
    }
};
