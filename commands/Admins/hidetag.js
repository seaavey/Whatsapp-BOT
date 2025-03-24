import { serialize } from "../../helpers/serialize.js";
export const name = "hidetag";
export const command = ["hidetag", "ht"];
export const category = "Admins";
export const run = async (m, { sock, store }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        var message = await serialize(sock, await store.loadMessage(m.from, q.id), store);
        if (!message.isQuoted)
            return m.reply("message not found");
        await m.reply({ forward: message.quoted, force: true, mentions: m.metadata.participants.map(v => v.id) });
    }
    catch (err) {
        m.reply("messagae not found");
    }
};
export const isGroup = true;
export const isAdmin = true;
export const isBotAdmin = true;
