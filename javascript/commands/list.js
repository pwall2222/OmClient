import * as functions from "./functions.js";
const commands = [
    {
        name: "Help",
        alias: ["help"],
        description: "Shows the help information",
        exec: functions.help,
    },
    {
        name: "Set",
        alias: ["set"],
        description: "Sets one of the avaliable settings",
        exec: functions.set,
    },
    {
        name: "Skip",
        alias: ["skip"],
        description: "Skips current person starting a new chat",
        exec: functions.skip,
    },
    {
        name: "Disconnect",
        alias: ["disconnect"],
        description: "Disconnects from the current stranger",
        exec: functions.disconnect,
    },
    {
        name: "Save",
        alias: ["save"],
        description: "Saves settings to localStorage",
        exec: functions.save,
    },
    {
        name: "Text",
        alias: ["text"],
        description: "Passes mode to text and makes a new chat",
        exec: functions.text,
    },
    {
        name: "Video",
        alias: ["video"],
        description: "Passes mode to video and makes a new chat",
        exec: functions.video,
    },
    {
        name: "Socials",
        alias: ["socials"],
        description: "Sends socials to stranger",
        exec: functions.socials,
    },
    {
        name: "Social",
        alias: ["social", "sendSocial"],
        description: "Sends one social to stranger",
        exec: functions.social,
    },
    {
        name: "Autoskip",
        alias: ["autoskip"],
        description: "Switches autoskip",
        exec: functions.autoskip,
    },
    {
        name: "Send",
        alias: ["send"],
        description: "Sends a message in chat",
        exec: functions.send,
    },
    {
        name: "Set volume",
        alias: ["volume", "vol"],
        description: "Sets stranger volume",
        exec: functions.volume,
    },
    {
        name: "Stop",
        alias: ["stop"],
        description: "Disconnects from current stranger and stops rerolling temporally",
        exec: functions.stop,
    },
    {
        name: "Server",
        alias: ["server"],
        description: "Get a server for running the backend",
        exec: functions.server,
    },
    {
        name: "Send Project",
        alias: ["project"],
        description: "Sends project url to stranger",
        exec: functions.project,
    },
    {
        name: "Settings",
        alias: ["settings"],
        description: "Displays settings in chat",
        exec: functions.setting,
    },
    {
        name: "Clear Command History",
        alias: ["clear_history"],
        description: "Clears the command history",
        exec: functions.clearCmd,
    },
    {
        name: "Theme",
        alias: ["theme"],
        description: "Sets the theme",
        exec: functions.theme,
    },
    {
        name: "Likes",
        alias: ["likes", "set_likes"],
        description: "Sets likes",
        exec: functions.likes,
    },
    {
        name: "Clear",
        alias: ["clear"],
        description: "Clears chat",
        exec: functions.clearChat,
    },
    {
        name: "Bind",
        alias: ["bind"],
        description: "Bind a key",
        exec: functions.bind,
    },
    {
        name: "Mute",
        alias: ["mute"],
        description: "Gives you the hability to mute the video, audio or both",
        exec: functions.mute,
    },
    {
        name: "Bindings",
        alias: ["binds", "bindings"],
        description: "Utility to manage your bindings",
        exec: functions.binds,
    },
];
export { commands };

//# sourceMappingURL=list.js.map
