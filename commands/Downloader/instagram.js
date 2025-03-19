import { fetchJSON } from "../../services/fetcher.js"
import { StringToURL } from "../../common/general.js"
export const name = "igdl"
export const command = ["instagram", "igdl"]
export const category = "Downloader"
export const run = async (m, { sock }) => {
  try {
    const q = m.isQuoted ? m.quoted.body : m.body
    const url = StringToURL(q)?.[0]
    if (!url || !url.includes("instagram.com")) return m.reply("Masukkan URL Instagramnya")
    m.reply("Sedang memproses...")
    let res = await fetchJSON(`https://api.siputzx.my.id/api/d/igdl?url=${m.text}`)
    const set = new Set()
    for (const i of res.data) {
      if (set.has(i.url)) continue
      set.add(i.url)
      if (i.url.includes(".jpg")) await sock.sendImage(m.from, i.url, "", m)
      else await sock.sendVideo(m.from, i.url, "", m)
    }
  } catch (error) {
    console.error("Error in igdl command:", error)
    m.reply("Terjadi kesalahan saat memproses permintaan.")
  }
}
