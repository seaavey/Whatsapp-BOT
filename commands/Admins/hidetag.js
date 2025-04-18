export const name = "hidetag";
export const command = ["hidetag", "ht"];
export const category = "Admins";
export const run = async (m, { sock, store }) => {
        await conn.sendMessage(m.from, {
            text: m.quoted ? m.quoted.body : m.text,
            mentions: m.metadata.participants.map((a) => a.id),
          });

};
export const isGroup = true;
export const isAdmin = true;
export const isBotAdmin = true;
