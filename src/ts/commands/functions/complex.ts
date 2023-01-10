import { commands } from "@/commands/list.js";
import { sendMessage } from "@/extra/frontFunctions.js";
import { newChat, session } from "@/index.js";
import { settings } from "@/storage/settings.js";
import { addChild } from "@/ui/chat/add.js";
import { text as enableText, video as enableVideo } from "@/ui/modes.js";

const help = () => {
	const instructions = commands.reduce((val: string, element: command) => `${val}<b>${element.name}</b>:<br>${element.description}<br>`, "");
	addChild({
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
	if (session.started) {
		return;
	}
	settings.video = false;
	enableText();
	newChat();
};

const video = () => {
	if (session.started) {
		return;
	}
	settings.video = true;
	enableVideo();
	newChat();
};

const socials = () => {
	if (session.connected) {
		return;
	}
	let msg = "";
	for (const key in settings.socials) {
		msg += `${key}: ${settings.socials[key]}\n`;
	}
	sendMessage(msg);
};

export { help, theme, text, video, socials };
