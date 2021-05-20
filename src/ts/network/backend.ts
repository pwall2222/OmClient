import { getRandomItem, setFirst } from "modules/array.js";
import { encodeObject } from "modules/functions.js";

interface setting {
	likes: string[];
	likes_enabled: boolean;
	lang: string;
	video: boolean;
}

interface backendArguments {
	eventHandler: Executer;
	errorHandler: ErrorHandler;
	settings: setting;
}

type Executer = (event: { name: string; data?: EventData }) => void | boolean;
type ErrorHandler = (error: string | Error) => void;
type EventData = string | Record<string, unknown>;
type Event = [string, EventData];

class Backend {
	executer: Executer;
	errorHandler: ErrorHandler;
	settings: setting;
	server: string;
	id: string;

	constructor({ eventHandler, settings, errorHandler }: backendArguments) {
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

	sendIdentifiedPOST = (path: string, data?: Record<string, unknown>) => this.sendPOST(path, encodeObject({ id: this.id, ...(data || {}) }));

	disconnect = () => this.sendIdentifiedPOST("disconnect");

	async connect() {
		const args = encodeObject(this.connectSettings());
		const url = `https://${this.server}.omegle.com/start?${args}`;
		const responsePromise = fetch(url, {
			method: "POST",
			referrerPolicy: "no-referrer",
		});
		responsePromise.catch(this.errorHandler);
		const response = await responsePromise;
		return response.json();
	}

	connectSettings() {
		const { video, likes_enabled, likes, lang } = this.settings;
		const arg = {
			webrtc: true,
			firstevents: false,
			lang: lang,
			topics: likes,
		};

		if (!likes_enabled) {
			delete arg.topics;
		}

		if (!video) {
			delete arg.webrtc;
		}
		return arg;
	}

	async subscribe() {
		while (true) {
			const response = await this.sendIdentifiedPOST("events");
			if (response.status !== 200) {
				console.log({ responseCode: response.status, responseText: response.statusText });
				break;
			}
			const events = await response.json();
			if (events == null) {
				break;
			}
			this.eventParser(events);
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

	eventParser(events: Event[]) {
		setFirst(events, (element: EventData[]) => element[0] === "identDigests");
		for (const element of events) {
			const event = {
				name: element[0],
				data: element[1],
			};
			const doBreak = this.executer(event);
			if (doBreak) {
				break;
			}
		}
	}
}

export { Backend };
