const clearArray = <Type>(array: Type[]) => array.splice(0, array.length);

const getRandomItem = <Type>(array: Type[]) => array[Math.floor(Math.random() * array.length)];

const setFirstByIndex = <Type>(array: Type[], index: number) => {
	if (index > -1) {
		const identy = array.splice(index, 1);
		array.unshift(identy[0]);
	}
};

const setFirst = <Type>(array: Type[], find: (value: Type, index: number, obj: Type[]) => unknown) => {
	const index = array.findIndex(find);
	setFirstByIndex(array, index);
};

export { clearArray, getRandomItem, setFirstByIndex, setFirst };
