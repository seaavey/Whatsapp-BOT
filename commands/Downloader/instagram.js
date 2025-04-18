import { func } from "@seaavey/scapers";
import logger from "../../helpers/log.js";
import { Request } from "../../services/api.js";
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
        let res = (await Request.get("rex", {
            path: "/downloader/instagram",
            params: {
                url
            }
        }));
        if (!res.status)
            return m.reply("Gagal memproses permintaan.");
        if (res.data.metadata.isVideo)
            return await sock.sendVideo(m.from, res.data.url[0], res.data.metadata.caption, m);
        for (let i = 0; i < res.data.url.length; i++) {
            await sock.sendImage(m.from, res.data.url[i], i === 0 ? res.data.metadata.caption : null, m);
        }
    }
    catch (error) {
        logger.error("Error in igdl command: " + error);
        m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};
