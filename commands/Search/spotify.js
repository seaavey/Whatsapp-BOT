import { func } from "@seaavey/scapers";
import { Request } from "../../services/api.js";
export const name = "searchmusic";
export const command = ["searchmusic", "spotifysearch", "spotify"];
export const category = "Search";
export const run = async (m, { sock }) => {
    const q = m.isQuoted ? m.quoted.body : m.body;
    const url = await func.StringToURL(q)?.[0];
    if (url)
        return m.reply("Masukkan query, bukan URL nya");
    await m.react("⏳");
    await m.reply("Sedang memproses...");
    const res = await Request.get("putu", {
        path: "/s/spotify",
        params: { query: q }
    }).then(({ data }) => data);
    if (!res.length)
        return m.reply("Tidak ada hasil");
    let text = "";
    for (let i = 0; i < res.length; i++) {
        text += `*${i + 1}.* ${res[i].title} - ${res[i].artist.name}\n`;
        text += `Link: ${res[i].artist.external_urls.spotify}\n\n`;
    }
    await sock.sendImage(m.from, res[0].thumbnail, text, m);
};
