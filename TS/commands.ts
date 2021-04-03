import { chatNode } from "./chat.js";
import { skip, disconnect, stopAutoskip, sendMessage } from "./frontFunctions.js";
import { createChild } from "./functions.js";
import { newChat, session } from "./index.js";
import { videoNode } from "./nodes.js";
import { settings, settingManager } from "./settings.js";

const cmd = {
	handler(contents: string) {
		const fullCommand = contents.slice(1).split(" ");
		const commandName = fullCommand[0];
		const args = fullCommand.slice(1, fullCommand.length - 0);
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
					const parsedArgs = JSON.parse(args[1]);
					if (typeof settings[args[0]] === typeof parsedArgs) {
						settings[args[0]] = parsedArgs;
					} else {
						console.log("Wrong type");
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
					if (!session.connected) {
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
					if (session.active) {
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
					if (args[0]) {
						sendMessage(`${args[0]}: ${settings.socials[args[0]]}`);
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
					if (session.active) {
						sendMessage(args.join(" "));
					}
				},
			},
			{
				name: "Set volume",
				alias: ["volume", "vol"],
				description: "Sets stranger volume",
				exec() {
					const num = Number(args[0]);
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
					stopAutoskip();
				},
			},
		];
		commands.find((obj: command) => obj.alias.some((alias: string) => alias === commandName))?.exec();
		if (contents !== cmd.commandHistory[0]) {
			cmd.commandHistory.unshift(contents);
			cmd.commandHistory.splice(settings.cmd_history, 1);
			cmd.save();
		}
		cmd.position = -1;
	},
	commandHistory: [],
	position: -1,
	current: "",
	next() {
		const newPosition = cmd.position + 1;
		if (cmd.position === -1) {
			cmd.current = chatNode.typebox.value;
		}
		cmd.changeVal(newPosition);
	},
	previous() {
		const newPosition = cmd.position - 1;
		if (newPosition <= -1) {
			chatNode.typebox.value = cmd.current;
			cmd.position = -1;
		} else {
			cmd.changeVal(newPosition);
		}
	},
	changeVal(newPosition: number) {
		if (cmd.commandHistory.length > 0 && cmd.commandHistory.length > newPosition) {
			cmd.position = newPosition;
			chatNode.typebox.value = cmd.commandHistory[newPosition];
		}
	},
	load() {
		const item = JSON.parse(localStorage.getItem("history"));
		if (item) {
			cmd.commandHistory = item;
		}
	},
	save() {
		localStorage.setItem("history", JSON.stringify(cmd.commandHistory));
	},
};

export { cmd };
