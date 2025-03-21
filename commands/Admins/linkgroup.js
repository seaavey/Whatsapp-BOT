export const name = "linkgroup";
export const command = ["linkgroup", "linkgc"];
export const category = "Admins";
export const run = async (m, { sock }) => {
    m.reply("https://chat.whatsapp.com/" + (await sock.groupInviteCode(m.from)));
};
export const isGroup = true;
export const isAdmin = true;
export const isBotAdmin = true;
