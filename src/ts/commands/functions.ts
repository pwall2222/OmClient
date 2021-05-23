import { sendMessage } from "extra/frontFunctions.js";
import { backend, newChat, session } from "index.js";
import { createChild } from "modules/dom.js";
import { settingManager, settings } from "storage/settings.js";
import { addCommand } from "ui/chat.js";
import { videoNode } from "ui/nodes.js";
import { disconnect, skip } from "ux/disconnect.js";
import { cmd } from "./interface.js";
import { commands } from "./list.js";

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

const help = () => {
	const instructions = commands.reduce((val: string, element: command) => `${val}<b>${element.name}</b>:<br>${element.description}<br>`, "");
	createChild(".logbox", {
		tag: "p",
		args: {
			innerHTML: instructions,
			className: "command",
		},
	});
};

const theme = () => {
	const theme: themes = settings.theme == "dark" ? "light" : "dark";
	settings.theme = theme;
	setTheme(theme);
};

const text = () => {
	if (!session.started) {
		settings.video = false;
		newChat();
	}
};

const socials = () => {
	if (session.connected) {
		let msg = "";
		for (const key in settings.socials) {
			msg += `${key}: ${settings.socials[key]}\n`;
		}
		sendMessage(msg);
	}
};

const autoskip = () => (settings.autoskip = !settings.autoskip);

const stop = () => disconnect(false);

const server = () => backend.serverFinder();

const project = () => sendMessage("https://github.com/PWall2222/Omegle-Tweak");

const setting = () => addCommand(JSON.stringify(settings, null, 4));

const clear = () => cmd.clear();

const save = () => settingManager.save();

/* Requires this.command */
export { set, social, send, volume, likes };
/* Multiline */
export { help, theme, text, socials };
/* Single Line */
export { autoskip, stop, server, project, clear, save, setting };
/* Re-Exports */
export { skip, disconnect };
