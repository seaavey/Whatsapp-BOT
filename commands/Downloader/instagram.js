import { func, instagram } from "@seaavey/scapers";
import logger from "../../helpers/log.js";
export const name = "igdl";
export const command = ["instagram", "igdl"];
export const category = "Downloader";
export const run = async (m, { sock }) => {
    try {
        const q = m.isQuoted ? m.quoted.body : m.body;
        const url = func.StringToURL(q)?.[0];
        if (!url || !url.includes("instagram.com"))
            return m.reply("Masukkan URL Instagramnya");
        m.reply("Sedang memproses...");
        let res = (await instagram(url));
        console.log(res)

        if (res?.title) return await sock.sendVideo(m.from, res.url, res.title, m)
    
        for (let i = 0; i < res.length; i++) {
          await sock.sendImage(m.from, res[i], null, m)
        }
    }
    catch (error) {
        logger.error("Error in igdl command: " + error);
        m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};
