import { toBuffer } from "@seaavey/baileys"
import axios from "axios"
import fileType from "file-type"
import mimes from "mime-types"
export function fetchBuffer(url, options) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Upgrade-Insecure-Requests": "1",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
          ...(options?.headers ? options?.headers : {})
        },
        responseType: "stream",
        ...(options && delete options.headers && options)
      })
      .then(async ({ data, headers }) => {
        let buffer = await toBuffer(data)
        let filename = headers["content-disposition"] ? headers["content-disposition"].split("filename=")[1] : "unknown"
        let mimetype = mimes.lookup(filename) || (await fileType.fromBuffer(buffer)).mime || "application/octet-stream"
        let ext = mimes.extension(mimetype) || (await fileType.fromBuffer(buffer)).ext || "bin"
        resolve({ data: buffer, filename, mimetype, ext })
      })
      .catch(reject)
  })
}
export function fetchJSON(url, options) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
          ...(options?.headers ? options?.headers : {})
        },
        ...(options && delete options.headers && options),
        responseType: "json"
      })
      .then(({ data }) => resolve(data))
      .catch(reject)
  })
}
