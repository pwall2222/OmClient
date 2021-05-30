const { src, task, watch, dest } = require("gulp");
const changed = require("gulp-changed");
const replace = require("gulp-replace");
const ts = require("gulp-typescript");
const browserSync = require("browser-sync").create();
const args = require("yargs").argv;

const tsProject = ts.createProject("tsconfig.json");

const url = args.url ?? "/";
const pathRegEx = /(?<=(import|export)(?:.* from |\(| )["'])[^.].*(?=["']\)?)/g;
const pathHTML = /(?<=(src|href)=['"]).*(?=['"])/g;

const logTask = (message, task, colorNum) => {
	const white = "\x1b[0m";
	const color = `\x1b[${colorNum}m`;
	console.log(`[${color}${task}${white}]${message}`);
};

const markdown = () => {
	return new Promise((resolve) => {
		src("src/page/**/*")
			.pipe(replace(pathHTML, `${url}$&`))
			.pipe(changed("server", { hasChanged: changed.compareContents }))
			.pipe(dest("server"))
			.on("end", resolve);
	});
};

const compile = async () => {
	markdown();
	compileTS();
};

const compileTS = () => {
	return new Promise((resolve) => {
		src("src/ts/**")
			.pipe(tsProject())
			.on("error", () => {})
			.pipe(replace(pathRegEx, `${url}$&`))
			.pipe(changed("server", { hasChanged: changed.compareContents }))
			.pipe(dest("server"))
			.on("end", resolve);
	});
};

const compileWatch = () => {
	watch("src/ts/**/*").on("change", compileLog);
	watch("src/page/**/*").on("change", markdownLog);
};

const compileLog = async () => {
	logTask("Compiling files", "TypeScript", "36");
	await compileTS();
	logTask("Compiling finished", "TypeScript", "36");
};

const markdownLog = async () => {
	logTask("Copying markdown files", "MarkDown", "36");
	await markdown();
	logTask("Copying finished", "MarkDown", "36");
};

const serveFiles = () => {
	browserSync.init({
		server: {
			baseDir: "./server/",
		},
		open: false,
		ui: false,
		notify: false,
		ghostMode: false,
	});

	watch("server/**/*").on("change", browserSync.reload);
};

const compileSync = () => {
	compileTS();
	markdown();
	compileWatch();
	serveFiles();
};

task("serve", serveFiles);

task("compile", compile);

task("compile-watch", compileWatch);

task("default", compileSync);
