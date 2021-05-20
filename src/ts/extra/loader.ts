import { backend } from "index.js";
import { settingManager } from "storage/settings.js";
import { chatNode } from "ui/chat.js";
import { disconnectNode, videoNode } from "ui/nodes.js";
import { cmd } from "ux/commands.js";
import { keyboardHandler } from "ux/keyboard.js";
import * as twiceSkip from "ux/twiceSkip.js";

const loadAll = () => {
	addEventListeners();
	loadFromStroage();
	setObjProperties();
	backend.serverFinder();
};

const addEventListeners = () => {
	chatNode.sendbtn.addEventListener("click", chatNode.handleInput);
	disconnectNode.btn.addEventListener("click", disconnectNode.handler);
	videoNode.othervideo.addEventListener("play", videoNode.playEvent);
	document.body.addEventListener("keydown", keyboardHandler);
};

const loadFromStroage = () => {
	cmd.load();
	settingManager.load();
	twiceSkip.loadLocal();
};

const setObjProperties = () => {
	videoNode.selfvideo.muted = true;
};

export { loadAll };
