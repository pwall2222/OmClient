import { getRandomItem, setFirst } from "modules/array.js";
import { encodeObject } from "modules/functions.js";

interface backendArguments {
	eventHandler: Executer;
	errorHandler: ErrorHandler;
	connectionArgs: ConnectionArgs;
}

type ConnectionArgs = () => Record<string, unknown>;
type Executer = (event: { name: string; data?: EventData }) => void | boolean;
type ErrorHandler = (error: string | Error) => void;
type EventData = string | Record<string, unknown>;
type Event = [string, EventData?];

class Backend {
	executer: Executer;
	errorHandler: ErrorHandler;
	connectionArgs: ConnectionArgs;
	server: string;
	id: string;
	host = window.location.host || window.parent.location.host;
	domain = this.host.replace("www.", "");
	protocol = window.location.protocol;

	constructor({ eventHandler, connectionArgs, errorHandler }: backendArguments) {
		this.executer = eventHandler;
		this.connectionArgs = connectionArgs;
		this.errorHandler = errorHandler;
	}

	craftURL(server: string, path: string) {
		const { protocol, domain } = this;
		return `${protocol}//${server}.${domain}/${path}`;
	}

	async sendPOST(path: string, data: string) {
		const response = fetch(this.craftURL(this.server, path), {
			method: "POST",
			body: data,
			headers: {
				"content-type": "application/x-www-form-urlencoded",
			},
			referrerPolicy: "no-referrer",
		});
		response.catch(this.errorHandler);
		return response;
	}

	sendIdentifiedPOST = (path: string, data?: Record<string, unknown>) => {
		const sendData = data || {};
		const plainObject = { id: this.id, ...sendData };
		const encodedData = encodeObject(plainObject);
		return this.sendPOST(path, encodedData);
	}

	disconnect = () => this.sendIdentifiedPOST("disconnect");

	async connect() {
		const args = encodeObject(this.connectionArgs());
		const url = this.craftURL(this.server, `start?${args}`);
		const responsePromise = fetch(url, {
			method: "POST",
			referrerPolicy: "no-referrer",
		});
		responsePromise.catch(this.errorHandler);
		const response = await responsePromise;
		return response.json();
	}

	async subscribe() {
		while (true) {
			const response = await this.sendIdentifiedPOST("events");
			if (!response.ok) {
				break;
			}
			const events = await response.json().catch(() => []);
			if (events == null) {
				this.executer({ name: "nullRequest" });
				break;
			}
			this.eventParser(events);
		}
	}

	async newConnection() {
		if (!this.server) {
			this.serverFinder();
			this.errorHandler("NoServer");
			return;
		}
		const info = await this.connect();
		this.id = info.clientID;
		this.eventParser(info.events);
		this.subscribe();
	}

	async serverFinder() {
		const rawDataPromise = fetch(this.craftURL("chatserv", "status"));
		rawDataPromise.catch(this.errorHandler);
		const rawData = await rawDataPromise;
		const info = await rawData.json();
		this.server = getRandomItem(info.servers);
	}

	eventParser(events: Event[]) {
		const data = events.length ? events : [["keepAlive"]];
		setFirst(data, (element: EventData[]) => element[0] === "identDigests");
		for (const element of data) {
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
