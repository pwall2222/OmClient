const { src, task, watch, symlink } = require("gulp");
const browserSync = require("browser-sync").create();
const tsc = require("node-typescript-compiler");

const logTask = (message, task, colorNum) => {
	const white = "\x1b[0m";
	const color = `\x1b[${colorNum}m`;
	console.log(`[${color}${task}${white}]${message}`);
};

const compile = () => tsc.compile({ outDir: "server" });

const compileWatch = () => watch("src/ts/*").on("change", compileLog);

const compileLog = async () => {
	logTask("Compiling files", "TypeScript", "36");
	await compile();
	logTask("Compiling finished", "TypeScript", "36");
};

const serveFiles = () => {
	browserSync.init({
		server: {
			baseDir: "./server/",
		},
		ghostMode: false,
	});

	watch("server/*").on("change", browserSync.reload);
};

const compileSync = () => {
	compile();
	compileWatch();
	serveFiles();
};

const init = () => src("src/page/*").pipe(symlink("server/"));

task("serve", serveFiles);

task("compile", compile);

task("compile-watch", compileWatch);

task("init", init);

task("default", compileSync);
