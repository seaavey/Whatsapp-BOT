import logger from "../../helpers/log.js";
import { StringToURL } from "../../common/general.js";
import { spotifydl } from "../../services/scapers.js";
import { fetchBuffer } from "../../services/fetcher.js";

export const name = "spotifydl";
export const command = ["spotifydl", "spotify", "spotifydlmp3"];
export const category = "Downloader";

export const run = async (m, { sock }) => {
    try {
        const q = m.isQuoted ? m.quoted.body : m.body;
        const url = StringToURL(q)?.[0];
        if (!url || !url.includes("spotify.com"))
            return m.reply("Link tidak ada. atau bukan link spotify.");
        m.react("⏳");
        const res = await spotifydl(url);
        m.react("✅");
        if (!res)
            return m.reply("Terjadi kesalahan saat memproses permintaan.");
        const caption = `*Title:* ${res.info.name}\n*Artist:* ${res.info.artists}\n*Duration:* ${(res.info.duration_ms / 1000).toFixed(2)} seconds`;
        const buffer = (await fetchBuffer(res.url));
        await sock.sendImage(m.from, res.info.image, caption, m);
        if (buffer) {
            await sock.sendAudio(m.from, buffer.data, m, {
                ptt: true,
                seconds: res.info.duration_ms / 1000,
                mimetype: "audio/mpeg"
            });
        }
    }
    catch (error) {
        logger.error("Error in spotifydl command: " + error);
        m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};
