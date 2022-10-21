const { watch } = require("gulp");
const browserSync = require("browser-sync").create();
const https = require("https");

const getSubdomain = (host) => {
	const portLess = host.split(":")[0];
	const hostSplit = portLess.split(".");
	return hostSplit[0];
};

const corsProxy = (req, res, next) => {
	const subdomain = getSubdomain(req.headers["host"]);
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

module.exports = { serveFiles };
