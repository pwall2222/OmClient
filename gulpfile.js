const { parallel } = require("gulp");
const {
	compile,
	compileWatch,
	serveFiles,
} = require("./gulp");

exports.compile = compile;

exports.compileWatch = compileWatch;

exports.default = parallel(serveFiles, compileWatch);
