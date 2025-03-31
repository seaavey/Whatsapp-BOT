import { fetchJSON } from "../../services/fetcher.js";
import { func } from "@seaavey/scapers";
import logger from "../../helpers/log.js";
import { Pin } from "@seaavey/scapers";
export const name = "pindl";
export const command = ["pinterest", "pindl"];
export const category = "Downloader";
export const run = async (m, { sock }) => {
    try {
        const q = m.isQuoted ? m.quoted.body : m.body;
        const url = func.StringToURL(q)?.[0];
        if (!url || !url.includes("pin"))
            return m.reply("Masukkan URL Pinterest yang valid.");
        m.reply("Sedang memproses...");
        let res;
        try {
            res = await Pin.download(url);
        }
        catch {
            res = await fetchJSON(`https://api.siputzx.my.id/api/d/pinterest?url=${encodeURIComponent(url)}`).then((response) => {
                if (!response.status)
                    throw new Error("API response is not valid");
                return response.data;
            });
        }
        if (!res || (!res.media && !res.url)) {
            return m.reply("Gagal memproses permintaan. Silakan coba lagi.");
        }
        const mediaUrl = res.media || res.url;
        await sock.sendVideo(m.from, mediaUrl, "", m);
    }
    catch (error) {
        logger.error("Error in pindl command: " + error);
        m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};
