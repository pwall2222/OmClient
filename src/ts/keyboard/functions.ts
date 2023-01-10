import * as cmd from "@/commands/interface.js";
import { session } from "@/index.js";
import { settings } from "@/storage/settings.js";
import * as chatNode from "@/ui/chat/manager.js";
import { handleInput } from "@/ui/chat/manager.js";
import { dchandler } from "@/ui/nodes/disconnect.js";
import { disconnect, skip } from "@/ux/disconnect.js";

const send = function (this: KeyboardEvent) {
	if (this.shiftKey) {
		return;
	}
	handleInput();
};

const escape = function (this: KeyboardEvent) {
	if (this.ctrlKey) {
		disconnect(false);
		return;
	}
	const shiftBool = this.shiftKey && session.connected;
	if (shiftBool || settings.skip_with_esc) {
		skip();
		return;
	}
	dchandler();
};

const slash = () => {
	if (chatNode.typebox.value !== "") {
		return;
	}
	chatNode.typebox.focus();
};

const up = () => cmd.next();

const down = () => cmd.previous();

export { skip } from "@/ux/disconnect.js";
export { send, escape, slash, up, down };
