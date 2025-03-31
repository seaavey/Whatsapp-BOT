import { randomBytes } from "crypto"

export const name = "idml"
export const command = ["idml"]

export const run = async (m) => {
    let ids = []
    const jmlh = m.text ?? "1"
    const jmlh2 = Number(jmlh)
    if (!jmlh2) return m.reply("Masukkan jumlah IDML yang ingin dibuat.")
    if (jmlh2 > 100) return m.reply("Maksimal 100 IDML.")

    for (let i = 0; i < jmlh2; i++) {
        ids.push("n" + randomBytes(6).toString("hex"))
    }

    return m.reply(ids.join("\n"))
}

