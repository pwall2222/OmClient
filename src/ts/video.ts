import { errorHandler } from "./errorHandler.js";

const mediaPromise = navigator.mediaDevices.getUserMedia({ video: true, audio: { echoCancellation: true } });
mediaPromise.catch(errorHandler);
const media = await mediaPromise;

export { media };
