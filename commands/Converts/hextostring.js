import logger from "../../helpers/log.js";
export const name = "hextostring";
export const command = ["hextostring", "hts"];
export const category = "Converts";
export const run = async (m) => {
    try {
        const q = m.quoted ? m.quoted : m;
        if (!m.text)
            return m.reply("Berikan hex yang akan dijadikan string!");
        m.react("🔄");
        let res = Buffer.from(q.text, "hex").toString("utf-8");
        await m.reply(res);
    }
    catch (e) {
        logger.error("Error in hextostring command: " + e);
        return m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};
