const clearArray = (array: any[]) => array.splice(0, array.length);

const getRandomItem = (array: any[]) => array[Math.floor(Math.random() * array.length)];

const setFirstByIndex = (array: any[], index: number) => {
	if (index > -1) {
		const identy = array.splice(index, 1);
		array.unshift(identy[0]);
	}
};

const setFirst = (array: any[], find: (value: any, index: number, obj: any[]) => unknown) => {
	const index = array.findIndex(find);
	setFirstByIndex(array, index);
};

export { clearArray, getRandomItem, setFirstByIndex, setFirst };
