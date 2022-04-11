import { Model } from "../pieces/ModelManager";

interface MessageTypes {
	id: string;
	channel: string;
	order: string;
}

export class Message extends Model<MessageTypes> {
	public get id() {
		return this.getDataValue("id");
	}

	public get channel() {
		return this.getDataValue("channel");
	}

	public get order() {
		return this.getDataValue("order");
	}
}
