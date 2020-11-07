const chalk = require('chalk');

exports.notice = (title = "", text = "") => console.log(chalk.gray(title), text);
exports.log = (title = "", text = "") => console.log(chalk.blue(title), text);
exports.info = (title = "", text = "") => console.log(chalk.blueBright(title), text);
exports.success = (title = "", text = "") => console.log(chalk.green(title), text);
exports.error = (title = "", text = "") => console.error(chalk.red(title), text);
exports.fatal = (title = "", text = "") => console.error(chalk.redBright(title), text);
exports.warn = (title = "", text = "") => console.warn(chalk.yellow(title), text);
exports.count = label => console.count(label);
exports.resetCount = label => console.countReset(label);
exports.clear = () => {
    console.clear();
    this.notice('Clear', 'The console was cleared');
}