import logger from "../../helpers/log.js";
import { spotifydl } from "../../services/scapers.js";
import { fetchBuffer } from "../../services/fetcher.js";
import { Request } from "../../services/api.js";
import { externalAdReply } from "../../common/fake.js";
export const name = "play";
export const command = ["play", "playmusic"];
export const category = "Downloader";
export const run = async (m, { sock }) => {
    try {
        if (!m.text)
            return m.reply("Berikan Nama Lagu atau Nama Musik");
        const res = (await Request.get("putu", {
            path: "/s/spotify",
            params: {
                query: m.text
            }
        }));
        if (!res.status)
            return m.reply("Maaf, lagu tidak ditemukan.");
        const data = res.data[0];
        await m.react("⏳");
        await m.reply("Sedang memproses...");
        const audio = await spotifydl(data.track_url);
        // await sock.sendImage(m.from, data.thumbnail, `*Title:* ${data.title}\n*Artist:* ${data.artist}\n*Duration:* ${data.duration}`, m)
        const buffer = (await fetchBuffer(audio.url));
        await sock.sendAudio(m.from, buffer.data, m, {
            ptt: false,
            mimetype: "audio/mpeg",
            contextInfo: externalAdReply(data.title, "Powered By Seaavey", data.thumbnail)
        });
    }
    catch (error) {
        logger.error("Error in play command: " + error);
        m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};
