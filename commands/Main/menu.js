import loadCommands from "../../helpers/helper.js"
import { directories } from "../../configuration.js"
import { changeFont } from "../../common/general.js"
import { externalAdReply } from "../../common/fake.js"
export const name = "menu"
export const command = ["allmenu", "menu"]
export const category = "Mains"
export const run = async (m, { sock }) => {
  const cmd = await loadCommands(directories)
  const getCategory = cmd.map(v => v.category)
  const category = [...new Set(getCategory)]
  const menu = category.reduce((acc, cat) => {
    const cmdc = cmd
      .filter(item => item.category === cat)
      .map(({ name }) => (Array.isArray(name) ? name : [name]))
      .flat()
      .sort((a, b) => a.localeCompare(b))
    acc[cat] = cmdc
    return acc
  }, {})
  let caption = `ʜᴇʟʟᴏ! ɪ ᴀᴍ ꜱᴇᴀᴀᴠᴇʏ ʙᴏᴛ.\nɪ ᴀᴍ ʜᴇʀᴇ ᴛᴏ ᴀꜱꜱɪꜱᴛ ʏᴏᴜ ᴡɪᴛʜ ᴀɴʏᴛʜɪɴɢ ʏᴏᴜ ɴᴇᴇᴅ.\n\n`
  Object.entries(menu).forEach(([cat, cmds]) => {
    caption += `*${cat} Menu*\n`
    cmds.forEach(cmd => {
      caption += `\n> ${m.prefix + cmd}`
    })
    caption += `\n\n`
  })
  await sock.sendMessage(m.from, {
    text: caption,
    contextInfo: externalAdReply(`Hi ${m.pushName}`, "Powered By Seaavey")
  })
  console.log(await changeFont("Hello World"))
}
