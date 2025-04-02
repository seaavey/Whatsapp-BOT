import logger from "../../helpers/log.js";
export const name = "stringtohex";
export const command = ["stringtohex", "sth"];
export const category = "Converts";
export const run = async (m) => {
    try {
        const q = m.quoted ? m.quoted : m;
        if (!m.text)
            return m.reply("Berikan hex yang akan dijadikan string!");
        m.react("🔄");
        let res = Buffer.from(q.text, "utf-8").toString("hex");
        await m.reply(res);
    }
    catch (e) {
        logger.error("Error in morsetotext command: " + e);
        return m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};
