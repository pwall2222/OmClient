const { watch, parallel } = require("gulp");
const { compileTS } = require("./typescript.js");
const { page } = require("./page.js");
const { userscript } = require("./userscript.js");

const logTask = (message, task, colorNum) => {
	const white = "\x1b[0m";
	const color = `\x1b[${colorNum}m`;
	console.log(`[${color}${task}${white}]${message}`);
};

const compileWatch = () => {
	compile();
	watch("src/ts/**/*").on("change", compileTSLog);
	watch("src/page/**/*").on("change", pageLog);
};

const compileTSLog = async () => {
	logTask("Compiling files", "TypeScript", "36");
	await compileTS();
	logTask("Compiling finished", "TypeScript", "36");
};

const pageLog = async () => {
	logTask("Copying page files", "Page", "36");
	await page();
	logTask("Copying finished", "Page", "36");
};

const compile = parallel(userscript, page, compileTS);

module.exports = { compile, compileWatch };
