import * as cmd from "./interface.js";
import { commands } from "./list.js";
const commandHandler = (contents) => {
    const command = new UserCommand(contents);
    commandExecuter(command);
    cmd.handleHistory(contents);
};
const commandExecuter = (command) => {
    const finder = (obj) => obj.alias.some((alias) => alias === command.name);
    const commandFunction = commands.find(finder).exec;
    commandFunction.call({ ...command });
};
class UserCommand {
    raw;
    full;
    name;
    arguments;
    list;
    constructor(content) {
        this.raw = content.slice(1);
        this.full = this.raw.split(" ");
        this.name = this.full[0];
        this.arguments = this.full.slice(1, this.full.length);
        this.list = this.arguments.join(" ").split(",");
    }
}
export { commandHandler, UserCommand };

//# sourceMappingURL=handler.js.map
