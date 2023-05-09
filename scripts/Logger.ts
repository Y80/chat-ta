enum StyleEnum {
  RESET = '\x1b[0m',
  RED = '\x1b[31m',
  GREEN = '\x1b[32m',
  YELLOW = '\x1b[33m',
  BLUE = '\x1b[34m',

  BOLD = '\x1b[1m',
  UNDERLINED = '\x1b[4m',
}

export default class Logger {
  static style = StyleEnum
  static log(msg: string, color?: StyleEnum) {
    console.log(`${color}${msg}${StyleEnum.RESET}`)
  }
}
