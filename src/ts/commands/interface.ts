import { settings } from "storage/settings.js";
import * as chatNode from "ui/chat/manager.js";

const cmd = {
	history: [],
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
			return;
		}
		cmd.changeVal(newPosition);
	},
	changeVal(newPosition: number) {
		if (cmd.history.length <= 0) {
			return;
		}
		if (cmd.history.length > newPosition) {
			cmd.position = newPosition;
			chatNode.typebox.value = cmd.history[newPosition];
		}
	},
	handleHistory(command: string) {
		cmd.position = -1;
		cmd.addToHistory(command);
	},
	addToHistory(command: string) {
		if (command === cmd.history[0]) {
			return;
		}
		cmd.history.unshift(command);
		cmd.history.splice(settings.cmd_history, 1);
		cmd.save();
	},
	load() {
		const item = JSON.parse(localStorage.getItem("history"));
		if (Array.isArray(item)) {
			cmd.history = item;
		}
	},
	save() {
		localStorage.setItem("history", JSON.stringify(cmd.history));
	},
	clear() {
		cmd.history = [];
		cmd.save();
	},
};

export { cmd };
