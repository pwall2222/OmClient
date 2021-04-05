import { encodeObject, getRandomItem, setFirstByIndex } from "./functions.js";

class Backend {
	executer: Function;
	settings: setting;
	server: string;
	id: string;

	constructor(eventExecuter: Function, settings: setting) {
		this.executer = eventExecuter;
		this.settings = settings;
	}

	sendPOST(path: string, data: string) {
		return fetch(`https://${this.server}.omegle.com/${path}`, {
			method: "POST",
			body: data,
			headers: {
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			referrerPolicy: "no-referrer",
		});
	}

	sendIdentifiedPOST = (path: string, data?: object) => this.sendPOST(path, encodeObject({ id: this.id, ...(data || {}) }));

	disconnect = () => this.sendIdentifiedPOST("disconnect");

	async connect() {
		const arg = {
			webrtc: true,
			firstevents: false,
			lang: this.settings.lang,
			topics: this.settings.likes,
		};

		if (!this.settings.likes_enabled) {
			delete arg.topics;
		}

		if (!this.settings.video) {
			delete arg.webrtc;
		}

		const url = `https://${this.server}.omegle.com/start?${encodeObject(arg)}`;
		const response = await fetch(url, {
			method: "POST",
			referrerPolicy: "no-referrer",
		});
		return response.json();
	}

	async subscribe() {
		const response = await this.sendIdentifiedPOST("events");
		if (response.status == 200) {
			const events = await response.json();
			if (events != null) {
				this.eventParser(events);
				await this.subscribe();
			}
		} else {
			console.log({ responseCode: response.status, responseText: response.statusText });
		}
	}

	async newConnection() {
		const info = await this.connect();
		this.id = info.clientID;
		this.eventParser(info.events);
		this.subscribe();
	}

	async serverFinder() {
		const rawData = await fetch("https://omegle.com/status");
		const info = await rawData.json();
		this.server = getRandomItem(info.servers);
	}

	eventParser(events: object[]) {
		this.setIdentityFirst(events);
		for (const element of events) {
			const event = {
				name: element[0],
				data: element[1],
			};
			this.executer(event);
		}
	}

	setIdentityFirst(events: object[]) {
		const index = events.findIndex((element: string[]) => element[0] === "identDigests");
		setFirstByIndex(events, index);
	}
}

export { Backend };
