import axios from "axios";
import FormData from "form-data";
import sharp from "sharp";
import fs from "fs";
import * as cheerio from "cheerio";
export function convertDurationToSeconds(duration) {
    const [m, s] = duration.split(":");
    return parseInt(m) * 60 + parseInt(s);
}

export const spotifydl = async url => {
    url = url.replace("intl-id/", "")
    const id = url.split("track/")[1].split("?")[0]
    const res = await axios.get(`https://spowload.com/spotify/track-${id}`, {
      withCredentials: true
    })
    const info = await axios.get(`https://api.fabdl.com/spotify/get?url=${url}`).then(res => res.data.result)
    const cookies = res.headers["set-cookie"].map(cookie => cookie.split(";")[0]).join("; ")
    const csrf = cheerio.load(res.data)('meta[name="csrf-token"]').attr("content")
    const down = await axios.post("https://spowload.com/convert", { urls: `https://open.spotify.com/track/${id}`, cover: "https://i.scdn.co/image/ab67616d0000b27326458812554408283d9e2bd1" }, { headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrf, Cookie: cookies } }).then(res => res.data)
    if (down.erorr) throw "Data Tidak Ditemukan"
    return {
      info,
      url: down.url
    }
  }
export const Upscale = async (image) => {
    const form = new FormData();
    const { width, height } = await sharp(image).metadata();
    form.append("desiredHeight", `${height * 4}`);
    form.append("desiredWidth", `${width * 4}`);
    form.append("anime", "false");
    form.append("outputFormat", "jpeg");
    form.append("colorMode", "RGB");
    form.append("compressionLevel", "Low");
    form.append("image_file", fs.createReadStream(image));
    return await axios
        .post("https://api.upscalepics.com/upscale-free", form, {
        headers: {
            origin: "https://upscalepics.com",
            referer: "https://upscalepics.com/",
            ...form.getHeaders()
        }
    })
        .then(res => res.data);
};
/**
 * Convert a given text to Morse code
 *
 * @param {string} text - text to be converted to Morse code
 * @returns {string} Morse code representation of the given text
 */
export function toMorse(text) {
    return text
        .toUpperCase()
        .split("")
        .map(char => {
        return morse[char] || "";
    })
        .join(" ");
}
/**
 * Converts morse code into plain text.
 * @param {string} morseCode - The morse code to be converted.
 * @returns {string} - The converted plain text.
 */
export function toText(morseCode) {
    return morseCode
        .split(" ")
        .map((char, i) => {
        const key = Object.keys(morse).find(key => morse[key] === char);
        return i === 0 ? key.toUpperCase() : key.toLowerCase();
    })
        .join("");
}
const morse = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",
    0: "-----",
    ",": "--..--",
    ".": ".-.-.-",
    "?": "..--..",
    "/": "-..-.",
    "-": "-....-",
    "(": "-.--.",
    ")": "-.--.-",
    " ": "/"
};
