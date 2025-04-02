import logger from "../../helpers/log.js";
import { Upscale } from "../../services/scapers.js";
export const name = "remini";
export const command = ["remini", "hd", "hdr", "upscale"];
export const category = "Converts";
export const run = async (m, { sock }) => {
    const quoted = m.quoted ? m.quoted : m;
    sock.enhancer = sock.enhancer ? sock.enhancer : {};
    if (m.sender in sock.enhancer)
        return m.reply("Maaf, kamu hanya bisa mengubah satu gambar sekaligus.");
    if (/image|webp/.test(quoted.msg.mimetype)) {
        sock.enhancer[m.sender] = true;
        try {
            let media = (await sock.downloadMediaMessage(quoted, new Date().getTime().toString()));
            let res = (await Upscale(media));
            if (res.error)
                return m.reply("Terjadi kesalahan, silahkan coba lagi nanti.");
            await sock.sendImage(m.from, res.processed_image_url, "*Done!*", m);
        }
        catch (e) {
            logger.error("Error processing image: " + e);
            m.reply("Terjadi kesalahan, silahkan coba lagi nanti.");
        }
        finally {
            delete sock.enhancer[m.sender];
        }
    }
};
