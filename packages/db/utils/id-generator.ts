import { customAlphabet } from "nanoid";

export const lowercase = "abcdefghijklmnopqrstuvwxyz";
export const numbers = "0123456789";

type GenerateIDOptions = {
	length?: number;
};

const generateID = (options: GenerateIDOptions = {}) => {
	const { length = 16 } = options;
	return customAlphabet(lowercase + numbers, length)();
};

export { generateID };
