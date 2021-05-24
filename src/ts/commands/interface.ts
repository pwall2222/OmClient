import * as chatNode from "ui/chat/manager.js";

const cmd = {
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
			return;
		}
		cmd.changeVal(newPosition);
	},
	changeVal(newPosition: number) {
		if (cmd.commandHistory.length <= 0) {
			return;
		}
		if (cmd.commandHistory.length > newPosition) {
			cmd.position = newPosition;
			chatNode.typebox.value = cmd.commandHistory[newPosition];
		}
	},
	load() {
		const item = JSON.parse(localStorage.getItem("history"));
		if (Array.isArray(item)) {
			cmd.commandHistory = item;
		}
	},
	save() {
		localStorage.setItem("history", JSON.stringify(cmd.commandHistory));
	},
	clear() {
		cmd.commandHistory = [];
		cmd.save();
	},
};

export { cmd };
