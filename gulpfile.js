const { src, task, watch, dest } = require("gulp");
const changed = require("gulp-changed");
const replace = require("gulp-replace");
const sourceMaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const browserSync = require("browser-sync").create();
const args = require("yargs").argv;
const https = require("https");

const tsProject = ts.createProject("tsconfig.json");

const url = args.url ?? "/";
const output = args.output ?? "server";
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
			.pipe(changed(output, { hasChanged: changed.compareContents }))
			.pipe(dest(output))
			.on("end", resolve);
	});
};

const compile = async () => {
	await markdown();
	await compileTS();
};

const compileTS = () => {
	return new Promise((resolve) => {
		src("src/ts/**")
			.pipe(sourceMaps.init())
			.pipe(tsProject())
			.on("error", () => {})
			.pipe(sourceMaps.write("", { sourceRoot: "" }))
			.pipe(replace(pathRegEx, `${url}$&`))
			.pipe(changed(output, { hasChanged: changed.compareContents }))
			.pipe(dest(output))
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

const corsProxy = (req, res, next) => {
	const hostarr = req.headers["host"].split(".");
	const subdomain = hostarr[0];
	const excludes = ["www", "localhost"];
	if (excludes.includes(subdomain) || !isNaN(subdomain)) {
		next();
		return;
	}

	const { port, method, headers, url: path } = req;
	const host = `${subdomain}.omegle.com`;
	headers["host"] = host;

	const proxyRequest = https.request({ port, host, method, headers, path });

	proxyRequest.addListener("response", (proxyResponse) => {
		proxyResponse.on("data", (chunk) => res.write(chunk, "binary"));
		proxyResponse.on("end", () => res.end());
		proxyResponse.headers["access-control-allow-origin"] = "*";
		res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
	});

	proxyRequest.on("error", () => {
		res.statusCode = "404";
		res.end();
	});

	req.addListener("data", (chunk) => proxyRequest.write(chunk, "binary"));

	req.addListener("end", () => proxyRequest.end());
};

const serveFiles = () => {
	browserSync.init({
		server: {
			baseDir: "./server/",
		},
		middleware: corsProxy,
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
