import logger from "../../helpers/log.js";
import { toText } from "../../services/scapers.js";
export const name = "morsetotext";
export const command = ["morsetotext", "mtt"];
export const category = "Converts";
export const run = async (m) => {
    try {
        if (!m.text)
            return m.reply("Berikan morse code yang akan dijadikan teks!");
        m.react("🔄");
        let res = toText(m.text);
        await m.reply(res);
    }
    catch (e) {
        logger.error("Error in morsetotext command: " + e);
        return m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};
