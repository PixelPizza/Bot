import { isUri } from "valid-url";

export class Util {
	public static isImage(url: string) {
		return Boolean(isUri(url) && /\.(gif|jpe?g|tiff?|png|webp|bmp)(\?[^#]*)?(#.*)?$/i.test(url));
	}
}
