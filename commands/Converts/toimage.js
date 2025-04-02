import logger from "../../helpers/log.js";
import sharp from "sharp";
export const name = "toimage";
export const command = ["toimage", "toimg"];
export const category = "Converts";
export const run = async (m, { sock }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        if (/webp/.test(q.msg.mimetype) && !q.msg.isAnimated) {
            let media = await sock.downloadMediaMessage(q, new Date().toString());
            m.react("🔄");
            const image = await sharp(media).toFormat("png").toBuffer();
            await sock.sendImage(m.from, image, null, m);
        }
        else
            m.reply("kirim stickernya");
    }
    catch (e) {
        logger.error("Error in toimage command: " + e);
        return m.reply("Masalah saat membuat gambar.");
    }
};
