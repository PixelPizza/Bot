import { stripIndents } from "common-tags";
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

	public static getDefaults() {
		return {
			deliveryMessage: stripIndents`
				Hello {customer:tag},

				Here is your order

				id: {orderID}
				order: {order}
				server: {guild}
				channel: {channel}

				Ordered at: {orderdate:date}
				Cooked at: {cookdate:date}
				Delivered at: {deliverydate:date}

				It has been cooked by {chef:tag}
				It has been delivered by {deliverer:tag}

				I hope the order is what you wanted. If you have any complaints, please join our server and tell us.
				If you want to join our server this is the invite {invite}

				I hope you have a great day! bye!
				{image}
			`
		};
	}
}
