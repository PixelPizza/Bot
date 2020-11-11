const {WebhookClient} = require('discord.js');
const chalk = require('chalk');

exports.notice = (title = "", text) => {
    console.log(chalk.gray(title), text);
    this.sendServerLog(title, text);
}
exports.log = (title = "", text = "") => {
    console.log(chalk.blue(title), text);
    this.sendServerLog(title, text);
}
exports.info = (title = "", text = "") => {
    console.log(chalk.blueBright(title), text);
    this.sendServerLog(title, text);
}
exports.success = (title = "", text = "") => {
    console.log(chalk.green(title), text);
    this.sendServerLog(title, text);
}
exports.error = (title = "", text = "") => {
    console.error(chalk.red(title), text);
    this.sendServerLog(title, text);
}
exports.fatal = (title = "", text = "") => {
    console.error(chalk.redBright(title), text);
    this.sendServerLog(title, text);
}
exports.warn = (title = "", text = "") => {
    console.warn(chalk.yellow(title), text);
    this.sendServerLog(title, text);
}
exports.count = label => console.count(label);
exports.resetCount = label => console.countReset(label);
exports.clear = () => {
    console.clear();
    this.notice('Clear', 'The console was cleared');
}
exports.sendServerLog = async (title = "", text) => {
    const logger = new WebhookClient("776160363925733379", "4ebXak6MU8G-KFChjDAUOhofBFHLJKBrCT6PFG0X30XyJnXY9llAFnKCrCFkpuET2sya");
    await logger.edit({
        name: "Console",
        reason: "Just to be sure the name is right"
    });
    logger.send(`\`\`\`md\n[${title}]: ${text}\n\`\`\``);
}