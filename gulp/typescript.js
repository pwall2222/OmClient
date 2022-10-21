const { src, dest } = require("gulp");
const changed = require("gulp-changed");
const replace = require("gulp-replace");
const sourceMaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const args = require("yargs").argv;

const tsProject = ts.createProject("tsconfig.json");

const url = args.url ?? "/";
const output = args.output ?? "server";
const pathRegEx = /(?<=(import|export)(?:.* from |\(| )["'])[^.].*(?=["']\)?)/g;

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

module.exports = { compileTS };
