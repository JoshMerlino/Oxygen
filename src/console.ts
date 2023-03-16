import chalk from "npm:chalk";

// Add methods to console.
console.info = (...args): unknown => console.log(chalk.blue("[ INFO ]"), ...args);
console.error = (...args): unknown => console.log(chalk.red("[ ERROR ]"), ...args);
console.warn = (...args): unknown => console.log(chalk.yellow("[ WARN ]"), ...args);

export default console;
