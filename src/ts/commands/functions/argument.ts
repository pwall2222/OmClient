import { sendMessage } from "extra/frontFunctions.js";
import { session } from "index.js";
import { settings } from "storage/settings.js";
import { addCommand } from "ui/chat/add.js";
import { videoNode } from "ui/video.js";

const likes = function () {
	const likes = this.command.arguments.join(" ").split(",");
	settings.likes = likes;
};

const social = function () {
	if (this.command.arguments[0] && settings.socials[this.command.arguments[0]] !== undefined) {
		sendMessage(`${this.command.arguments[0]}: ${settings.socials[this.command.arguments[0]]}`);
	}
};

const set = function () {
	const parsedArgs = JSON.parse(this.command.arguments[1]);
	if (typeof settings[this.command.arguments[0]] === typeof parsedArgs) {
		settings[this.command.arguments[0]] = parsedArgs;
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
		videoNode.setVolume(num);
	}
};

export { set, social, send, volume, likes };
