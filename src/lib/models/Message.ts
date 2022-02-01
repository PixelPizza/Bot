import { Model } from "../pieces/ModelManager";

interface MessageTypes {
	id: string;
    channelId: string;
    orderId: string;
}

export class Message extends Model<MessageTypes> {
    public get id() {
        return this.getDataValue("id");
    }

    public get channelId() {
        return this.getDataValue("channelId");
    }

    public get orderId() {
        return this.getDataValue("orderId");
    }
}