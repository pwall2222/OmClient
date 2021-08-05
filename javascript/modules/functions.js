const hash = (string) => {
    if (string.length === 0) {
        return 0;
    }
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        const chr = string.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
};
const encodeObject = (data) => {
    const formData = [];
    const append = (key, value) => {
        formData.push(key + "=" + encodeURIComponent(value));
    };
    for (const key in data) {
        const value = data[key];
        switch (typeof value) {
            case "string":
                append(key, value);
                break;
            case "object":
                append(key, JSON.stringify(value));
                break;
            case "boolean":
                append(key, Number(value).toString());
                break;
        }
    }
    return formData.join("&");
};
const blockUnload = () => (window.onbeforeunload = () => "");
const allowUnload = () => (window.onbeforeunload = null);
const addToGlobalThis = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
        globalThis[key] = value;
    }
};
export { hash };
export { encodeObject };
export { allowUnload, blockUnload };
export { addToGlobalThis };

//# sourceMappingURL=functions.js.map
