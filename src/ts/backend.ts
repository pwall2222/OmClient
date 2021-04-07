import { encodeObject, getRandomItem, setFirst } from "./functions.js";

class Backend {
	executer: Function;
	errorHandler: (error: any) => void;
	settings: setting;
	server: string;
	id: string;

	constructor({ eventHandler, settings, errorHandler }: { eventHandler: Function; settings: setting; errorHandler: (error: any) => void }) {
		this.executer = eventHandler;
		this.settings = settings;
		this.errorHandler = errorHandler;
	}

	async sendPOST(path: string, data: string) {
		const response = fetch(`https://${this.server}.omegle.com/${path}`, {
			method: "POST",
			body: data,
			headers: {
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			referrerPolicy: "no-referrer",
		});
		response.catch(this.errorHandler);
		return response;
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
		const responsePromise = fetch(url, {
			method: "POST",
			referrerPolicy: "no-referrer",
		});
		responsePromise.catch(this.errorHandler);
		const response = await responsePromise;
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
		if (!this.server) {
			throw "No server";
		}
		const info = await this.connect();
		this.id = info.clientID;
		this.eventParser(info.events);
		this.subscribe();
	}

	async serverFinder() {
		const rawDataPromise = fetch("https://omegle.com/status");
		rawDataPromise.catch(this.errorHandler);
		const rawData = await rawDataPromise;
		const info = await rawData.json();
		this.server = getRandomItem(info.servers);
	}

	eventParser(events: object[]) {
		setFirst(events, (element: string[]) => element[0] === "identDigests");
		for (const element of events) {
			const event = {
				name: element[0],
				data: element[1],
			};
			this.executer(event);
		}
	}
}

export { Backend };
