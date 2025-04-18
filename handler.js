import helper from "./helpers/helper.js"
import logger from "./helpers/log.js"
import moment from "moment-timezone"
import { directories, timeZone } from "./configuration.js"
import { mess } from "./common/mess.js"
/**
 *
 * @param {WASocket} sock
 * @param {any} store
 * @param {Messages} m
 * @returns {Promise<void>}
 */
export default async function handler(sock, store, m) {
  try {
    let isCommand = (m.prefix && m.body.startsWith(m.prefix)) || false
    if (m.fromMe) return
   
    logger.log(`User ${m.sender.split("@")[0]} - ${await sock.getName(m.sender)}`)
    logger.log(`Date: ${moment().tz(timeZone).format("DD/MM/YYYY HH:mm:ss")}`)
    logger.log(`MSG: ${m.type} - ${m.key.id}`)
    logger.log(`Message: ${m.body || null}\n`)
    
    if (!isCommand) return
    const command = await helper(directories)
    const cmd = command.find(cmd => cmd.command.some(c => c === m.command.toLowerCase()))
    if (!cmd) return
    if (!cmd.run) return
    if (cmd.isGroup && !m.isGroup) {
      return m.reply(mess.isGroup)
    } else if (cmd.isAdmin && !m.isAdmin && !m.isOwner) {
      return m.reply(mess.isAdmin)
    } else if (cmd.isBotAdmin && !m.isBotAdmin) {
      return m.reply(mess.isBotAdmin)
    } else if (cmd.isOwner && !m.isOwner) {
      return m.reply(mess.isOwner)
    }
    await cmd.run(m, { sock, store })
  } catch (e) {
    logger.error(e)
  }
}
