import { downloadMediaMessage, jidNormalizedUser } from "@seaavey/baileys";
import { parsePhoneNumber } from "libphonenumber-js";
import fileType from "file-type";
import fs from "fs";
import path from "path";
import pino from "pino";

export default function ({ sock, store }) {
    const client = Object.defineProperties(sock, {
        downloadMediaMessage: {
            async value(message, filename) {
                let media = await downloadMediaMessage(message, "buffer", {}, {
                    logger: pino({
                        timestamp: () => `,"time":"${new Date().toJSON()}"`,
                        level: "fatal"
                    }).child({ class: "seaavey" }),
                    reuploadRequest: sock.updateMediaMessage
                });
                if (filename) {
                    let mime = await fileType.fromBuffer(media);
                    let ext = mime?.ext || "bin";
                    let filePath = path.join(process.cwd(), "temp", `${filename}.${ext}`);
                    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
                    await fs.promises.writeFile(filePath, media);
                    return filePath;
                }
                return media;
            },
            enumerable: true
        },
        reply: {
            async value(jid, text, quoted) {
                return await sock.sendMessage(jid, { text }, { quoted });
            },
            enumerable: true
        },
        sendImage: {
            async value(jid, media, caption, quoted) {
                return await sock.sendMessage(jid, {
                    image: typeof media === "string" && media.startsWith("http") ? { url: media } : media,
                    caption
                }, { quoted });
            },
            enumerable: true
        },
        sendVideo: {
            async value(jid, media, caption, quoted) {
                return await sock.sendMessage(jid, {
                    video: typeof media === "string" && media.startsWith("http") ? { url: media } : media,
                    caption: caption
                }, { quoted });
            },
            enumerable: true
        },
        sendAudio: {
            async value(jid, media, quoted, options) {
                return await sock.sendMessage(jid, {
                    audio: typeof media === "string" && media.startsWith("http") ? { url: media } : media,
                    ...options
                }, { quoted });
            },
            enumerable: true
        },
        getName: {
            async value(jid) {
                let id = jidNormalizedUser(jid);
                if (id.endsWith("g.us")) {
                    let metadata = store.groupMetadata?.[id];
                    return metadata.subject;
                }
                else {
                    let metadata = store.contacts[id];
                    return metadata?.name || metadata?.verifiedName || metadata?.notify || parsePhoneNumber("+" + id.split("@")[0]).format("INTERNATIONAL");
                }
            },
            enumerable: true
        },
        sendButton: {
            async value(jid, text, but, quoted, options) {
                return sock.sendMessage(jid, {
                    text,
                    footer: options?.footer || "Powered by Seaavey",
                    buttons: but.map(v => ({
                        buttonId: v.id,
                        buttonText: { displayText: v.text }
                    })),
                    viewOnce: true,
                    ...options
                }, { quoted });
            },
            enumerable: true
        }
    });
    return client;
}
