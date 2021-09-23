import { settings } from "https://cdn.jsdelivr.net/gh/pwall2222/OmClient@1.1.0/javascript/storage/settings.js";
import { skip } from "./disconnect.js";
const idHistory = [];
const checkId = (id) => idHistory.some((functionId) => functionId == id);
const saveLocal = () => localStorage.setItem("idHistory", JSON.stringify(idHistory));
const loadLocal = () => {
    const parsed = JSON.parse(localStorage.getItem("idHistory"));
    if (parsed == null) {
        return;
    }
    idHistory.push(...parsed);
};
const twiceSkipping = (id) => {
    if (checkId(id) && settings.twiceskip) {
        skip();
        return true;
    }
    idHistory.push(id);
    saveLocal();
};
export { twiceSkipping, loadLocal };

//# sourceMappingURL=twiceSkip.js.map
