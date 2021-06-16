import { events } from "./list.js";

const keyboardHandler = (keyEvent: KeyboardEvent) => {
	const targetElement = keyEvent.target as HTMLElement;
	const target = targetElement.id || targetElement.tagName.toLowerCase();

	const filter = (element: keyEvents) => element.key === keyEvent.code && element.tag === target;
	const command = events.find(filter);

	if (command?.prevent) {
		keyEvent.preventDefault();
	}
	const bindedFunction = command.exec.bind(keyEvent);
	bindedFunction();
};

export { keyboardHandler };
