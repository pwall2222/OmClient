const clearArray = function (array: any[]) {
	return array.splice(0, array.length);
};

const createElement = function (domObject: domObject) {
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

const createChild = function (parent: string, domObject: domObject) {
	const child = createElement(domObject);
	document.querySelector(parent).appendChild(child);
};

const createChildBefore = function (parent: string, reference: string, domObject: domObject) {
	const child = createElement(domObject);
	const parentNode = document.querySelector(parent);
	const referenceNode = parentNode.querySelector(reference);
	parentNode.insertBefore(child, referenceNode);
};

const clearChilds = function (nodeName: string) {
	const node = document.querySelector(nodeName);
	node.textContent = "";
};

const clearAllElements = function (nodeName: string) {
	const nodes = document.querySelectorAll(nodeName);
	nodes.forEach((element) => {
		element.remove();
	});
};

const setFirstByIndex = function (array: object[], index: number) {
	if (index > -1) {
		const identy = array.splice(index, 1);
		array.unshift(identy[0]);
	}
};

const hash = function (string: string) {
	let hash = 0;
	if (string.length === 0) return hash;
	for (let i = 0; i < string.length; i++) {
		const chr = string.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0;
	}
	return hash;
};
