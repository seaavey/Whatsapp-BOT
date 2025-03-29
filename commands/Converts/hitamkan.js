import logger from "../../helpers/log.js";
import { negro } from "@seaavey/scapers";
export const name = "negro";
export const command = ["hitamkan", "negro"];
export const category = "Converts";
export const run = async (m, { sock }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        if (/image|webp/.test(q.msg.mimetype)) {
            let media = (await sock.downloadMediaMessage(q));
            m.react("🔄");
            const nigga = await negro(media, m.text ? m.text : "hitam");

            await sock.sendImage(m.from, nigga, null, m);
        } else {
            return m.reply("Balas gambar dengan caption.")
        }
    }
    catch (e) {
        logger.error("Error in hitamkan command: " + e);
        return m.reply("Masalah saat membuat gambar.");
    }
};
