import { mess } from "../../common/mess.js";
import { func } from "@seaavey/scapers";

export const name = ["close", "open"];
export const command = name;
export const category = "Admins";

export const run = async (m, { sock }) => {
    const setting = m.command === "open" ? "not_announcement" : "announcement"
    const msg = m.command === "open" ? mess.group.open : mess.group.close
  
    try {
      await sock.groupSettingUpdate(m.from, setting)
      m.reply(msg)
    } catch (err) {
      m.reply(func.jsonformat(err))
    }
};

export const isGroup = true;
export const isAdmin = true;
export const isBotAdmin = true;
