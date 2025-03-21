export const name = "tagall";
export const command = ["tagall", "tag"];
export const category = "Admins";
export const isGroup = true;
export const isAdmin = true;
export const run = async (m) => {
    let txt = "";
    const participants = m.metadata.participants;
    for (let i = 0; i < participants.length; i++) {
        txt += "@" + participants[i].id.split("@")[0] + "\n";
    }
    m.reply({ text: txt, mentions: participants.map(a => a.id) });
};
