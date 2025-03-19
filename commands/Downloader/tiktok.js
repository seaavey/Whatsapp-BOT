import { StringToURL } from "../../common/general.js";
import { Tiktok } from "@seaavey/scapers";

export const name = "tiktok";
export const command = ["tiktok", "ttdl", "tiktokdl"];
export const category = "Downloader";
export const desc = "Download video tiktok";

export const run = async (m, { sock }) => {
    try {
        const q = m.isQuoted ? m.quoted.body : m.body;
        const url = StringToURL(q)?.[0];
        if (!url || !url.includes("tiktok.com"))
            return m.reply("Masukkan URL Tiktoknya");
        m.react("🕒");
        m.reply("Sedang Mendownload...");
        let res = await Tiktok(url);
        if (res && res.code === -1) {
            res = await Tiktok(url, true);
        }
        if (res.data?.images?.length) {
            for (let i = 0; i < res.data.images.length; i++) {
                await sock.sendImage(m.from, res.data.images[i], i === 0 ? res.data.title : "", m);
            }
        }
        else if (res.data?.play) {
            await sock.sendVideo(m.from, res.data.play, res.data.title, m);
            await sock.sendAudio(m.from, res.data.music, m, {
                mimetype: "audio/mp4",
                ptt: false
            });
            m.react("");
        }
        else {
            await sock.reply(m.from, "Gagal Mendapatkan Video", m);
        }
    }
    catch (error) {
        console.error("Error in tiktok command:", error);
        m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};
