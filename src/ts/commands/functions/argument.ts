import { sendMessage } from "extra/frontFunctions.js";
import { session } from "index.js";
import { settings } from "storage/settings.js";
import { addCommand } from "ui/chat/add.js";
import { setVolume } from "ui/nodes/video.js";

const likes = function () {
	const likes = this.command.arguments.join(" ").split(",");
	settings.likes = likes;
};

const social = function () {
	const arg = this.command.arguments[0];
	if (arg && settings.socials[arg] !== undefined) {
		sendMessage(`${arg}: ${settings.socials[arg]}`);
	}
};

const set = function () {
	const parsedArgs = JSON.parse(this.command.arguments[1]);
	const arg = this.command.arguments[0];
	if (typeof settings[arg] === typeof parsedArgs) {
		settings[arg] = parsedArgs;
	} else {
		addCommand("Type doesn't match or property doesn't exist.");
	}
};

const send = function () {
	if (session.connected) {
		sendMessage(this.command.arguments.join(" "));
	}
};

const volume = function () {
	const num = Number(this.command.arguments[0]);
	if (num >= 0 && num <= 100) {
		setVolume(num);
	}
};

export { set, social, send, volume, likes };
