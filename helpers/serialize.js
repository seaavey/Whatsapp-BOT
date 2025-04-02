import { areJidsSameUser, extractMessageContent, jidNormalizedUser } from "@seaavey/baileys";
import { Owner } from "../configuration.js";
export async function serialize(conn, msg, store) {
    const m = {};
    if (!msg?.message)
        return;
    if (!msg)
        return msg;
    m.message = parseMessage(msg.message);
    if (msg.key) {
        m.key = msg.key;
        m.from = m.key.remoteJid.startsWith("status") ? jidNormalizedUser(m.key?.participant || msg.participant) : jidNormalizedUser(m.key.remoteJid);
        m.fromMe = m.key.fromMe;
        m.id = m.key.id;
        m.device = /^3A/.test(m.id) ? "ios" : m.id.startsWith("3EB") ? "web" : /^.{21}/.test(m.id) ? "android" : /^.{18}/.test(m.id) ? "desktop" : "unknown";
        m.isBot = m.id.startsWith("BAE5") || m.id.startsWith("HSK");
        m.isGroup = m.from.endsWith("@g.us");
        m.participant = jidNormalizedUser(msg?.participant || m.key.participant) || false;
        m.sender = jidNormalizedUser(m.fromMe ? conn.user.id : m.isGroup ? m.participant : m.from);
    }
    if (m.isGroup) {
        if (!(m.from in store.groupMetadata)) {
            store.groupMetadata[m.from] = await conn.groupMetadata(m.from);
        }
        m.metadata = store.groupMetadata[m.from];
        m.groupAdmins = m.metadata.participants.reduce((memberAdmin, memberNow) => {
            if (memberNow.admin) {
                memberAdmin.push({ id: memberNow.id, admin: memberNow.admin });
            }
            return memberAdmin;
        }, []);
        m.isAdmin = m.isGroup && !!m.groupAdmins.find((member) => member.id === m.sender);
        m.isBotAdmin = m.isGroup && !!m.groupAdmins.find((member) => member.id === jidNormalizedUser(conn.user.id));
    }
    m.pushName = msg.pushName;
    m.isOwner = m.sender && Owner.includes(m.sender.replace(/\D+/g, ""));
    if (m.message) {
        m.type = getContentType(m.message) || Object.keys(m.message)[0];
        m.msg = parseMessage(m.message[m.type]) || m.message[m.type];
        m.mentions = [...(m.msg?.contextInfo?.mentionedJid || []), ...(m.msg?.contextInfo?.groupMentions?.map((v) => v.groupJid) || [])];
        m.body =
            m.msg?.text ||
                m.msg?.conversation ||
                m.msg?.caption ||
                m.message?.conversation ||
                m.msg?.selectedButtonId ||
                m.msg?.singleSelectReply?.selectedRowId ||
                m.msg?.selectedId ||
                m.msg?.contentText ||
                m.msg?.selectedDisplayText ||
                m.msg?.title ||
                m.msg?.name ||
                (() => {
                    try {
                        return JSON.parse(m.msg?.nativeFlowResponseMessage?.paramsJson)?.id || "";
                    }
                    catch {
                        return "";
                    }
                })();
        m.prefix = /^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]/gi.test(m.body) ? m.body.match(/^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]/gi)?.[0] || "" : "";
        m.command = m.body?.trim().replace(m.prefix, "").trim().split(/ +/).shift();
        m.args =
            m.body
                ?.trim()
                .replace(new RegExp("^" + escapeRegExp(m.prefix), "i"), "")
                .replace(m.command, "")
                .split(/ +/)
                .filter(Boolean) || [];
        m.text = m.args.join(" ").trim();
        m.expiration = m.msg?.contextInfo?.expiration || 0;
        m.timestamps = typeof msg.messageTimestamp === "number" ? msg.messageTimestamp * 1000 : m.msg.timestampMs * 1000;
        m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath;
        m.isQuoted = false;
        if (m.msg?.contextInfo?.quotedMessage) {
            m.isQuoted = true;
            m.quoted = {};
            m.quoted.message = parseMessage(m.msg?.contextInfo?.quotedMessage);
            if (m.quoted.message) {
                m.quoted.type = getContentType(m.quoted.message) || Object.keys(m.quoted.message)[0];
                m.quoted.msg = parseMessage(m.quoted.message[m.quoted.type]) || m.quoted.message[m.quoted.type];
                m.quoted.isMedia = !!m.quoted.msg?.mimetype || !!m.quoted.msg?.thumbnailDirectPath;
                m.quoted.key = {
                    remoteJid: m.msg?.contextInfo?.remoteJid || m.from,
                    participant: jidNormalizedUser(m.msg?.contextInfo?.participant),
                    fromMe: areJidsSameUser(jidNormalizedUser(m.msg?.contextInfo?.participant), jidNormalizedUser(conn?.user?.id)),
                    id: m.msg?.contextInfo?.stanzaId
                };
                m.quoted.from = /g\.us|status/.test(m.msg?.contextInfo?.remoteJid) ? m.quoted.key.participant : m.quoted.key.remoteJid;
                m.quoted.fromMe = m.quoted.key.fromMe;
                m.quoted.id = m.msg?.contextInfo?.stanzaId;
                m.quoted.device = /^3A/.test(m.quoted.id) ? "ios" : /^3E/.test(m.quoted.id) ? "web" : /^.{21}/.test(m.quoted.id) ? "android" : /^.{18}/.test(m.quoted.id) ? "desktop" : "unknown";
                m.quoted.isGroup = m.quoted.from.endsWith("@g.us");
                m.quoted.participant = jidNormalizedUser(m.msg?.contextInfo?.participant) || false;
                m.quoted.sender = jidNormalizedUser(m.msg?.contextInfo?.participant || m.quoted.from);
                m.quoted.mentions = [...(m.quoted.msg?.contextInfo?.mentionedJid || []), ...(m.quoted.msg?.contextInfo?.groupMentions?.map((v) => v.groupJid) || [])];
                m.quoted.body = m.quoted.msg?.text || m.quoted.msg?.caption || m.quoted?.message?.conversation || m.quoted.msg?.selectedButtonId || m.quoted.msg?.singleSelectReply?.selectedRowId || m.quoted.msg?.selectedId || m.quoted.msg?.contentText || m.quoted.msg?.selectedDisplayText || m.quoted.msg?.title || m.quoted?.msg?.name || "";
                m.quoted.prefix = new RegExp("^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]", "gi").test(m.quoted.body) ? m.quoted.body.match(new RegExp("^[°•π÷×¶∆£¢€¥®™+✓=|/~!?@#%^&.©^]", "gi"))[0] : "";
                m.quoted.command = m.quoted.body && m.quoted.body.replace(m.quoted.prefix, "").trim().split(/ +/).shift();
                m.quoted.args =
                    m.quoted.body
                        .trim()
                        .replace(new RegExp("^" + escapeRegExp(m.quoted.prefix), "i"), "")
                        .replace(m.quoted.command, "")
                        .split(/ +/)
                        .filter((a) => a) || [];
                m.quoted.text = m.quoted.args.join(" ").trim() || m.quoted.body;
                m.quoted.isOwner = m.quoted.sender && Owner.includes(m.quoted.sender.replace(/\D+/g, ""));
            }
        }
    }
    m.reply = async (text, options = {}) => {
        await conn.presenceSubscribe(m.from);
        await conn.sendPresenceUpdate("composing", m.from);
        if (typeof text === "string") {
            await conn.sendPresenceUpdate("paused", m.from);
            return await conn.sendMessage(m.from, { text, ...options }, { quoted: m, ephemeralExpiration: m.expiration, ...options });
        }
        else {
            return conn.sendMessage(m.from, { ...text, ...options }, { quoted: m, ephemeralExpiration: m.expiration, ...options });
        }
    };
    m.react = async (text) => {
        return conn.sendMessage(m.from, {
            react: {
                text,
                key: m.key
            }
        });
    };
    return m;
}
const escapeRegExp = (str) => str.replace(/[.*=+:\-?^${}()|[\]\\]|\s/g, "\\$&");
const getContentType = (content) => {
    if (content) {
        const keys = Object.keys(content);
        return keys.find(k => (k === "conversation" || k.endsWith("Message") || k.includes("V2") || k.includes("V3")) && k !== "senderKeyDistributionMessage");
    }
};
const parseMessage = (content) => {
    content = extractMessageContent(content);
    if (content && content.viewOnceMessageV2Extension) {
        content = content.viewOnceMessageV2Extension.message;
    }
    if (content && content.protocolMessage && content.protocolMessage.type == 14) {
        const type = getContentType(content.protocolMessage);
        content = content.protocolMessage[type || "ephemeralMessage"];
    }
    if (content && content.message) {
        const type = getContentType(content.message);
        content = content.message[type || ""];
    }
    return content;
};
