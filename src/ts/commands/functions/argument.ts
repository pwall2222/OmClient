import { UserCommand } from "commands/handler.js";
import { sendMessage } from "extra/frontFunctions.js";
import { session } from "index.js";
import { bindKey } from "keyboard/bindings.js";
import { settings } from "storage/settings.js";
import { addCommand } from "ui/chat/add.js";
import { setVolume } from "ui/nodes/video.js";

const likes = function (this: UserCommand) {
	settings.likes = this.list;
};

const social = function (this: UserCommand) {
	const arg = this.arguments[0];
	if (arg && settings.socials[arg] !== undefined) {
		sendMessage(`${arg}: ${settings.socials[arg]}`);
	}
};

const set = function (this: UserCommand) {
	const parsedArgs = JSON.parse(this.arguments[1]);
	const arg = this.arguments[0];
	if (typeof settings[arg] === typeof parsedArgs) {
		settings[arg] = parsedArgs;
		return;
	}
	addCommand("Type doesn't match or property doesn't exist.");
};

const send = function (this: UserCommand) {
	if (!session.connected) {
		return;
	}
	sendMessage(this.arguments.join(" "));
};

const volume = function (this: UserCommand) {
	const num = Number(this.arguments[0]);
	if (num >= 0 && num <= 100) {
		setVolume(num);
	}
};

const bind = function (this: UserCommand) {
	const args = this.arguments.join(" ");
	const command = args.replace(/%%/g, "&&");
	bindKey(command);
};

export { set, social, send, volume, likes, bind };
