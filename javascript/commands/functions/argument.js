import { sendMessage } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.1/javascript/extra/frontFunctions.js";
import { session } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.1/javascript/index.js";
import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.1/javascript/storage/settings.js";
import { addCommand } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.1/javascript/ui/chat/add.js";
import { setVolume } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.1/javascript/ui/nodes/video.js";
const likes = function () {
	settings.likes = this.list;
};
const social = function () {
	const arg = this.arguments[0];
	if (arg && settings.socials[arg] !== undefined) {
		sendMessage(`${arg}: ${settings.socials[arg]}`);
	}
};
const set = function () {
	const parsedArgs = JSON.parse(this.arguments[1]);
	const arg = this.arguments[0];
	if (typeof settings[arg] === typeof parsedArgs) {
		settings[arg] = parsedArgs;
		return;
	}
	addCommand("Type doesn't match or property doesn't exist.");
};
const send = function () {
	if (!session.connected) {
		return;
	}
	sendMessage(this.arguments.join(" "));
};
const volume = function () {
	const num = Number(this.arguments[0]);
	if (num >= 0 && num <= 100) {
		setVolume(num);
	}
};
export { set, social, send, volume, likes };

//# sourceMappingURL=argument.js.map
