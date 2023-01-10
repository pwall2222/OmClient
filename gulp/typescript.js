const { src, dest } = require("gulp");
const changed = require("gulp-changed");
const alias = require('@gulp-plugin/alias');
const sourceMaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const args = require("yargs").argv;

const tsProject = ts.createProject("tsconfig.json");

const output = args.output ?? "server";

const compileTS = () => {
	return new Promise((resolve) => {
		src("src/ts/**")
			.pipe(alias(tsProject))
			.pipe(sourceMaps.init())
			.pipe(tsProject())
			.on("error", () => {})
			.pipe(sourceMaps.write("", { sourceRoot: "" }))
			.pipe(changed(output, { hasChanged: changed.compareContents }))
			.pipe(dest(output))
			.on("end", resolve);
	});
};

module.exports = { compileTS };
