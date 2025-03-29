import { func } from "@seaavey/scapers";
import logger from "../../helpers/log.js";
import { Request } from "../../services/api.js";
export const name = "soundcloud";
export const command = ["soundcloud", "soundclouddl"];
export const category = "Downloader";
export const run = async (m, { sock }) => {
    try {
        const q = m.isQuoted ? m.quoted.body : m.body;
        const url = func.StringToURL(q)?.[0];
        if (!url || !url.includes("soundcloud.com"))
            return m.reply("Link tidak ada. atau bukan link soundcloud.");
        m.react("⏳");
        const res = (await Request.get("putu", {
            path: "/d/soundcloud",
            params: {
                url
            }
        }));
        await m.reply({
            audio: {
                url: res.data.url
            },
            mimetype: "audio/mpeg",
            ptt: false,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: res.data.title,
                    body: "Powered by Seaavey",
                    thumbnailUrl: res.data.thumbnail,
                    renderLargerThumbnail: true,
                    mediaType: 1
                }
            }
        });
    }
    catch (error) {
        logger.error("Error in soundcloud command: " + error);
        m.reply("Terjadi kesalahan saat memproses permintaan.");
    }
};
