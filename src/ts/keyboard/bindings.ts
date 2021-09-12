import { commandHandler } from "commands/handler.js";
import { settings } from "storage/settings.js";
import { typebox } from "ui/chat/manager.js";
import { events } from "./list.js";

const recordKey = () =>
	new Promise((resolve: (key: KeyboardEvent) => void) => {
		const handleEvent = (keyEvent: KeyboardEvent) => {
			const filter = ({ key }: keyEvents) => key === keyEvent.code;
			if (events.some(filter)) {
				return;
			}
			resolve(keyEvent);
			document.removeEventListener("keydown", handleEvent);
		};
		document.addEventListener("keydown", handleEvent);
	});

const getMode = ({ ctrlKey, altKey, shiftKey }: boolObj) => +ctrlKey * 100 + +altKey * 10 + +shiftKey;

const getKey = async () => {
	const { altKey, ctrlKey, shiftKey, code } = await recordKey();
	const mode = getMode({ ctrlKey, altKey, shiftKey });
	return { code, mode };
};

const bindKey = async (command: string) => {
	typebox.blur();
	const key = await getKey();
	const binding = { ...key, command };
	settings.bindings.push(binding);
};

const getCommand = (keyEvent: KeyboardEvent) => {
	const codeFilter = (binding: keyBind) => {
		const keyBool = binding.code === keyEvent.code;
		const { altKey, ctrlKey, shiftKey } = keyEvent;
		const mode = getMode({ ctrlKey, altKey, shiftKey });
		return keyBool && mode == binding.mode;
	};
	const command = settings.bindings.find(codeFilter);
	return command;
};

const bindingHandler = (keyEvent: KeyboardEvent) => {
	const bind = getCommand(keyEvent);
	if (!bind) {
		return;
	}
	keyEvent.preventDefault();
	commandHandler("/" + bind.command);
};

export { bindKey, bindingHandler };
