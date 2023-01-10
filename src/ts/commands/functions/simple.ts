import * as cmd from "@/commands/interface.js";
import { sendMessage } from "@/extra/frontFunctions.js";
import { backend } from "@/index.js";
import { settingManager, settings } from "@/storage/settings.js";
import { addCommand } from "@/ui/chat/add.js";
import * as chatNode from "@/ui/chat/manager.js";
import { disconnect } from "@/ux/disconnect.js";

const autoskip = () => (settings.autoskip = !settings.autoskip);

const stop = () => disconnect(false);

const server = () => backend.serverFinder();

const project = () => sendMessage("https://github.com/PWall2222/OmClient");

const setting = () => addCommand(JSON.stringify(settings, null, 4));

const clearCmd = () => cmd.clear();

const clearChat = () => chatNode.clear();

const save = () => settingManager.save();

export { autoskip, stop, server, project, clearCmd, clearChat, save, setting };
