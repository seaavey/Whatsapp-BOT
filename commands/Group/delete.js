export const name = "delete";
export const command = ["delete", "del"];
export const category = "Groups";
export const run = async (m, { sock }) => {
    if (!m.quoted)
        return m.reply("Reply pesan yang ingin dihapus!");
    await sock.sendMessage(m.from, {
        delete: {
            remoteJid: m.from,
            fromMe: m.isBotAdmin ?? false,
            id: m.quoted.id,
            participant: m.quoted.sender
        }
    });
};
export const isBotAdmin = true;
export const isGroup = true;
