import { timeZone } from "../configuration.js"
import chalk from "chalk"
import moment from "moment-timezone"
class Logger {
  prefix
  constructor(prefix = "LOG") {
    this.prefix = chalk.blue.bold(`[${prefix}]`)
  }
  _getTime() {
    return chalk.gray(`[${moment().tz(timeZone).format("HH:mm:ss")}]`)
  }
  log(message) {
    console.log(`${this.prefix} ${chalk.white(message)}`)
  }
  info(message) {
    console.info(`${chalk.green.bold("[INFO]")} ${chalk.white(message)}`)
  }
  warn(message) {
    console.warn(`${this._getTime()} ${chalk.yellow.bold("[WARN]")} ${chalk.yellow(message)}`)
  }
  error(message) {
    console.error(`${this._getTime()} ${chalk.red.bold("[ERROR]")} ${chalk.red(message)}`)
  }
}
export default new Logger();
