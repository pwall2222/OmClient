const { src, dest } = require("gulp");
const replace = require("gulp-replace");
const args = require("yargs").argv;

const url = args.url ?? "/";
const version = args.tag ?? "1.0";

const output = args.output ?? "server";
const replacePath = "{magicurl}";
const versionString = "{version}";

const userscript = () => {
	return new Promise((resolve) => {
		src("*.user.js")
			.pipe(replace(replacePath, url))
			.pipe(replace(versionString, version))
			.pipe(dest(output))
			.on("end", resolve);
	});
};

module.exports = { userscript };
