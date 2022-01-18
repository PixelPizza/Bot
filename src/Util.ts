import { isUri } from "valid-url";

export class Util {
	public static isImage(url: string) {
		return Boolean(isUri(url) && /\.(gif|jpe?g|tiff?|png|webp|bmp)(\?[^#]*)?(#.*)?$/i.test(url));
	}

	public static makeUserRegex(name: string) {
		return `${name}(?:: *(tag|id|username|name|ping|mention))?`;
	}

	public static makeDateRegex(name: string) {
		return `${name}date(?:: *(date|time|datetime))?`;
	}
}
