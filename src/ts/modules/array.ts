const clearArray = <T>(array: T[]) => array.splice(0, array.length);

const getRandomItem = <T>(array: T[]) => array[Math.floor(Math.random() * array.length)];

const setFirstByIndex = <T>(array: T[], index: number) => {
	if (index < -1) {
		return;
	}
	const identy = array.splice(index, 1);
	array.unshift(identy[0]);
};

const setFirst = <T>(array: T[], find: (value: T, index: number, obj: T[]) => unknown) => {
	const index = array.findIndex(find);
	setFirstByIndex(array, index);
};

export { clearArray, getRandomItem, setFirstByIndex, setFirst };
