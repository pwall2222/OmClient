import { events } from "./list.js";

const keyboardHandler = (keyEvent: KeyboardEvent) => {
	const targetElement = keyEvent.target as HTMLElement;
	const target = targetElement.id || targetElement.tagName.toLowerCase();

	const filter = ({ key, tag }: keyEvents) => key === keyEvent.code && tag === target;
	const command = events.find(filter);

	if (!command) {
		return;
	}

	if (command.prevent) {
		keyEvent.preventDefault();
	}
	const bindedFunction = command.exec.bind(keyEvent);
	bindedFunction();
};

export { keyboardHandler };
