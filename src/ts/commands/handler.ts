import { settings } from "storage/settings.js";
import { cmd } from "./interface.js";
import { commands } from "./list.js";

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
	const finder = (obj: command) => obj.alias.some((alias: string) => alias === command.name);
	const commandFunction = commands.find(finder).exec;
	const bindedFunction = commandFunction.bind({ ...command });
	bindedFunction();
};

class UserCommand {
	raw: string;
	full: string[];
	name: string;
	arguments: string[];
	list: string[];
	constructor(content: string) {
		this.raw = content.slice(1);
		this.full = this.raw.split(" ");
		this.name = this.full[0];
		this.arguments = this.full.slice(1, this.full.length);
		this.list = this.arguments.join(" ").split(",");
	}
}

export { commandHandler, UserCommand };
