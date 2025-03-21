import makeWASocket, { Browsers, DisconnectReason, jidNormalizedUser, makeCacheableSignalKeyStore, makeInMemoryStore, useMultiFileAuthState } from "@seaavey/baileys"
import { updateGroupMetadata, upsertContacts, updateContacts } from "./event/index.js"
import Socket from "./services/Socket.js"
import { Boom } from "@hapi/boom"
import NodeCache from "node-cache"
import pino from "pino"
import { version, online, usePairingCode, number, sessionPath } from "./configuration.js"
import { func } from "@seaavey/scapers"
import { serialize } from "./helpers/serialize.js"
import loggerr from "./helpers/log.js"

const logger = pino({
  timestamp: () => `,"time":"${new Date().toJSON()}"`
}).child({
  class: "seaavey"
})
logger.level = "fatal"

const store = makeInMemoryStore({ logger })

loggerr.info("Starting Bot...")
const waSocket = async () => {
  
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const msgRetryCounterCache = new NodeCache()
  let sock = makeWASocket.default({
    version,
    logger,
    printQRInTerminal: !usePairingCode,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger)
    },
    browser: Browsers.macOS("Safari"),
    markOnlineOnConnect: online,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    retryRequestDelayMs: 10,
    msgRetryCounterCache,
    transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 10 },
    defaultQueryTimeoutMs: undefined,
    maxMsgRetryCount: 15,
    appStateMacVerification: { patch: true, snapshot: true },
    getMessage
  })

  sock = await Socket({ sock, store })

  store.bind(sock.ev)

  if (usePairingCode && !sock.authState.creds.registered) {
    if (!number) throw new Error("No number provided")
    let phoneNumber = number.replace(/[^0-9]/g, "")
    await func.delay(3000)
    let code = await sock.requestPairingCode(phoneNumber)
    loggerr.log(`Pairing code: ${code.match(/.{1,4}/g).join("-")}`)
  }

  sock.ev.on("connection.update", async ({ lastDisconnect, connection }) => {
    if (connection) loggerr.info(`Connection Status : ${connection}`)
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode
      if ([DisconnectReason.multideviceMismatch, DisconnectReason.loggedOut, 403].includes(reason)) {
        loggerr.error(lastDisconnect?.error?.message || "Connection Closed")
        setTimeout(() => {
          waSocket()
        }, 5000)
      } else {
        loggerr.error(lastDisconnect?.error?.message || "Connection Closed")
        setTimeout(() => {
          waSocket()
        }, 5000)
      }
    }
    if (connection === "open") loggerr.info("Connection Opened")
  })

  sock.ev.on("creds.update", saveCreds)
  sock.ev.on("contacts.upsert", update => upsertContacts(update, store))
  sock.ev.on("contacts.update", update => updateContacts(update, store))
  sock.ev.on("groups.update", update => updateGroupMetadata(update, store))
  sock.ev.on("messages.upsert", async ({ messages }) => {
    if (!messages[0].message) return
    let m = await serialize(sock, messages[0], store)
    if (m?.key && !m.key.fromMe && m.key.remoteJid === "status@broadcast") {
      if (m.type === "protocolMessage" && m.message.protocolMessage.type === 0) return
      await sock.readMessages([m.key])
    }
    const handler = await import("./handler.js")
    handler.default(sock, store, m)
  })
  process.on("uncaughtException", console.error)
  process.on("unhandledRejection", console.error)
}

waSocket()

export const getMessage = async key => {
  const jid = jidNormalizedUser(key.remoteJid || "")
  const msg = await store.loadMessage(jid, key.id || "")
  return msg?.message || undefined
}
