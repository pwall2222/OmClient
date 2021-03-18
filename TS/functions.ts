const clearArray = (array: any[]) => {
	return array.splice(0, array.length);
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

const setFirstByIndex = (array: object[], index: number) => {
	if (index > -1) {
		const identy = array.splice(index, 1);
		array.unshift(identy[0]);
	}
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