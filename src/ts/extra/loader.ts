import * as cmd from "commands/interface.js";
import { backend } from "index.js";
import { bindingHandler } from "keyboard/bindings.js";
import { keyboardHandler } from "keyboard/handler.js";
import { settingManager } from "storage/settings.js";
import * as chatNode from "ui/chat/manager.js";
import * as disconnectNode from "ui/nodes/disconnect.js";
import * as videoNode from "ui/nodes/video.js";
import * as twiceSkip from "ux/twiceSkip.js";
import { typingHanlder } from "ux/typing.js";

const loadAll = () => {
	addEventListeners();
	loadFromStroage();
	setObjProperties();
	backend.serverFinder();
};

const addEventListeners = () => {
	chatNode.typebox.addEventListener("input", typingHanlder);
	chatNode.sendbtn.addEventListener("click", chatNode.handleInput);
	disconnectNode.dcbtn.addEventListener("click", disconnectNode.dchandler);
	videoNode.othervideo.addEventListener("play", videoNode.playEvent);
	document.body.addEventListener("keydown", keyboardHandler);
	document.body.addEventListener("keydown", bindingHandler);
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
