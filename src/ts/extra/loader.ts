import { backend } from "index.js";
import { settingManager } from "storage/settings.js";
import { chatNode } from "ui/chat.js";
import { disconnectNode, videoNode } from "ui/nodes.js";
import { cmd } from "ux/commands.js";
import { keyboardHandler } from "ux/keyboard.js";

const loadAll = () => {
	addEventListeners();
	loadFromStroage();
	backend.serverFinder();
};

const addEventListeners = () => {
	chatNode.sendbtn.addEventListener("click", chatNode.handleInput);
	videoNode.othervideo.addEventListener("play", videoNode.playEvent);
	disconnectNode.btn.addEventListener("click", disconnectNode.handler);
	document.body.addEventListener("keydown", keyboardHandler);
};

const loadFromStroage = () => {
	cmd.load();
	settingManager.load();
};

export { loadAll };
