const { compile, compileWatch } = require("./compile.js");
const { serveFiles } = require("./server.js")

module.exports = {
	compile,
	compileWatch,
	serveFiles,
};
