const clearArray = (array) => array.splice(0, array.length);
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
const setFirstByIndex = (array, index) => {
    if (index < -1) {
        return;
    }
    const identy = array.splice(index, 1);
    array.unshift(identy[0]);
};
const setFirst = (array, find) => {
    const index = array.findIndex(find);
    setFirstByIndex(array, index);
};
export { clearArray, getRandomItem, setFirstByIndex, setFirst };

//# sourceMappingURL=array.js.map
