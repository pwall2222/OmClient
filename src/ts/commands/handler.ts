import { sendMessage } from "extra/frontFunctions.js";
import { backend, newChat, session } from "index.js";
import { createChild } from "modules/dom.js";
import { settingManager, settings } from "storage/settings.js";
import { addCommand } from "ui/chat.js";
import { videoNode } from "ui/nodes.js";
import { disconnect, skip } from "ux/disconnect.js";
import { cmd } from "./interface.js";

const commandHandler = (contents: string) => {
	const command = new UserCommand(contents);
	commandExecuter(command);
	if (contents !== cmd.commandHistory[0]) {
		cmd.commandHistory.unshift(contents);
		cmd.commandHistory.splice(settings.cmd_history, 1);
		cmd.save();
	}
	cmd.position = -1;
};

const commandExecuter = (command: UserCommand) => {
	const commands: command[] = [
		{
			name: "Help",
			alias: ["help"],
			description: "Shows the help information",
			exec() {
				const instructions = commands.reduce((val: string, element: command) => `${val}<b>${element.name}</b>:<br>${element.description}<br>`, "");
				createChild(".logbox", {
					tag: "p",
					args: {
						innerHTML: instructions,
						className: "command",
					},
				});
			},
		},
		{
			name: "Set",
			alias: ["set"],
			description: "Sets one of the avaliable settings",
			exec() {
				const parsedArgs = JSON.parse(command.arguments[1]);
				if (typeof settings[command.arguments[0]] === typeof parsedArgs) {
					settings[command.arguments[0]] = parsedArgs;
				} else {
					addCommand("Type doesn't match or property doesn't exist.");
				}
			},
		},
		{
			name: "Skip",
			alias: ["skip"],
			description: "Skips current person starting a new chat",
			exec() {
				skip();
			},
		},
		{
			name: "Disconnect",
			alias: ["disconnect"],
			description: "Disconnects from the current stranger",
			exec() {
				disconnect();
			},
		},
		{
			name: "Save",
			alias: ["save"],
			description: "Saves settings to localStorage",
			exec() {
				settingManager.save();
			},
		},
		{
			name: "Text",
			alias: ["text"],
			description: "Passes mode to text and makes a new chat",
			exec() {
				if (!session.started) {
					settings.video = false;
					newChat();
				}
			},
		},
		{
			name: "Socials",
			alias: ["socials"],
			description: "Sends socials to stranger",
			exec() {
				if (session.connected) {
					let msg = "";
					for (const key in settings.socials) {
						msg += `${key}: ${settings.socials[key]}\n`;
					}
					sendMessage(msg);
				}
			},
		},
		{
			name: "Social",
			alias: ["social", "sendSocial"],
			description: "Sends one social to stranger",
			exec() {
				if (command.arguments[0] && settings.socials[command.arguments[0]] !== undefined) {
					sendMessage(`${command.arguments[0]}: ${settings.socials[command.arguments[0]]}`);
				}
			},
		},
		{
			name: "Autoskip",
			alias: ["autoskip"],
			description: "Switches autoskip",
			exec() {
				settings.autoskip = !settings.autoskip;
			},
		},
		{
			name: "Send",
			alias: ["send"],
			description: "Sends a message in chat",
			exec() {
				if (session.connected) {
					sendMessage(command.arguments.join(" "));
				}
			},
		},
		{
			name: "Set volume",
			alias: ["volume", "vol"],
			description: "Sets stranger volume",
			exec() {
				const num = Number(command.arguments[0]);
				if (num >= 0 && num <= 100) {
					videoNode.setVolume(num);
				}
			},
		},
		{
			name: "Stop",
			alias: ["stop"],
			description: "Disconnects from current stranger and stops rerolling temporally",
			exec() {
				disconnect(false);
			},
		},
		{
			name: "Server",
			alias: ["server"],
			description: "Get a server for running the backend",
			exec() {
				backend.serverFinder();
			},
		},
		{
			name: "Send Project",
			alias: ["project"],
			description: "Sends project url to stranger",
			exec() {
				sendMessage("https://github.com/PWall2222/Omegle-Tweak");
			},
		},
		{
			name: "Settings",
			alias: ["settings"],
			description: "Displays settings in chat",
			exec() {
				addCommand(JSON.stringify(settings, null, 4));
			},
		},
		{
			name: "Clear Command History",
			alias: ["clear_history"],
			description: "Clears the command history",
			exec() {
				cmd.clear();
			},
		},
		{
			name: "Theme",
			alias: ["theme"],
			description: "Sets the theme",
			exec() {
				const theme: themes = settings.theme == "dark" ? "light" : "dark";
				settings.theme = theme;
				setTheme(theme);
			},
		},
		{
			name: "Likes",
			alias: ["likes", "set_likes"],
			description: "Sets likes",
			exec() {
				const likes = command.arguments.join(" ").split(",");
				settings.likes = likes;
			},
		},
	];
	commands.find((obj: command) => obj.alias.some((alias: string) => alias === command.name))?.exec();
};

class UserCommand {
	raw: string;
	full: string[];
	name: string;
	arguments: string[];
	constructor(content: string) {
		this.raw = content.slice(1);
		this.full = this.raw.split(" ");
		this.name = this.full[0];
		this.arguments = this.full.slice(1, this.full.length);
	}
}

export { commandHandler };
