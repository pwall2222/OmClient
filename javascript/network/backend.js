import {
	getRandomItem,
	setFirst,
} from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.1/javascript/modules/array.js";
import { encodeObject } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.0.1/javascript/modules/functions.js";
class Backend {
	constructor({ eventHandler, connectionArgs, errorHandler }) {
		this.sendIdentifiedPOST = (path, data) => {
			const sendData = data || {};
			const plainObject = { id: this.id, ...sendData };
			const encodedData = encodeObject(plainObject);
			return this.sendPOST(path, encodedData);
		};
		this.disconnect = () => this.sendIdentifiedPOST("disconnect");
		this.executer = eventHandler;
		this.connectionArgs = connectionArgs;
		this.errorHandler = errorHandler;
	}
	async sendPOST(path, data) {
		const response = fetch(`https://${this.server}.omegle.com/${path}`, {
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
	async connect() {
		const args = encodeObject(this.connectionArgs());
		const url = `https://${this.server}.omegle.com/start?${args}`;
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
		const rawDataPromise = fetch("https://omegle.com/status");
		rawDataPromise.catch(this.errorHandler);
		const rawData = await rawDataPromise;
		const info = await rawData.json();
		this.server = getRandomItem(info.servers);
	}
	eventParser(events) {
		const data = events.length ? events : [["keepAlive"]];
		setFirst(data, (element) => element[0] === "identDigests");
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

//# sourceMappingURL=backend.js.map
