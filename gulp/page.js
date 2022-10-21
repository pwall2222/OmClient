const { src, dest } = require("gulp");
const changed = require("gulp-changed");
const replace = require("gulp-replace");
const args = require("yargs").argv;

const url = args.url ?? "/";
const output = args.output ?? "server";
const pathHTML = /(?<=(src|href)=['"]).*(?=['"])/g;

const page = () => {
	return new Promise((resolve) => {
		src("src/page/**/*")
			.pipe(replace(pathHTML, `${url}$&`))
			.pipe(changed(output, { hasChanged: changed.compareContents }))
			.pipe(dest(output))
			.on("end", resolve);
	});
};

module.exports = { page };
