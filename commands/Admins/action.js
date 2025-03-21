import { func } from "@seaavey/scapers";

export const name = ["add", "kick", "promote", "demote"];
export const command = ["add", "kick", "promote", "demote"];
export const category = "Admins";

export const run = async (m, { sock }) => {
    const jid = m.text?.trim() || m.quoted?.sender || (m.mentionedJid.length > 0 && m.mentionedJid[0]);
    if (!jid)
        return m.reply("Harap sebutkan atau reply pengguna untuk melanjutkan.");
    const actions = {
        add: "add",
        promote: "promote",
        demote: "demote",
        kick: "remove"
    };
    const action = actions[m.command];
    if (!action)
        return m.reply("Aksi tidak valid.");
    sock
        .groupParticipantsUpdate(m.from, [jid], action)
        .then(() => m.reply(`Berhasil ${func.toUpper(action)} member!`))
        .catch(() => m.reply(`Gagal ${func.toUpper(action)} member!`));
};

export const isGroup = true;
export const isAdmin = true;
export const isBotAdmin = true;
