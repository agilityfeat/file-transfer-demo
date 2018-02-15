import chalk from 'chalk';

export const green = (str) => chalk.green.bold(str)
export const red = (str) => chalk.red.bold(str)
export const blue = (str) => chalk.blue.bold(str)
export const yellow = (str) => chalk.yellow.bold(str)

export const logSuccess = (...messages) => {
  console.log(`[${green('OK')}] `, ...messages);
}

export const logError = (...messages) => {
  console.log(`[${red('ERR')}]`, ...messages);
}

export const logInfo = (...messages) => {
  console.log(`[${yellow('INF')}]`, ...messages);
}
