import { downloadMediaMessage, jidNormalizedUser } from "@seaavey/baileys"
import { parsePhoneNumber } from "libphonenumber-js"
import fileType from "file-type"
import fs from "fs"
import path from "path"
import pino from "pino"
export default function ({ sock, store }) {
  const sock2 = sock
  sock2.downloadMediaMessage = async (message, filename) => {
    let media = await downloadMediaMessage(
      message,
      "buffer",
      {},
      {
        logger: pino({
          timestamp: () => `,"time":"${new Date().toJSON()}"`,
          level: "fatal"
        }).child({ class: "seaavey" }),
        reuploadRequest: sock.updateMediaMessage
      }
    )
    if (filename) {
      let mime = await fileType.fromBuffer(media)
      let ext = mime?.ext || "bin"
      let filePath = path.join(process.cwd(), "temp", `${filename}.${ext}`)
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
      await fs.promises.writeFile(filePath, media)
      return filePath
    }
    return media
  }
  sock2.reply = async (jid, text, quoted) => {
    return await sock.sendMessage(jid, { text }, { quoted })
  }
  sock2.sendImage = async (jid, media, caption, quoted) => {
    return await sock.sendMessage(
      jid,
      {
        image: typeof media === "string" && media.startsWith("http") ? { url: media } : media,
        caption
      },
      { quoted }
    )
  }
  sock2.sendVideo = async (jid, media, caption, quoted) => {
    return await sock.sendMessage(
      jid,
      {
        video: typeof media === "string" && media.startsWith("http") ? { url: media } : media,
        caption: caption
      },
      { quoted }
    )
  }
  sock2.sendAudio = async (jid, media, quoted, options) => {
    return await sock.sendMessage(
      jid,
      {
        audio: typeof media === "string" && media.startsWith("http") ? { url: media } : media,
        ...options
      },
      { quoted }
    )
  }
  sock2.getName = async jid => {
    let id = jidNormalizedUser(jid)
    if (id.endsWith("g.us")) {
      let metadata = store.groupMetadata?.[id]
      return metadata.subject
    } else {
      let metadata = store.contacts[id]
      return metadata?.name || metadata?.verifiedName || metadata?.notify || parsePhoneNumber("+" + id.split("@")[0]).format("INTERNATIONAL")
    }
  }
  sock2.sendButton = async (jid, text, but, quoted, options) => {
    return sock.sendMessage(
      jid,
      {
        text,
        footer: options?.footer || "Powered by Seaavey",
        buttons: but.map(v => ({
          buttonId: v.id,
          buttonText: { displayText: v.text }
        })),
        viewOnce: true,
        ...options
      },
      { quoted }
    )
  }
  return sock2
}
