import logger from "../../helpers/log.js";
import Uploader from "../../services/uploader.js";
import axios from "axios";
import { writeExif } from "../../helpers/convert.js";
import { packName, packPublish } from "../../configuration.js";
export const name = "qc";
export const command = ["qc", "fakechat", "quote"];
export const category = "Converts";
export const run = async (m, { sock }) => {
    try {
        const pp = await sock.profilePictureUrl(m.sender, "image").catch(_ => "https://i.pinimg.com/enabled_lo/564x/8a/e9/e9/8ae9e92fa4e69967aa61bf2bda967b7b.jpg");
        let uploads;
        let media;
        if (m.quoted?.isMedia || m.isMedia) {
            media = (await sock.downloadMediaMessage(m.quoted ? m.quoted : m));
            uploads = await Uploader(media);
        }
        const obj = {
            type: "quote",
            format: "png",
            backgroundColor: "#ffffffff",
            width: 512,
            height: 768,
            scale: 2,
            messages: [
                {
                    entities: [],
                    ...(uploads &&
                        (media = {
                            media: {
                                url: uploads
                            }
                        })),
                    avatar: true,
                    from: {
                        id: 1,
                        name: m.pushName,
                        photo: { url: pp }
                    },
                    text: m.text,
                    replyMessage: {
                        ...(m.quoted && {
                            name: await sock.getName(m.quoted.sender),
                            text: m.quoted.body || "",
                            chatId: m.from.split("@")[0]
                        })
                    }
                }
            ]
        };
        const data = await Quotly(obj);
        let sticker = await writeExif({ data, mimetype: "image/png" }, {
            packName,
            packPublish
        });
        return m.reply({ sticker });
    }
    catch (error) {
        logger.error("Error in fakechat command: " + error);
        return m.reply("Terjadi kesalahan saat membuat sticker.");
    }
};
async function Quotly(obj) {
    let json;
    try {
        json = await axios.post("https://bot.lyo.su/quote/generate", obj, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    catch (e) {
        throw e;
    }
    const results = json.data.result.image;
    const buffer = Buffer.from(results, "base64");
    return buffer;
}
