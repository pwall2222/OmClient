import { chatNode } from "./chat.js";
import { encodeObject } from "./functions.js";
import { session } from "./session.js";
import { settings } from "./settings.js";

const backend = {
	sendPOST(path: string, data: string) {
		return fetch(`https://${session.current.server}.omegle.com/${path}`, {
			method: "POST",
			body: data,
			headers: {
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			referrerPolicy: "no-referrer",
		});
	},
	sendIdentifiedPOST: (path: string, data?: object) => backend.sendPOST(path, encodeObject({ id: session.current.id, ...(data || {}) })),
	async connect() {
		const args = ["firstevents=0", `lang=${settings.lang}`];

		if (settings.likes_enabled) {
			args.push(`topics=${encodeURIComponent(JSON.stringify(settings.likes))}`);
		}

		if (settings.video) {
			args.push("webrtc=1");
		}

		const url = `https://${session.current.server}.omegle.com/start?${args.join("&")}`;
		const response = await fetch(url, { method: "POST", referrerPolicy: "no-referrer" });
		return response.json();
	},
	disconnect: () => backend.sendIdentifiedPOST("disconnect"),
	async server() {
		try {
			const info = await fetch("https://omegle.com/status").then((data: Response) => data.json());
			session.current.server = info.servers[Math.floor(Math.random() * info.servers.length)];
		} catch (error) {
			chatNode.add.status.default("Couldn't fetch server status");
		}
	},
};

export { backend };
