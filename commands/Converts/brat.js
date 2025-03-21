import { packName, packPublish } from "../../configuration.js";
import { fetchBuffer } from "../../services/fetcher.js";
import { writeExif } from "../../helpers/sticker.js";
import logger from "../../helpers/log.js";
export const name = ["brat", "bratvideo"];
export const command = name;
export const category = "Converts";
export const run = async (m) => {
    try {
        if (!m.text)
            return m.reply("Harap berikan teks untuk membuat " + m.command);
        if (m.command === "bratvideo" && m.text.split(" ").length < 3)
            return m.reply("Harap berikan teks lebih dari 2 kata untuk membuat video");
        await m.react("🕒");
        const isVideo = m.command === "bratvideo";
        const mimeType = isVideo ? "video/mp4" : "image/png";
        const query = new URLSearchParams({
            text: encodeURIComponent(m.text),
            ...(isVideo ? { isVideo: "true", delay: "700" } : {})
        }).toString();
        const res = (await fetchBuffer(`https://api.siputzx.my.id/api/m/brat?${query}`));
        const media = {
            mimetype: mimeType,
            data: res.data
        };
        const sticker = await writeExif(media, {
            packName,
            packPublish
        });
        return m.reply({ sticker, ai: true });
    }
    catch (error) {
        await m.react("❌");
        logger.error("Error in brat command: " + error);
        return m.reply("Terjadi kesalahan saat membuat gambar atau video.");
    }
};
