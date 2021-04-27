import { settings } from "storage/settings.js";
import { skip } from "./disconnect.js";

const idHistory: string[] = [];

const checkId = (id: string) => idHistory.some((functionId: string) => functionId == id);

const saveLocal = () => localStorage.setItem("idHistory", JSON.stringify(idHistory));

const loadLocal = () => {
	const parsed = JSON.parse(localStorage.getItem("idHistory"));
	idHistory.push(...parsed);
};

const twiceSkipping = (id: string) => {
	if (checkId(id) && settings.twiceskip) {
		skip();
		return;
	}
	idHistory.push(id);
	saveLocal();
};

loadLocal();

export { twiceSkipping };
