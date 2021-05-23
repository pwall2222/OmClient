const { src, task, watch, symlink, dest } = require("gulp");
const changed = require("gulp-changed");
const replace = require("gulp-replace");
const ts = require("gulp-typescript");
const browserSync = require("browser-sync").create();
const args = require("yargs").argv;

const tsProject = ts.createProject("tsconfig.json");

const url = args.url ?? "/";
const pathRegEx = /(?<=(import|export)(?:.* from |\(| )["'])[^.].*(?=["']\)?)/g;

const logTask = (message, task, colorNum) => {
	const white = "\x1b[0m";
	const color = `\x1b[${colorNum}m`;
	console.log(`[${color}${task}${white}]${message}`);
};

const compile = () => {
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

const compileWatch = () => watch("src/ts/**/*").on("change", compileLog);

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
		open: false,
		ui: false,
		notify: false,
		ghostMode: false,
	});

	watch("server/**/*").on("change", browserSync.reload);
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
