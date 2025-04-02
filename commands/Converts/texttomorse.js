import logger from "../../helpers/log.js";
import { toMorse } from "../../services/scapers.js";
export const name = "texttomorse";
export const command = ["texttomorse", "ttm"];
export const category = "Converts";
export const run = async (m) => {
    try {
        if (!m.text)
            return m.reply("Berikan teks yang akan dijadikan morse code!");
        m.react("🔄");
        let res = toMorse(m.text);
        await m.reply(res);
    }
    catch (e) {
        logger.error("Error in morsetotext command: " + e);
        return m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};
