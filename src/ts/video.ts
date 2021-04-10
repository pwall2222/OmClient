import { errorHandler } from "./errorHandler.js";

const media = navigator.mediaDevices.getUserMedia({ video: true, audio: { echoCancellation: true } });
media.catch(errorHandler);

export { media };
