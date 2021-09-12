import { events } from "./list.js";

const getCommand = (keyEvent: KeyboardEvent) => {
	const codeFilter = ({ key }: keyEvents) => key === keyEvent.code;
	const command = events.find(codeFilter);

	if (!command) {
		return { prevent: false, exec: () => "" };
	}

	if (command["global"]) {
		return command;
	}

	const targetElement = keyEvent.target as HTMLElement;
	const target = targetElement.id || targetElement.tagName.toLowerCase();

	if (command["tag"] === target) {
		return command;
	}
};

const keyboardHandler = (keyEvent: KeyboardEvent) => {
	const command = getCommand(keyEvent);
	if (command.prevent) {
		keyEvent.preventDefault();
	}
	command.exec.apply(keyEvent);
};

export { keyboardHandler };
