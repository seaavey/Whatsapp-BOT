import fs from "fs"
export const fv = text => {
  return {
    key: {
      remoteJid: "0@s.whatsapp.net",
      participant: "0@s.whatsapp.net",
      fromMe: true
    },
    message: {
      conversation: text || "SEAAVEY PROJECT"
    }
  }
}
export const externalAdReply = (title, body, thumbnail, options) => {
  const isUrl = thumbnail?.startsWith("http")
  return {
    externalAdReply: {
      title,
      body,
      ...(isUrl
        ? { thumbnailUrl: thumbnail }
        : {
            thumbnail: fs.readFileSync(thumbnail || "assets/thumbnail.png")
          }),
      mediaType: 1,
      renderLargerThumbnail: true,
      ...options
    }
  }
}
