import axios from "axios"
export const API = {
  putu: "https://api.siputzx.my.id/api",
  rex: "https://velyn.vercel.app/api"
}
export const Request = {
  get: async (apiBase, options) => {
    apiBase = API[apiBase]
    if (!apiBase) throw "API not found"
    const { path, params, headers } = options
    try {
      const response = await axios.get(`${apiBase}${path}`, {
        params,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      })
      return response.data
    } catch (error) {
      throw "ERROR"
    }
  }
}
