import { writeExif } from "../../helpers/convert.js";
import { packName, packPublish } from "../../configuration.js";
import logger from "../../helpers/log.js";
export const name = "sticker";
export const command = ["sticker", "s"];
export const category = "Converts";
export const run = async (m, { sock }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        if (/image|video|webp/.test(q.msg.mimetype)) {
            let media = await sock.downloadMediaMessage(q);
            if (q.msg?.seconds > 10)
                return m.reply("Maximal 10 detik!");
            m.react("🔄");
            let exif = {
                packName,
                packPublish
            };
            let sticker = await writeExif({ mimetype: q.msg.mimetype, data: media }, exif);
            await m.reply({ sticker });
        }
        else
            m.reply("Reply gambar/video!");
    }
    catch (e) {
        m.reply("Mohon maaf, terjadi kesalahan!");
        logger.error(e);
        m.react("❌");
    }
};
