import { externalAdReply, fv } from "../../common/fake.js"
import { Owner } from "../../configuration.js"
export const name = "owner"
export const command = ["owner", "creator"]
export const category = "Mains"
export const run = async (m, { sock }) => {
  const list = []
  for (let v of Owner) {
    const cleanedNumber = v.replace(/\D+/g, "")
    const jid = cleanedNumber + "@s.whatsapp.net"
    const name = (await sock.getName(jid)) || "Seaavey Owners"
    list.push({
      displayName: name,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nORG:Seaavey Teams\nitem1.TEL;waid=${cleanedNumber}:${cleanedNumber}\nEND:VCARD`
    })
  }
  await sock.sendMessage(
    m.from,
    {
      contacts: {
        displayName: "My Owners",
        contacts: list
      },
      contextInfo: externalAdReply("My Owners", "List of my owners", "assets/logo.jpg")
    },
    {
      quoted: fv()
    }
  )
}
