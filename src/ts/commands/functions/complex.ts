import { commands } from "commands/list.js";
import { sendMessage } from "extra/frontFunctions.js";
import { newChat, session } from "index.js";
import { createChild } from "modules/dom.js";
import { settings } from "storage/settings.js";

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

export { help, theme, text, socials };
