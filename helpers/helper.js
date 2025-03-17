import fs from "fs"
import path from "path"
import { pathToFileURL } from "url"

export default async function loadCommands(dir) {
  const js = {}
  const helperPath = path.join(dir)
  const commandFiles = fs.readdirSync(helperPath).filter(v => {
    const fullPath = path.join(helperPath, v)
    return fs.lstatSync(fullPath).isDirectory()
  })
  for (const v of commandFiles) {
    const directoryPath = path.join(helperPath, v)
    const files = fs.readdirSync(directoryPath)
    const jsFiles = files.filter(f => f.endsWith(".ts") || f.endsWith(".js"))
    js[v] = jsFiles.map(f => path.join(directoryPath, f))
  }
  const commandFilesList = Object.values(js).flat()
  const data = await Promise.all(
    commandFilesList.map(async filePath => {
      const module = await import(pathToFileURL(filePath).href)
      return {
        ...module
      }
    })
  )
  return data
}
