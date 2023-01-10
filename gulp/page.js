const { src, dest } = require("gulp");
const changed = require("gulp-changed");
const args = require("yargs").argv;

const output = args.output ?? "server";

const page = () => {
	return new Promise((resolve) => {
		src("src/page/**/*")
			.pipe(changed(output, { hasChanged: changed.compareContents }))
			.pipe(dest(output))
			.on("end", resolve);
	});
};

module.exports = { page };
