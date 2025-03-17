import { readFileSync } from "fs"
let charMap = {}
const myfont = readFileSync("db/font.json", "utf-8")
charMap = JSON.parse(myfont)
export const delay = ms => new Promise(res => setTimeout(res, ms))
export const jsonformat = obj => JSON.stringify(obj, null, 2)
export const StringToURL = str => str.match(/\bhttps?:\/\/\S+/gi)
export const toUpper = str => str.toUpperCase()
export const changeFont = text => text.replace(/[a-z]/gi, char => charMap[char.toLowerCase()] || char)
export const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)]
