import { commandHandler } from "commands/handler.js";
import { settings } from "storage/settings.js";
import { typebox } from "ui/chat/manager.js";
import { events } from "./list.js";

const recordKeyPromise = (resolve: (key: { code: string; mode: number }) => void) => {
	const handleEvent = (keyEvent: KeyboardEvent) => {
		const { altKey, ctrlKey, shiftKey, code } = keyEvent;
		const mode = getMode({ ctrlKey, altKey, shiftKey });
		const filterEvents = ({ key }: keyEvents) => key === code;
		const filterBinds = (binding: keyBind) => binding.code == code && binding.mode == mode;
		const filters = events.some(filterEvents) || settings.bindings.some(filterBinds);
		if (filters) {
			return;
		}
		resolve({ code, mode });
		document.removeEventListener("keydown", handleEvent);
	};
	document.addEventListener("keydown", handleEvent);
};

const recordKey = () => new Promise(recordKeyPromise);

const getMode = (num: boolObj) => +num.ctrlKey * 100 + +num.altKey * 10 + +num.shiftKey;

const bindKey = async (command: string) => {
	typebox.blur();
	const key = await recordKey();
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
