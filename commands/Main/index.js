import { language } from "../../configuration.js";
import { introduction } from "../../common/mess.js";
import { fv } from "../../common/fake.js";
export const name = "bot";
export const command = ["bot"];
export const category = "Mains";
export const run = async (m) => {
    const intro = introduction[language];
    m.reply({
        text: intro,
        footer: "Powered By Seaavey Project",
        buttons: [
            {
                buttonId: ".menu",
                buttonText: {
                    displayText: "⚡︎ My Menu ⚡︎"
                },
                type: 1
            }
        ],
        viewOnce: true
    }, fv("My Developer"));
};
