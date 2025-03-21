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
        let res = (await Request.get("putu", {
            path: "/d/igdl",
            params: { url }
        }));
        const set = new Set();
        for (const i of res.data) {
            if (set.has(i.url))
                continue;
            set.add(i.url);
            if (i.url.includes(".jpg"))
                await sock.sendImage(m.from, i.url, "", m);
            else
                await sock.sendVideo(m.from, i.url, "", m);
        }
    }
    catch (error) {
        logger.error("Error in igdl command: " + JSON.stringify(error))
        m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};
