const { src, dest } = require("gulp");
const replace = require("gulp-replace");
const args = require("yargs").argv;

const url = args.url ?? "/";
const output = args.output ?? "server";
const replacePath = "{magicurl}";

const userscript = () => {
	return new Promise((resolve) => {
		src("*.user.js")
			.pipe(replace(replacePath, `${url}`))
			.pipe(dest(output))
			.on("end", resolve);
	});
};

module.exports = { userscript };
