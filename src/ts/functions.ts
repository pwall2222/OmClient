const clearArray = (array: any[]) => array.splice(0, array.length);

const getRandomItem = (array: any[]) => array[Math.floor(Math.random() * array.length)];

const setFirstByIndex = (array: object[], index: number) => {
	if (index > -1) {
		const identy = array.splice(index, 1);
		array.unshift(identy[0]);
	}
};

const createElement = (domObject: domObject) => {
	const element = document.createElement(domObject.tag);
	if (domObject.args) {
		for (const key in domObject.args) {
			element[key] = domObject.args[key];
		}
	}
	if (domObject.child) {
		element.appendChild(createElement(domObject.child));
	}
	return element;
};

const createChild = (parent: string, domObject: domObject) => {
	const child = createElement(domObject);
	document.querySelector(parent).appendChild(child);
};

const createChildBefore = (parent: string, reference: string, domObject: domObject) => {
	const child = createElement(domObject);
	const parentNode = document.querySelector(parent);
	const referenceNode = parentNode.querySelector(reference);
	parentNode.insertBefore(child, referenceNode);
};

const clearChilds = (nodeName: string) => {
	const node = document.querySelector(nodeName);
	node.textContent = "";
};

const clearAllElements = (nodeName: string) => {
	const nodes = document.querySelectorAll(nodeName);
	nodes.forEach((element: Element) => {
		element.remove();
	});
};

const hash = (string: string) => {
	let hash = 0;
	if (string.length !== 0) {
		for (let i = 0; i < string.length; i++) {
			const chr = string.charCodeAt(i);
			hash = (hash << 5) - hash + chr;
			hash |= 0;
		}
	}
	return hash;
};

const encodeObject = (data: object) => {
	const formData: string[] = [];
	const append = function (key: string, value: string) {
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

export { clearAllElements, clearChilds };
export { clearArray, getRandomItem, setFirstByIndex };
export { createElement, createChild, createChildBefore };
export { hash };
export { encodeObject };
export { allowUnload, blockUnload };
