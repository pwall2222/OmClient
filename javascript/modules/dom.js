const createElement = (domObject) => {
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
const createChild = (parent, domObject) => {
    const child = createElement(domObject);
    document.querySelector(parent).appendChild(child);
    return child;
};
const createChildBefore = (parent, reference, domObject) => {
    const child = createElement(domObject);
    const parentNode = document.querySelector(parent);
    const referenceNode = parentNode.querySelector(reference);
    parentNode.insertBefore(child, referenceNode);
    return child;
};
const clearChilds = (nodeName) => {
    const node = document.querySelector(nodeName);
    node.textContent = "";
};
const clearAllElements = (nodeName) => {
    const nodes = document.querySelectorAll(nodeName);
    nodes.forEach((element) => element.remove());
};
export { clearAllElements, clearChilds };
export { createElement, createChild, createChildBefore };

//# sourceMappingURL=dom.js.map
